// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ClawTokenStorage.sol";

/**
 * @title ClawTokenLogic
 * @author Asad-Ali-9203
 * @notice Core business logic for Claw Token advanced features
 * @dev Contains all administrative and configuration functions
 */
abstract contract ClawTokenLogic is ClawTokenStorage, Ownable2Step, ReentrancyGuard {
    
    // ============ Minting Functions ============
    
    /// @notice Mints new tokens to a specified address
    /// @param to The address to mint tokens to
    /// @param amount The amount of tokens to mint
    function mint(address to, uint256 amount) 
        external 
        onlyOwner 
        nonReentrant 
    {
        if (to == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();
        
        _mintTokens(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /// @notice Mints tokens to multiple addresses in a single transaction
    /// @param recipients Array of recipient addresses
    /// @param amounts Array of amounts corresponding to each recipient
    function batchMint(
        address[] calldata recipients, 
        uint256[] calldata amounts
    ) 
        external 
        onlyOwner 
        nonReentrant 
    {
        if (recipients.length != amounts.length) revert ArrayLengthMismatch();
        if (recipients.length == 0 || recipients.length > MAX_BATCH_SIZE) {
            revert BatchSizeExceeded(recipients.length);
        }
        
        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) revert InvalidAddress();
            if (amounts[i] == 0) revert InvalidAmount();
            
            _mintTokens(recipients[i], amounts[i]);
            emit TokensMinted(recipients[i], amounts[i]);
        }
    }
    
    // ============ Pause/Unpause Functions ============
    
    /// @notice Pauses all token transfers
    function pause() external onlyOwner {
        _pauseToken();
    }
    
    /// @notice Unpauses all token transfers
    function unpause() external onlyOwner {
        _unpauseToken();
    }
    
    // ============ Blacklist Functions ============
    
    /// @notice Adds an address to the blacklist
    /// @param account The address to blacklist
    function addToBlacklist(address account) external onlyOwner {
        if (account == owner()) revert CannotBlacklistOwner();
        if (blacklisted[account]) revert AccountBlacklisted(account);
        
        blacklisted[account] = true;
        emit Blacklisted(account);
    }
    
    /// @notice Removes an address from the blacklist
    /// @param account The address to remove from blacklist
    function removeFromBlacklist(address account) external onlyOwner {
        if (!blacklisted[account]) revert AccountNotBlacklisted(account);
        
        blacklisted[account] = false;
        emit UnBlacklisted(account);
    }
    
    /// @notice Adds multiple addresses to the blacklist in a single transaction
    /// @param accounts Array of addresses to blacklist
    function batchBlacklist(address[] calldata accounts) external onlyOwner {
        if (accounts.length == 0 || accounts.length > MAX_BATCH_SIZE) {
            revert BatchSizeExceeded(accounts.length);
        }
        
        for (uint256 i = 0; i < accounts.length; i++) {
            if (!blacklisted[accounts[i]] && accounts[i] != owner()) {
                blacklisted[accounts[i]] = true;
                emit Blacklisted(accounts[i]);
            }
        }
    }
    
    // ============ Tax Configuration Functions ============
    
    /// @notice Proposes a new tax rate with timelock protection
    /// @param newRate The new tax rate in basis points (100 = 1%)
    function proposeTaxRateChange(uint256 newRate) external onlyOwner {
        if (newRate > MAX_TAX_RATE) revert InvalidTaxRate(newRate);
        
        pendingTaxRateChange = PendingChange({
            value: newRate,
            addressValue: address(0),
            unlockTime: block.timestamp + TIMELOCK_DURATION,
            exists: true
        });
        
        emit TaxRateChangeProposed(newRate, block.timestamp + TIMELOCK_DURATION);
    }
    
    /// @notice Executes a pending tax rate change after timelock expires
    function executeTaxRateChange() external onlyOwner {
        if (!pendingTaxRateChange.exists) revert PendingChangeNotFound();
        if (block.timestamp < pendingTaxRateChange.unlockTime) {
            revert TimelockNotExpired(block.timestamp, pendingTaxRateChange.unlockTime);
        }
        
        uint256 oldRate = taxRate;
        taxRate = pendingTaxRateChange.value;
        
        delete pendingTaxRateChange;
        
        emit TaxRateUpdated(oldRate, taxRate);
    }
    
    /// @notice Revokes a pending tax rate change
    function revokeTaxRateChange() external onlyOwner {
        if (!pendingTaxRateChange.exists) revert PendingChangeNotFound();
        
        delete pendingTaxRateChange;
        emit PendingChangeRevoked("TaxRate");
    }
    
    /// @notice Updates the tax receiver address (immediate, less critical)
    /// @param newReceiver The new tax receiver address
    function setTaxReceiver(address newReceiver) external onlyOwner {
        if (newReceiver == address(0)) revert InvalidAddress();
        if (newReceiver == taxReceiver) revert NoConfigurationChange();
        
        address oldReceiver = taxReceiver;
        taxReceiver = newReceiver;
        
        emit TaxReceiverUpdated(oldReceiver, newReceiver);
    }
    
    // ============ Max Transaction Functions ============
    
    /// @notice Proposes a new max transaction amount with timelock protection
    /// @param newAmount The new maximum transaction amount
    function proposeMaxTransactionChange(uint256 newAmount) external onlyOwner {
        if (newAmount == 0) revert InvalidAmount();
        
        pendingMaxTransactionChange = PendingChange({
            value: newAmount,
            addressValue: address(0),
            unlockTime: block.timestamp + TIMELOCK_DURATION,
            exists: true
        });
        
        emit MaxTransactionChangeProposed(newAmount, block.timestamp + TIMELOCK_DURATION);
    }
    
    /// @notice Executes a pending max transaction change after timelock expires
    function executeMaxTransactionChange() external onlyOwner {
        if (!pendingMaxTransactionChange.exists) revert PendingChangeNotFound();
        if (block.timestamp < pendingMaxTransactionChange.unlockTime) {
            revert TimelockNotExpired(block.timestamp, pendingMaxTransactionChange.unlockTime);
        }
        
        uint256 oldAmount = maxTransactionAmount;
        maxTransactionAmount = pendingMaxTransactionChange.value;
        
        delete pendingMaxTransactionChange;
        
        emit MaxTransactionAmountUpdated(oldAmount, maxTransactionAmount);
    }
    
    /// @notice Revokes a pending max transaction change
    function revokeMaxTransactionChange() external onlyOwner {
        if (!pendingMaxTransactionChange.exists) revert PendingChangeNotFound();
        
        delete pendingMaxTransactionChange;
        emit PendingChangeRevoked("MaxTransaction");
    }
    
    // ============ Exclusion Functions ============
    
    /// @notice Sets whether an address is excluded from transfer tax
    /// @param account The address to configure
    /// @param excluded Whether the address should be excluded
    function setExcludedFromTax(address account, bool excluded) external onlyOwner {
        if (excludedFromTax[account] == excluded) revert NoConfigurationChange();
        excludedFromTax[account] = excluded;
    }
    
    /// @notice Sets whether an address is excluded from max transaction limit
    /// @param account The address to configure
    /// @param excluded Whether the address should be excluded
    function setExcludedFromMaxTransaction(address account, bool excluded) external onlyOwner {
        if (excludedFromMaxTransaction[account] == excluded) revert NoConfigurationChange();
        excludedFromMaxTransaction[account] = excluded;
    }
    
    // ============ Snapshot Functions ============
    
    /// @notice Creates a new snapshot of token balances
    /// @return The snapshot ID
    function snapshot() external onlyOwner returns (uint256) {
        return _createSnapshot();
    }
    
    // ============ Emergency Functions ============
    
    /// @notice Rescues accidentally sent ERC20 tokens
    /// @param token The token contract address
    /// @param to The address to send rescued tokens to
    /// @param amount The amount to rescue
    function rescueTokens(
        address token, 
        address to, 
        uint256 amount
    ) 
        external 
        onlyOwner 
        nonReentrant 
    {
        if (token == address(this)) revert CannotRescueOwnToken();
        if (to == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();
        
        // Use low-level call to handle non-standard tokens
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature("transfer(address,uint256)", to, amount)
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "ClawToken: Token rescue failed"
        );
    }
    
    /// @notice Rescues accidentally sent ETH
    /// @param to The address to send rescued ETH to
    /// @param amount The amount to rescue
    function rescueETH(address payable to, uint256 amount) 
        external 
        onlyOwner 
        nonReentrant 
    {
        if (to == address(0)) revert InvalidAddress();
        if (amount == 0 || amount > address(this).balance) revert InvalidAmount();
        
        (bool success, ) = to.call{value: amount}("");
        require(success, "ClawToken: ETH rescue failed");
    }
    
    // ============ Internal Virtual Functions ============
    
    function _mintTokens(address to, uint256 amount) internal virtual;
    function _pauseToken() internal virtual;
    function _unpauseToken() internal virtual;
    function _createSnapshot() internal virtual returns (uint256);
}