// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenSwap
 * @dev A simple automated market maker (AMM) implementing the constant product formula (x * y = k)
 * Designed to work with Claw and Tiger tokens
 */
contract TokenSwap is ReentrancyGuard, Ownable {
    // ============ State Variables ============
    IERC20 public immutable tokenA; // Claw token
    IERC20 public immutable tokenB; // Tiger token

    uint256 public reserveA; // Reserve of token A
    uint256 public reserveB; // Reserve of token B

    uint256 public totalLiquidity; // Total liquidity tokens minted
    mapping(address => uint256) public liquidity; // User liquidity balances

    // Fee basis points (0.3% = 30 basis points)
    uint256 public constant FEE_BASIS_POINTS = 30;
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant MINIMUM_LIQUIDITY = 1000; // Locked liquidity

    // ============ Events ============
    event LiquidityAdded(
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidityMinted
    );

    event LiquidityRemoved(
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidityBurned
    );

    event Swap(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    // ============ Errors ============
    error InsufficientLiquidity();
    error InsufficientInputAmount();
    error InsufficientOutputAmount();
    error InvalidTokens();
    error TransferFailed();
    error SlippageTooHigh();
    error InvalidAmount();
    error InvalidAddress();
    error InsufficientLiquidityMinted();
    error InsufficientLiquidityBurned();

    // ============ Constructor ============
    constructor(address _tokenA, address _tokenB) Ownable(msg.sender) {
        require(_tokenA != _tokenB, "Tokens must be different");
        require(
            _tokenA != address(0) && _tokenB != address(0),
            "Invalid token addresses"
        );

        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    // ============ Liquidity Functions ============

    /**
     * @dev Add liquidity to the pool
     * @param amountA Desired amount of token A to add
     * @param amountB Desired amount of token B to add
     * @return liquidityMinted Amount of liquidity tokens minted
     */
    function addLiquidity(
        uint256 amountA,
        uint256 amountB
    ) external nonReentrant returns (uint256 liquidityMinted) {
        if (amountA == 0 || amountB == 0) revert InvalidAmount();

        uint256 actualAmountA = amountA;
        uint256 actualAmountB = amountB;

        if (totalLiquidity > 0) {
            // Calculate optimal amounts based on current ratio
            uint256 amountBOptimal = (amountA * reserveB) / reserveA;

            if (amountBOptimal <= amountB) {
                actualAmountB = amountBOptimal;
            } else {
                uint256 amountAOptimal = (amountB * reserveA) / reserveB;
                require(
                    amountAOptimal <= amountA,
                    "Insufficient token A provided"
                );
                actualAmountA = amountAOptimal;
            }

            // Calculate liquidity to mint
            liquidityMinted = (actualAmountA * totalLiquidity) / reserveA;
        } else {
            // First liquidity provision
            liquidityMinted = sqrt(actualAmountA * actualAmountB);
            if (liquidityMinted <= MINIMUM_LIQUIDITY)
                revert InsufficientLiquidityMinted();
            liquidityMinted -= MINIMUM_LIQUIDITY; // Lock first MINIMUM_LIQUIDITY tokens
        }

        if (liquidityMinted == 0) revert InsufficientLiquidityMinted();

        // Transfer tokens from user
        require(
            tokenA.transferFrom(msg.sender, address(this), actualAmountA),
            "Token A transfer failed"
        );
        require(
            tokenB.transferFrom(msg.sender, address(this), actualAmountB),
            "Token B transfer failed"
        );

        // Update reserves and liquidity
        reserveA += actualAmountA;
        reserveB += actualAmountB;
        totalLiquidity += liquidityMinted;
        liquidity[msg.sender] += liquidityMinted;

        emit LiquidityAdded(
            msg.sender,
            actualAmountA,
            actualAmountB,
            liquidityMinted
        );
    }

    /**
     * @dev Remove liquidity from the pool
     * @param liquidityAmount Amount of liquidity tokens to burn
     * @return amountA Amount of token A received
     * @return amountB Amount of token B received
     */
    function removeLiquidity(
        uint256 liquidityAmount
    ) external nonReentrant returns (uint256 amountA, uint256 amountB) {
        if (liquidityAmount == 0) revert InvalidAmount();
        if (liquidity[msg.sender] < liquidityAmount)
            revert InsufficientLiquidityBurned();

        // Calculate token amounts to return
        amountA = (liquidityAmount * reserveA) / totalLiquidity;
        amountB = (liquidityAmount * reserveB) / totalLiquidity;

        // Update state
        liquidity[msg.sender] -= liquidityAmount;
        totalLiquidity -= liquidityAmount;
        reserveA -= amountA;
        reserveB -= amountB;

        // Transfer tokens to user
        require(
            tokenA.transfer(msg.sender, amountA),
            "Token A transfer failed"
        );
        require(
            tokenB.transfer(msg.sender, amountB),
            "Token B transfer failed"
        );

        emit LiquidityRemoved(msg.sender, amountA, amountB, liquidityAmount);
    }

    // ============ Swap Functions ============

    /**
     * @dev Swap token A for token B
     * @param amountIn Amount of token A to swap
     * @return amountOut Amount of token B received
     */
    function swapAForB(
        uint256 amountIn
    ) external nonReentrant returns (uint256 amountOut) {
        amountOut = _swap(address(tokenA), address(tokenB), amountIn);
    }

    /**
     * @dev Swap token B for token A
     * @param amountIn Amount of token B to swap
     * @return amountOut Amount of token A received
     */
    function swapBForA(
        uint256 amountIn
    ) external nonReentrant returns (uint256 amountOut) {
        amountOut = _swap(address(tokenB), address(tokenA), amountIn);
    }

    /**
     * @dev Internal swap function
     */
    function _swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) internal returns (uint256 amountOut) {
        if (amountIn == 0) revert InvalidAmount();
        if (reserveA == 0 || reserveB == 0) revert InsufficientLiquidity();

        bool isAForB = tokenIn == address(tokenA);
        uint256 reserveIn = isAForB ? reserveA : reserveB;
        uint256 reserveOut = isAForB ? reserveB : reserveA;

        // Calculate output amount with fee
        uint256 amountInWithFee = amountIn * (BASIS_POINTS - FEE_BASIS_POINTS);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = reserveIn * BASIS_POINTS + amountInWithFee;
        amountOut = numerator / denominator;

        if (amountOut >= reserveOut) revert InsufficientLiquidity();

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
        if (isAForB) {
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
        }

        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    // ============ View Functions ============

    /**
     * @dev Get the amount of output tokens for a given input
     * @param amountIn Amount of input tokens
     * @param reserveIn Reserve of input token
     * @param reserveOut Reserve of output token
     * @return amountOut Amount of output tokens
     */
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        if (amountIn == 0) revert InvalidAmount();
        if (reserveIn == 0 || reserveOut == 0) revert InsufficientLiquidity();

        uint256 amountInWithFee = amountIn * (BASIS_POINTS - FEE_BASIS_POINTS);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = reserveIn * BASIS_POINTS + amountInWithFee;
        amountOut = numerator / denominator;
    }

    /**
     * @dev Get current price of token A in terms of token B
     * @return price Price with 18 decimals
     */
    function getPrice() external view returns (uint256 price) {
        if (reserveA == 0) return 0;
        price = (reserveB * 1e18) / reserveA;
    }

    /**
     * @dev Get pool information
     */
    function getPoolInfo()
        external
        view
        returns (
            address _tokenA,
            address _tokenB,
            uint256 _reserveA,
            uint256 _reserveB,
            uint256 _totalLiquidity,
            uint256 _price,
            uint256 _feeRate
        )
    {
        _tokenA = address(tokenA);
        _tokenB = address(tokenB);
        _reserveA = reserveA;
        _reserveB = reserveB;
        _totalLiquidity = totalLiquidity;
        _price = reserveA > 0 ? (reserveB * 1e18) / reserveA : 0;
        _feeRate = FEE_BASIS_POINTS;
    }

    /**
     * @dev Get user liquidity info
     * @param user Address to query
     */
    function getUserLiquidity(
        address user
    )
        external
        view
        returns (
            uint256 userLiquidity,
            uint256 userShareA,
            uint256 userShareB,
            uint256 sharePercentage
        )
    {
        userLiquidity = liquidity[user];
        if (totalLiquidity > 0 && userLiquidity > 0) {
            userShareA = (userLiquidity * reserveA) / totalLiquidity;
            userShareB = (userLiquidity * reserveB) / totalLiquidity;
            sharePercentage = (userLiquidity * 10000) / totalLiquidity; // In basis points
        }
    }

    /**
     * @dev Calculate price impact for a given swap
     * @param amountIn Amount of input tokens
     * @param isAForB True if swapping A for B, false if swapping B for A
     * @return priceImpact Price impact in basis points
     */
    function calculatePriceImpact(
        uint256 amountIn,
        bool isAForB
    ) external view returns (uint256 priceImpact) {
        if (reserveA == 0 || reserveB == 0) return 0;

        uint256 reserveIn = isAForB ? reserveA : reserveB;
        uint256 reserveOut = isAForB ? reserveB : reserveA;

        uint256 amountOut = getAmountOut(amountIn, reserveIn, reserveOut);

        // Current price
        uint256 currentPrice = isAForB
            ? (reserveB * 1e18) / reserveA
            : (reserveA * 1e18) / reserveB;

        // New price after swap
        uint256 newReserveIn = reserveIn + amountIn;
        uint256 newReserveOut = reserveOut - amountOut;
        uint256 newPrice = isAForB
            ? (newReserveOut * 1e18) / newReserveIn
            : (newReserveIn * 1e18) / newReserveOut;

        // Calculate price impact
        if (newPrice > currentPrice) {
            priceImpact =
                ((newPrice - currentPrice) * BASIS_POINTS) /
                currentPrice;
        } else {
            priceImpact =
                ((currentPrice - newPrice) * BASIS_POINTS) /
                currentPrice;
        }
    }

    // ============ Utility Functions ============

    /**
     * @dev Square root function for initial liquidity calculation
     */
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    /**
     * @dev Emergency function to recover stuck tokens (only owner)
     * @param token Token address to recover
     * @param amount Amount to recover
     */
    function emergencyWithdraw(
        address token,
        uint256 amount
    ) external onlyOwner {
        require(
            token != address(tokenA) && token != address(tokenB),
            "Cannot withdraw pool tokens"
        );
        require(IERC20(token).transfer(owner(), amount), "Transfer failed");
    }
}
