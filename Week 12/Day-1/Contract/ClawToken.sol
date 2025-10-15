// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/utils/Arrays.sol";
import "./ClawTokenLogic.sol";

/**
 * @title Claw Token
 * @author Asad-Ali-9203
 * @notice Advanced ERC-20 token with comprehensive race condition protection
 * @dev Deploys with 1 billion tokens (adjustable in constructor)
 * 
 * Features:
 * - Burnable: Token holders can burn tokens
 * - Pausable: Emergency pause functionality
 * - Permit (EIP-2612): Gasless approvals
 * - Snapshots: Balance snapshots for governance
 * - 2-Step Ownership: Safe ownership transfers
 * - Transfer Tax: Configurable tax (max 10%)
 * - Blacklist: Address blacklisting
 * - Max Transaction Limit: Anti-whale protection
 * - Batch Operations: Gas-efficient operations
 * - Reentrancy Protection: All critical functions protected
 * - 24-Hour Timelock: For critical parameter changes
 * 
 * Race Condition Protections:
 * 1. Reentrancy guards on all state-changing functions
 * 2. Approval race condition prevention (only 0 to X or X to 0)
 * 3. 24-hour timelock on critical parameter changes
 * 4. Permit replay attack protection
 * 5. Check-effects-interactions pattern
 * 6. 2-step ownership transfer
 * 7. Atomic batch operations
 * 8. Blacklist checks on all transfers
 */
