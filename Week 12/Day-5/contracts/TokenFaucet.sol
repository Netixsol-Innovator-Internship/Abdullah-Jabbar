// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenFaucet
 * @dev Distributes free platform tokens to users for testing
 * Features: 24-hour cooldown, claim tracking, abuse prevention
 */
contract TokenFaucet is Ownable {
    IERC20 public platformToken;
    uint256 public claimAmount = 100 * 10 ** 18; // 100 tokens per claim
    uint256 public cooldownTime = 24 hours;

    // Tracking
    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public totalClaimed;
    uint256 public totalDistributed;

    // Events
    event TokensClaimed(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    event ClaimAmountUpdated(uint256 newAmount);
    event CooldownUpdated(uint256 newCooldown);

    /**
     * @dev Constructor
     * @param _platformToken Address of the platform token contract
     */
    constructor(address _platformToken) Ownable(msg.sender) {
        require(_platformToken != address(0), "Invalid token address");
        platformToken = IERC20(_platformToken);
    }

    /**
     * @dev Users claim free tokens (once per 24 hours)
     */
    function claimTokens() external {
        require(canClaim(msg.sender), "Must wait for cooldown period");
        require(
            platformToken.balanceOf(address(this)) >= claimAmount,
            "Faucet empty"
        );

        // Update tracking
        lastClaimTime[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += claimAmount;
        totalDistributed += claimAmount;

        // Transfer tokens
        require(
            platformToken.transfer(msg.sender, claimAmount),
            "Transfer failed"
        );

        emit TokensClaimed(msg.sender, claimAmount, block.timestamp);
    }

    /**
     * @dev Check if user can claim tokens
     * @param user Address to check
     * @return bool True if user can claim
     */
    function canClaim(address user) public view returns (bool) {
        return block.timestamp >= lastClaimTime[user] + cooldownTime;
    }

    /**
     * @dev Get time remaining until next claim
     * @param user Address to check
     * @return uint256 Seconds until next claim (0 if can claim now)
     */
    function getTimeUntilNextClaim(
        address user
    ) external view returns (uint256) {
        if (canClaim(user)) {
            return 0;
        }
        return (lastClaimTime[user] + cooldownTime) - block.timestamp;
    }

    /**
     * @dev Get total tokens claimed by user
     * @param user Address to check
     * @return uint256 Total claimed amount
     */
    function getTotalClaimed(address user) external view returns (uint256) {
        return totalClaimed[user];
    }

    /**
     * @dev Owner can update claim amount
     * @param newAmount New amount per claim
     */
    function setClaimAmount(uint256 newAmount) external onlyOwner {
        require(newAmount > 0, "Amount must be greater than 0");
        claimAmount = newAmount;
        emit ClaimAmountUpdated(newAmount);
    }

    /**
     * @dev Owner can update cooldown time
     * @param newCooldown New cooldown in seconds
     */
    function setCooldownTime(uint256 newCooldown) external onlyOwner {
        require(newCooldown > 0, "Cooldown must be greater than 0");
        cooldownTime = newCooldown;
        emit CooldownUpdated(newCooldown);
    }

    /**
     * @dev Owner can withdraw tokens from faucet
     * @param amount Amount to withdraw
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(platformToken.transfer(msg.sender, amount), "Transfer failed");
    }

    /**
     * @dev Get faucet balance
     * @return uint256 Balance of tokens in faucet
     */
    function getFaucetBalance() external view returns (uint256) {
        return platformToken.balanceOf(address(this));
    }
}
