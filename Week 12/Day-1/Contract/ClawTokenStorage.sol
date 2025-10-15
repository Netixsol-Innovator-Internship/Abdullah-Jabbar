// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

/**
 * @title ClawTokenStorage
 * @author Asad-Ali-9203
 * @notice Storage contract for Claw Token state variables and structs
 * @dev Separates storage from logic for better organization
 */
abstract contract ClawTokenStorage {
    
    // ============ Constants ============
    
    /// @notice Duration for timelock on critical changes (24 hours)
    uint256 public constant TIMELOCK_DURATION = 24 hours;
    
    /// @notice Maximum tax rate allowed (10%)
    uint256 public constant MAX_TAX_RATE = 1000;
    
    /// @notice Maximum batch size for batch operations
    uint256 public constant MAX_BATCH_SIZE = 200;
    
    // ============ State Variables ============
    
    /// @notice Tax rate in basis points (100 = 1%)
    uint256 public taxRate;
    
    /// @notice Address that receives transfer taxes
    address public taxReceiver;
    
    /// @notice Maximum amount that can be transferred in a single transaction
    uint256 public maxTransactionAmount;
    
    // ============ Structs ============
    
    /// @notice Structure to hold pending parameter changes with timelock
    struct PendingChange {
        uint256 value;
        address addressValue;
        uint256 unlockTime;
        bool exists;
    }
    
    // ============ Mappings ============
    
    /// @notice Mapping of blacklisted addresses
    mapping(address => bool) public blacklisted;
    
    /// @notice Mapping of addresses excluded from transfer tax
    mapping(address => bool) public excludedFromTax;
    
    /// @notice Mapping of addresses excluded from max transaction limit
    mapping(address => bool) public excludedFromMaxTransaction;
    
    /// @notice Tracks used permit signatures to prevent replay attacks
    mapping(address => mapping(bytes32 => bool)) internal _usedPermitSignatures;
    
    // ============ Pending Changes ============
    
    /// @notice Pending tax rate change awaiting timelock
    PendingChange public pendingTaxRateChange;
    
    /// @notice Pending max transaction amount change awaiting timelock
    PendingChange public pendingMaxTransactionChange;
    
    // ============ Events ============
    
    event Blacklisted(address indexed account);
    event UnBlacklisted(address indexed account);
    event TaxRateChangeProposed(uint256 newRate, uint256 unlockTime);
    event TaxRateUpdated(uint256 oldRate, uint256 newRate);
    event TaxReceiverUpdated(address indexed oldReceiver, address indexed newReceiver);
    event MaxTransactionChangeProposed(uint256 newAmount, uint256 unlockTime);
    event MaxTransactionAmountUpdated(uint256 oldAmount, uint256 newAmount);
    event PendingChangeRevoked(string changeType);
    event TokensMinted(address indexed to, uint256 amount);
    event TaxCollected(address indexed from, address indexed to, uint256 amount);
    
    // ============ Custom Errors ============
    
    error AccountBlacklisted(address account);
    error AccountNotBlacklisted(address account);
    error CannotBlacklistOwner();
    error ExceedsMaxTransactionAmount(uint256 amount, uint256 maxAmount);
    error InvalidTaxRate(uint256 rate);
    error InvalidAddress();
    error InvalidAmount();
    error ArrayLengthMismatch();
    error BatchSizeExceeded(uint256 size);
    error NoConfigurationChange();
    error PendingChangeNotFound();
    error TimelockNotExpired(uint256 currentTime, uint256 unlockTime);
    error PermitAlreadyUsed();
    error ApprovalRaceCondition();
    error CannotRescueOwnToken();
    
    // ============ Modifiers ============
    
    /// @notice Ensures an address is not blacklisted
    /// @param account The address to check
    modifier notBlacklisted(address account) {
        if (blacklisted[account]) {
            revert AccountBlacklisted(account);
        }
        _;
    }
    
    /**
     * @dev Reserved storage space to allow for layout changes in the future.
     */
    uint256[50] private __gap;
}