contract ClawToken is 
    ERC20, 
    ERC20Burnable, 
    ERC20Pausable, 
    ERC20Permit, 
    ClawTokenLogic 
{
    using Arrays for uint256[];
    
    // ============ Snapshot Storage ============
    
    struct Snapshots {
        uint256[] ids;
        uint256[] values;
    }
    
    uint256 private _currentSnapshotId;
    mapping(address => Snapshots) private _accountBalanceSnapshots;
    Snapshots private _totalSupplySnapshots;
    
    event Snapshot(uint256 id);
    
    // ============ Constructor ============
    
    /// @notice Initializes Claw Token
    /// @param initialSupply Initial supply (e.g., 1000000000 * 10**18 for 1 billion tokens)
    constructor(uint256 initialSupply) 
        ERC20("Claw", "CLAW") 
        ERC20Permit("Claw")
        Ownable(msg.sender)
    {
        taxReceiver = msg.sender;
        taxRate = 300; // 3% default tax
        maxTransactionAmount = initialSupply / 100; // 1% of supply
        
        // Exclude from fees and limits
        excludedFromTax[msg.sender] = true;
        excludedFromTax[address(this)] = true;
        excludedFromMaxTransaction[msg.sender] = true;
        excludedFromMaxTransaction[address(this)] = true;
        excludedFromMaxTransaction[address(0)] = true;
        
        _mint(msg.sender, initialSupply);
    }
    
    // ============ Snapshot Functions ============
    
    /// @notice Get balance at specific snapshot
    /// @param account The account address to query
    /// @param snapshotId The snapshot ID
    /// @return The balance at that snapshot
    function balanceOfAt(address account, uint256 snapshotId) public view returns (uint256) {
        (bool snapshotted, uint256 value) = _valueAt(snapshotId, _accountBalanceSnapshots[account]);
        return snapshotted ? value : balanceOf(account);
    }
    
    /// @notice Get total supply at specific snapshot
    /// @param snapshotId The snapshot ID
    /// @return The total supply at that snapshot
    function totalSupplyAt(uint256 snapshotId) public view returns (uint256) {
        (bool snapshotted, uint256 value) = _valueAt(snapshotId, _totalSupplySnapshots);
        return snapshotted ? value : totalSupply();
    }
    
    // ============ Approval Race Condition Prevention ============
    
    /// @notice Safe approve - prevents race conditions
    /// @dev Only allows 0 to X or X to 0, use increaseAllowance/decreaseAllowance otherwise
    /// @param spender The address to approve
    /// @param value The amount to approve
    /// @return bool indicating success
    function approve(address spender, uint256 value) 
        public 
        virtual 
        override(ERC20) 
        returns (bool) 
    {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        
        if (currentAllowance != 0 && value != 0) {
            revert ApprovalRaceCondition();
        }
        
        _approve(owner, spender, value);
        return true;
    }
    
    /// @notice Safely increases allowance
    /// @param spender The address to increase allowance for
    /// @param addedValue The amount to add
    /// @return bool indicating success
    function increaseAllowance(address spender, uint256 addedValue) 
        public 
        virtual 
        returns (bool) 
    {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }
    
    /// @notice Safely decreases allowance
    /// @param spender The address to decrease allowance for
    /// @param requestedDecrease The amount to subtract
    /// @return bool indicating success
    function decreaseAllowance(address spender, uint256 requestedDecrease) 
        public 
        virtual 
        returns (bool) 
    {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        
        if (currentAllowance < requestedDecrease) {
            revert ERC20InsufficientAllowance(spender, currentAllowance, requestedDecrease);
        }
        
        unchecked {
            _approve(owner, spender, currentAllowance - requestedDecrease);
        }
        return true;
    }
    
    // ============ Enhanced Permit with Replay Protection ============
    
    /// @notice Permit with replay attack protection
    /// @param owner The token owner granting approval
    /// @param spender The address being approved
    /// @param value The amount being approved
    /// @param deadline The deadline timestamp for the permit
    /// @param v The recovery byte of the signature
    /// @param r Half of the ECDSA signature pair
    /// @param s Half of the ECDSA signature pair
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual override(ERC20Permit) {
        bytes32 signatureHash = keccak256(
            abi.encodePacked(owner, spender, value, deadline, v, r, s)
        );
        
        if (_usedPermitSignatures[owner][signatureHash]) {
            revert PermitAlreadyUsed();
        }
        
        _usedPermitSignatures[owner][signatureHash] = true;
        super.permit(owner, spender, value, deadline, v, r, s);
    }
    
    // ============ Internal Override Functions ============
    
    /// @notice Internal transfer with tax, limits, and blacklist checks
    /// @dev Overrides ERC20 and ERC20Pausable _update function
    /// @param from The address tokens are transferred from
    /// @param to The address tokens are transferred to
    /// @param value The amount of tokens to transfer
    function _update(
        address from,
        address to,
        uint256 value
    ) 
        internal 
        virtual 
        override(ERC20, ERC20Pausable)
        notBlacklisted(from)
        notBlacklisted(to)
    {
        // Update snapshots before balance changes
        if (from != address(0)) {
            _updateAccountSnapshot(_accountBalanceSnapshots[from], balanceOf(from));
        }
        if (to != address(0)) {
            _updateAccountSnapshot(_accountBalanceSnapshots[to], balanceOf(to));
        }
        _updateSnapshot(_totalSupplySnapshots, totalSupply());
        
        // Check limits and apply tax for normal transfers (not mint/burn)
        if (from != address(0) && to != address(0)) {
            // Max transaction check
            if (!excludedFromMaxTransaction[from] && !excludedFromMaxTransaction[to]) {
                if (value > maxTransactionAmount) {
                    revert ExceedsMaxTransactionAmount(value, maxTransactionAmount);
                }
            }
            
            // Apply tax if enabled
            if (!excludedFromTax[from] && !excludedFromTax[to] && taxRate > 0) {
                uint256 taxAmount = (value * taxRate) / 10000;
                uint256 transferAmount = value - taxAmount;
                
                // Transfer tax to receiver
                super._update(from, taxReceiver, taxAmount);
                emit TaxCollected(from, taxReceiver, taxAmount);
                
                // Transfer remaining to recipient
                super._update(from, to, transferAmount);
                return;
            }
        }
        
        // No tax applied, proceed with normal transfer
        super._update(from, to, value);
    }
    
    // ============ Snapshot Internal Functions ============
    
    /// @notice Updates account snapshot
    /// @param snapshots The snapshot structure to update
    /// @param currentValue The current value to snapshot
    function _updateAccountSnapshot(Snapshots storage snapshots, uint256 currentValue) private {
        _updateSnapshot(snapshots, currentValue);
    }
    
    /// @notice Updates a snapshot structure
    /// @param snapshots The snapshot structure to update
    /// @param currentValue The current value to snapshot
    function _updateSnapshot(Snapshots storage snapshots, uint256 currentValue) private {
        uint256 current = _currentSnapshotId;
        if (_lastSnapshotId(snapshots.ids) < current) {
            snapshots.ids.push(current);
            snapshots.values.push(currentValue);
        }
    }
    
    /// @notice Retrieves value at a specific snapshot
    /// @param snapshotId The snapshot ID to query
    /// @param snapshots The snapshot structure to query
    /// @return bool indicating if snapshot exists
    /// @return uint256 the value at that snapshot
    function _valueAt(uint256 snapshotId, Snapshots storage snapshots) private view returns (bool, uint256) {
        require(snapshotId > 0, "ClawToken: snapshot id is 0");
        require(snapshotId <= _currentSnapshotId, "ClawToken: nonexistent snapshot id");
        
        uint256 index = snapshots.ids.findUpperBound(snapshotId);
        
        if (index == snapshots.ids.length) {
            return (false, 0);
        } else {
            return (true, snapshots.values[index]);
        }
    }
    
    /// @notice Gets the last snapshot ID from an array
    /// @param ids The array of snapshot IDs
    /// @return The last snapshot ID or 0 if empty
    function _lastSnapshotId(uint256[] storage ids) private view returns (uint256) {
        if (ids.length == 0) {
            return 0;
        } else {
            return ids[ids.length - 1];
        }
    }
    
    // ============ Virtual Function Implementations ============
    
    /// @notice Internal function to mint tokens
    /// @param to The address to mint tokens to
    /// @param amount The amount to mint
    function _mintTokens(address to, uint256 amount) internal override {
        _mint(to, amount);
    }
    
    /// @notice Internal function to pause the token
    function _pauseToken() internal override {
        _pause();
    }
    
    /// @notice Internal function to unpause the token
    function _unpauseToken() internal override {
        _unpause();
    }
    
    /// @notice Internal function to create a snapshot
    /// @return The new snapshot ID
    function _createSnapshot() internal override returns (uint256) {
        _currentSnapshotId += 1;
        uint256 currentId = _currentSnapshotId;
        emit Snapshot(currentId);
        return currentId;
    }
    
    // ============ Receive Functions ============
    
    /// @notice Allows contract to receive ETH
    receive() external payable {}
    
    /// @notice Fallback function for unknown calls
    fallback() external payable {}
}