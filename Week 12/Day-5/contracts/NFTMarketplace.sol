// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NFTMarketplace
 * @dev Marketplace for buying NFTs with multiple token options
 * Features: Multi-token pricing, DEX integration, marketplace operations
 */
interface IMultiTokenDEX {
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256);
    function getReserves(
        address tokenA,
        address tokenB
    ) external view returns (uint256 reserveA, uint256 reserveB);
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external returns (uint256);
}

contract NFTMarketplace is Ownable, ReentrancyGuard {
    IERC721 public nftCollection;
    IERC20 public platformToken;
    IMultiTokenDEX public dex;

    uint256 public nftPrice = 100 * 10 ** 18; // 100 platform tokens

    // Supported tokens for payment
    address[] public supportedTokens;
    mapping(address => bool) public isTokenSupported;

    // NFT listing
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
    }

    mapping(uint256 => Listing) public listings;
    uint256[] public activeListings;

    // Events
    event NFTPriceUpdated(uint256 newPrice);
    event TokenSupported(address indexed token);
    event TokenRemoved(address indexed token);
    event NFTPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        address indexed paymentToken,
        uint256 amount
    );
    event NFTListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    event NFTDelisted(uint256 indexed tokenId);

    /**
     * @dev Constructor
     * @param _nftCollection NFT collection address
     * @param _platformToken Platform token address
     * @param _dex DEX contract address
     */
    constructor(
        address _nftCollection,
        address _platformToken,
        address _dex
    ) Ownable(msg.sender) {
        require(_nftCollection != address(0), "Invalid NFT address");
        require(_platformToken != address(0), "Invalid token address");
        require(_dex != address(0), "Invalid DEX address");

        nftCollection = IERC721(_nftCollection);
        platformToken = IERC20(_platformToken);
        dex = IMultiTokenDEX(_dex);

        // Platform token is always supported
        supportedTokens.push(_platformToken);
        isTokenSupported[_platformToken] = true;
    }

    /**
     * @dev Set NFT price in platform tokens
     * @param price New price
     */
    function setNFTPrice(uint256 price) external onlyOwner {
        require(price > 0, "Price must be greater than 0");
        nftPrice = price;
        emit NFTPriceUpdated(price);
    }

    /**
     * @dev Add supported payment token
     * @param token Token address to support
     */
    function addSupportedToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(!isTokenSupported[token], "Token already supported");

        supportedTokens.push(token);
        isTokenSupported[token] = true;
        emit TokenSupported(token);
    }

    /**
     * @dev Remove supported payment token
     * @param token Token address to remove
     */
    function removeSupportedToken(address token) external onlyOwner {
        require(
            token != address(platformToken),
            "Cannot remove platform token"
        );
        require(isTokenSupported[token], "Token not supported");

        isTokenSupported[token] = false;
        emit TokenRemoved(token);
    }

    /**
     * @dev Buy NFT with platform token (direct purchase)
     * @param tokenId NFT token ID
     */
    function buyNFTWithPlatformToken(uint256 tokenId) external nonReentrant {
        require(nftCollection.ownerOf(tokenId) == owner(), "NFT not available");

        // Transfer platform tokens from buyer
        require(
            platformToken.transferFrom(msg.sender, address(this), nftPrice),
            "Payment failed"
        );

        // Transfer NFT to buyer
        nftCollection.safeTransferFrom(owner(), msg.sender, tokenId);

        emit NFTPurchased(
            tokenId,
            msg.sender,
            address(platformToken),
            nftPrice
        );
    }

    /**
     * @dev Buy NFT with any supported token (uses DEX for conversion)
     * @param tokenId NFT token ID
     * @param paymentToken Token to pay with
     */
    function buyNFTWithToken(
        uint256 tokenId,
        address paymentToken
    ) external nonReentrant {
        require(isTokenSupported[paymentToken], "Token not supported");
        require(nftCollection.ownerOf(tokenId) == owner(), "NFT not available");

        // Calculate payment amount
        uint256 paymentAmount = calculatePriceInToken(paymentToken);
        require(paymentAmount > 0, "Invalid price calculation");

        // If paying with platform token, direct transfer
        if (paymentToken == address(platformToken)) {
            require(
                platformToken.transferFrom(msg.sender, address(this), nftPrice),
                "Payment failed"
            );
        } else {
            // Transfer payment token from buyer to this contract
            require(
                IERC20(paymentToken).transferFrom(
                    msg.sender,
                    address(this),
                    paymentAmount
                ),
                "Payment transfer failed"
            );

            // Approve DEX to spend payment token
            IERC20(paymentToken).approve(address(dex), paymentAmount);

            // Swap payment token for platform token
            uint256 received = dex.swap(
                paymentToken,
                address(platformToken),
                paymentAmount,
                (nftPrice * 95) / 100 // 5% slippage tolerance
            );

            require(
                received >= (nftPrice * 95) / 100,
                "Insufficient swap output"
            );
        }

        // Transfer NFT to buyer
        nftCollection.safeTransferFrom(owner(), msg.sender, tokenId);

        emit NFTPurchased(tokenId, msg.sender, paymentToken, paymentAmount);
    }

    /**
     * @dev Calculate NFT price in any supported token
     * @param token Token address
     * @return uint256 Price in specified token
     */
    function calculatePriceInToken(
        address token
    ) public view returns (uint256) {
        if (token == address(platformToken)) {
            return nftPrice;
        }

        require(isTokenSupported[token], "Token not supported");

        // Get reserves from DEX
        (uint256 reservePlatform, uint256 reserveToken) = dex.getReserves(
            address(platformToken),
            token
        );

        require(reservePlatform > 0 && reserveToken > 0, "No liquidity");

        // Calculate how much of the payment token equals nftPrice platform tokens
        // Using: outputAmount = (inputAmount * reserveOut) / reserveIn
        // We need: inputAmount = (outputAmount * reserveIn) / reserveOut
        uint256 paymentAmount = (nftPrice * reserveToken * 1000) /
            (reservePlatform * 997);

        return paymentAmount;
    }

    /**
     * @dev List NFT for sale (secondary market)
     * @param tokenId NFT token ID
     * @param price Price in platform tokens
     */
    function listNFT(uint256 tokenId, uint256 price) external {
        require(nftCollection.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(price > 0, "Invalid price");
        require(!listings[tokenId].isActive, "Already listed");

        // Transfer NFT to marketplace
        nftCollection.transferFrom(msg.sender, address(this), tokenId);

        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true
        });

        activeListings.push(tokenId);
        emit NFTListed(tokenId, msg.sender, price);
    }

    /**
     * @dev Buy listed NFT (secondary market)
     * @param tokenId NFT token ID
     * @param paymentToken Token to pay with
     */
    function buyListedNFT(
        uint256 tokenId,
        address paymentToken
    ) external nonReentrant {
        require(listings[tokenId].isActive, "NFT not listed");
        require(isTokenSupported[paymentToken], "Token not supported");

        Listing storage listing = listings[tokenId];
        uint256 price = listing.price;
        address seller = listing.seller;

        // Calculate payment amount
        uint256 paymentAmount = paymentToken == address(platformToken)
            ? price
            : (price * 1000) / 997; // Add DEX fee approximation

        // Transfer payment
        if (paymentToken == address(platformToken)) {
            require(
                platformToken.transferFrom(msg.sender, seller, price),
                "Payment failed"
            );
        } else {
            require(
                IERC20(paymentToken).transferFrom(
                    msg.sender,
                    address(this),
                    paymentAmount
                ),
                "Payment transfer failed"
            );

            IERC20(paymentToken).approve(address(dex), paymentAmount);
            dex.swap(
                paymentToken,
                address(platformToken),
                paymentAmount,
                (price * 95) / 100
            );

            platformToken.transfer(
                seller,
                platformToken.balanceOf(address(this))
            );
        }

        // Transfer NFT to buyer
        nftCollection.safeTransferFrom(address(this), msg.sender, tokenId);

        // Remove listing
        listing.isActive = false;

        emit NFTPurchased(tokenId, msg.sender, paymentToken, paymentAmount);
    }

    /**
     * @dev Get all supported tokens
     * @return address[] Array of supported token addresses
     */
    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }

    /**
     * @dev Get all active listings
     * @return uint256[] Array of listed token IDs
     */
    function getActiveListings() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < activeListings.length; i++) {
            if (listings[activeListings[i]].isActive) {
                activeCount++;
            }
        }

        uint256[] memory result = new uint256[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < activeListings.length; i++) {
            if (listings[activeListings[i]].isActive) {
                result[index] = activeListings[i];
                index++;
            }
        }

        return result;
    }

    /**
     * @dev Withdraw accumulated platform tokens
     */
    function withdrawTokens() external onlyOwner {
        uint256 balance = platformToken.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        platformToken.transfer(owner(), balance);
    }
}
