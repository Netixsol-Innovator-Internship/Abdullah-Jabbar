// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Claw Token
 * @dev Simplified ERC-20 token with core features aligned for DEX integration
 * Features:
 * - Burnable tokens
 * - Pausable transfers
 * - Minting capability
 * - Blacklist functionality
 * - Transfer tax (configurable, max 10%)
 * - Max transaction limit
 */
contract Claw is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ReentrancyGuard {
    // ============ Constants ============
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 billion tokens
    uint256 public constant MAX_TAX_RATE = 1000; // 10% (basis points)

    // ============ State Variables ============
    uint256 public taxRate; // Tax rate in basis points (100 = 1%)
    address public taxReceiver; // Address that receives taxes
    uint256 public maxTransactionAmount; // Maximum transaction amount

    // ============ Mappings ============
    mapping(address => bool) public blacklisted;
    mapping(address => bool) public excludedFromTax;
    mapping(address => bool) public excludedFromMaxTransaction;

    // ============ Events ============
    event Blacklisted(address indexed account);
    event UnBlacklisted(address indexed account);
    event TaxRateUpdated(uint256 oldRate, uint256 newRate);
    event TaxReceiverUpdated(
        address indexed oldReceiver,
        address indexed newReceiver
    );
    event MaxTransactionAmountUpdated(uint256 oldAmount, uint256 newAmount);
    event TokensMinted(address indexed to, uint256 amount);
    event TaxCollected(
        address indexed from,
        address indexed to,
        uint256 amount
    );

    // ============ Errors ============
    error AccountBlacklisted(address account);
    error AccountNotBlacklisted(address account);
    error CannotBlacklistOwner();
    error ExceedsMaxTransactionAmount(uint256 amount, uint256 maxAmount);
    error InvalidTaxRate(uint256 rate);
    error InvalidAddress();
    error InvalidAmount();
    error MaxSupplyExceeded();

    // ============ Constructor ============
    constructor(
        uint256 initialSupply
    ) ERC20("Claw", "CLAW") Ownable(msg.sender) {
        require(
            initialSupply <= MAX_SUPPLY,
            "Initial supply exceeds max supply"
        );

        taxReceiver = msg.sender;
        taxRate = 300; // 3% default tax
        maxTransactionAmount = initialSupply / 100; // 1% of supply

        // Exclude from fees and limits
        excludedFromTax[msg.sender] = true;
        excludedFromTax[address(this)] = true;
        excludedFromMaxTransaction[msg.sender] = true;
        excludedFromMaxTransaction[address(this)] = true;
        excludedFromMaxTransaction[address(0)] = true;

        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply);
        }
    }

    // ============ Minting Functions ============

    /// @notice Mint new tokens (only owner)
    /// @param to Address to mint tokens to
    /// @param amount Amount of tokens to mint
    function mint(address to, uint256 amount) external onlyOwner nonReentrant {
        if (to == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();
        if (totalSupply() + amount > MAX_SUPPLY) revert MaxSupplyExceeded();

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    // ============ Pause/Unpause Functions ============

    /// @notice Pause all token transfers
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause all token transfers
    function unpause() external onlyOwner {
        _unpause();
    }

    // ============ Blacklist Functions ============

    /// @notice Add address to blacklist
    /// @param account Address to blacklist
    function addToBlacklist(address account) external onlyOwner {
        if (account == owner()) revert CannotBlacklistOwner();
        if (blacklisted[account]) revert AccountBlacklisted(account);

        blacklisted[account] = true;
        emit Blacklisted(account);
    }

    /// @notice Remove address from blacklist
    /// @param account Address to remove from blacklist
    function removeFromBlacklist(address account) external onlyOwner {
        if (!blacklisted[account]) revert AccountNotBlacklisted(account);

        blacklisted[account] = false;
        emit UnBlacklisted(account);
    }

    // ============ Tax Configuration Functions ============

    /// @notice Set tax rate
    /// @param newRate New tax rate in basis points (100 = 1%)
    function setTaxRate(uint256 newRate) external onlyOwner {
        if (newRate > MAX_TAX_RATE) revert InvalidTaxRate(newRate);

        uint256 oldRate = taxRate;
        taxRate = newRate;

        emit TaxRateUpdated(oldRate, newRate);
    }

    /// @notice Set tax receiver address
    /// @param newReceiver New tax receiver address
    function setTaxReceiver(address newReceiver) external onlyOwner {
        if (newReceiver == address(0)) revert InvalidAddress();

        address oldReceiver = taxReceiver;
        taxReceiver = newReceiver;

        emit TaxReceiverUpdated(oldReceiver, newReceiver);
    }

    // ============ Max Transaction Functions ============

    /// @notice Set maximum transaction amount
    /// @param newAmount New maximum transaction amount
    function setMaxTransactionAmount(uint256 newAmount) external onlyOwner {
        if (newAmount == 0) revert InvalidAmount();

        uint256 oldAmount = maxTransactionAmount;
        maxTransactionAmount = newAmount;

        emit MaxTransactionAmountUpdated(oldAmount, newAmount);
    }

    // ============ Exclusion Functions ============

    /// @notice Set tax exclusion for an address
    /// @param account Address to configure
    /// @param excluded Whether to exclude from tax
    function setExcludedFromTax(
        address account,
        bool excluded
    ) external onlyOwner {
        excludedFromTax[account] = excluded;
    }

    /// @notice Set max transaction exclusion for an address
    /// @param account Address to configure
    /// @param excluded Whether to exclude from max transaction
    function setExcludedFromMaxTransaction(
        address account,
        bool excluded
    ) external onlyOwner {
        excludedFromMaxTransaction[account] = excluded;
    }

    // ============ View Functions ============

    /// @notice Get remaining mintable supply
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }

    /// @notice Check if address has tokens
    function hasTokens(address account) external view returns (bool) {
        return balanceOf(account) > 0;
    }

    /// @notice Get token info
    function getTokenInfo()
        external
        view
        returns (
            string memory tokenName,
            string memory tokenSymbol,
            uint8 tokenDecimals,
            uint256 tokenTotalSupply,
            uint256 tokenMaxSupply,
            uint256 tokenRemainingSupply
        )
    {
        tokenName = name();
        tokenSymbol = symbol();
        tokenDecimals = decimals();
        tokenTotalSupply = totalSupply();
        tokenMaxSupply = MAX_SUPPLY;
        tokenRemainingSupply = MAX_SUPPLY - totalSupply();
    }

    // ============ Internal Override Functions ============

    /// @notice Internal transfer with tax, limits, and blacklist checks
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override(ERC20, ERC20Pausable) {
        // Blacklist check
        if (blacklisted[from]) revert AccountBlacklisted(from);
        if (blacklisted[to]) revert AccountBlacklisted(to);

        // Check limits and apply tax for normal transfers (not mint/burn)
        if (from != address(0) && to != address(0)) {
            // Max transaction check
            if (
                !excludedFromMaxTransaction[from] &&
                !excludedFromMaxTransaction[to]
            ) {
                if (value > maxTransactionAmount) {
                    revert ExceedsMaxTransactionAmount(
                        value,
                        maxTransactionAmount
                    );
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

    // ============ Override Transfer Functions ============

    /// @notice Override transfer to add zero address check
    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        if (to == address(0)) revert InvalidAddress();
        return super.transfer(to, amount);
    }

    /// @notice Override transferFrom to add zero address check
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        if (to == address(0)) revert InvalidAddress();
        return super.transferFrom(from, to, amount);
    }
}
