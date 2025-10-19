// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MultiTokenDEX
 * @dev Decentralized Exchange supporting multiple token pairs
 * Features: Token swaps, liquidity pools, price calculations
 */
contract MultiTokenDEX is Ownable, ReentrancyGuard {
    // Liquidity Pool structure
    struct Pool {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        bool exists;
    }

    // Pool mapping: keccak256(tokenA, tokenB) => Pool
    mapping(bytes32 => Pool) public pools;
    bytes32[] public poolIds;

    // LP token tracking (simplified - in production use ERC20 LP tokens)
    mapping(bytes32 => mapping(address => uint256)) public liquidityProviders;
    mapping(bytes32 => uint256) public totalLiquidity;

    uint256 public constant FEE_PERCENT = 3; // 0.3% fee
    uint256 public constant FEE_DENOMINATOR = 1000;

    // Events
    event PoolCreated(
        address indexed tokenA,
        address indexed tokenB,
        bytes32 poolId
    );
    event LiquidityAdded(
        bytes32 indexed poolId,
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );
    event LiquidityRemoved(
        bytes32 indexed poolId,
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );
    event TokensSwapped(
        bytes32 indexed poolId,
        address indexed user,
        address tokenIn,
        uint256 amountIn,
        uint256 amountOut
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new liquidity pool
     * @param tokenA First token address
     * @param tokenB Second token address
     */
    function createPool(address tokenA, address tokenB) external onlyOwner {
        require(
            tokenA != address(0) && tokenB != address(0),
            "Invalid token addresses"
        );
        require(tokenA != tokenB, "Tokens must be different");

        bytes32 poolId = getPoolId(tokenA, tokenB);
        require(!pools[poolId].exists, "Pool already exists");

        pools[poolId] = Pool({
            tokenA: tokenA,
            tokenB: tokenB,
            reserveA: 0,
            reserveB: 0,
            exists: true
        });

        poolIds.push(poolId);
        emit PoolCreated(tokenA, tokenB, poolId);
    }

    /**
     * @dev Add liquidity to a pool
     * @param tokenA First token address
     * @param tokenB Second token address
     * @param amountA Amount of tokenA
     * @param amountB Amount of tokenB
     */
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB
    ) external nonReentrant {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than 0");

        bytes32 poolId = getPoolId(tokenA, tokenB);
        require(pools[poolId].exists, "Pool does not exist");

        Pool storage pool = pools[poolId];

        // Transfer tokens from user
        require(
            IERC20(tokenA).transferFrom(msg.sender, address(this), amountA),
            "Transfer tokenA failed"
        );
        require(
            IERC20(tokenB).transferFrom(msg.sender, address(this), amountB),
            "Transfer tokenB failed"
        );

        // Calculate liquidity shares (simplified)
        uint256 liquidity;
        if (totalLiquidity[poolId] == 0) {
            liquidity = sqrt(amountA * amountB);
        } else {
            liquidity = min(
                (amountA * totalLiquidity[poolId]) / pool.reserveA,
                (amountB * totalLiquidity[poolId]) / pool.reserveB
            );
        }

        require(liquidity > 0, "Insufficient liquidity minted");

        // Update reserves
        pool.reserveA += amountA;
        pool.reserveB += amountB;

        // Update LP tracking
        liquidityProviders[poolId][msg.sender] += liquidity;
        totalLiquidity[poolId] += liquidity;

        emit LiquidityAdded(poolId, msg.sender, amountA, amountB, liquidity);
    }

    /**
     * @dev Swap tokens in a pool
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param amountIn Amount of input tokens
     * @param minAmountOut Minimum amount of output tokens (slippage protection)
     */
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be greater than 0");

        bytes32 poolId = getPoolId(tokenIn, tokenOut);
        require(pools[poolId].exists, "Pool does not exist");

        Pool storage pool = pools[poolId];

        // Get reserves in correct order
        (uint256 reserveIn, uint256 reserveOut) = tokenIn == pool.tokenA
            ? (pool.reserveA, pool.reserveB)
            : (pool.reserveB, pool.reserveA);

        // Calculate output amount with fee
        amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
        require(amountOut >= minAmountOut, "Insufficient output amount");
        require(amountOut < reserveOut, "Insufficient liquidity");

        // Transfer tokens
        require(
            IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn),
            "Transfer in failed"
        );
        require(
            IERC20(tokenOut).transfer(msg.sender, amountOut),
            "Transfer out failed"
        );

        // Update reserves
        if (tokenIn == pool.tokenA) {
            pool.reserveA += amountIn;
            pool.reserveB -= amountOut;
        } else {
            pool.reserveB += amountIn;
            pool.reserveA -= amountOut;
        }

        emit TokensSwapped(poolId, msg.sender, tokenIn, amountIn, amountOut);
        return amountOut;
    }

    /**
     * @dev Calculate output amount for a swap (with 0.3% fee)
     * @param amountIn Input amount
     * @param reserveIn Reserve of input token
     * @param reserveOut Reserve of output token
     * @return amountOut Output amount
     */
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        require(amountIn > 0, "Insufficient input amount");
        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");

        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - FEE_PERCENT);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * FEE_DENOMINATOR) + amountInWithFee;
        amountOut = numerator / denominator;
    }

    /**
     * @dev Get pool reserves
     * @param tokenA First token
     * @param tokenB Second token
     * @return reserveA Reserve of tokenA
     * @return reserveB Reserve of tokenB
     */
    function getReserves(
        address tokenA,
        address tokenB
    ) external view returns (uint256 reserveA, uint256 reserveB) {
        bytes32 poolId = getPoolId(tokenA, tokenB);
        require(pools[poolId].exists, "Pool does not exist");

        Pool memory pool = pools[poolId];
        return (pool.reserveA, pool.reserveB);
    }

    /**
     * @dev Get current price of tokenA in terms of tokenB
     * @param tokenA First token
     * @param tokenB Second token
     * @return price Price (scaled by 1e18)
     */
    function getPrice(
        address tokenA,
        address tokenB
    ) external view returns (uint256 price) {
        bytes32 poolId = getPoolId(tokenA, tokenB);
        require(pools[poolId].exists, "Pool does not exist");

        Pool memory pool = pools[poolId];
        require(pool.reserveA > 0 && pool.reserveB > 0, "No liquidity");

        return (pool.reserveB * 1e18) / pool.reserveA;
    }

    /**
     * @dev Generate consistent pool ID for token pair
     * @param tokenA First token
     * @param tokenB Second token
     * @return poolId Unique pool identifier
     */
    function getPoolId(
        address tokenA,
        address tokenB
    ) public pure returns (bytes32) {
        return
            tokenA < tokenB
                ? keccak256(abi.encodePacked(tokenA, tokenB))
                : keccak256(abi.encodePacked(tokenB, tokenA));
    }

    /**
     * @dev Get all pool IDs
     * @return Array of pool IDs
     */
    function getAllPools() external view returns (bytes32[] memory) {
        return poolIds;
    }

    /**
     * @dev Check if pool exists
     * @param tokenA First token
     * @param tokenB Second token
     * @return bool True if pool exists
     */
    function poolExists(
        address tokenA,
        address tokenB
    ) external view returns (bool) {
        return pools[getPoolId(tokenA, tokenB)].exists;
    }

    // Helper functions
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
