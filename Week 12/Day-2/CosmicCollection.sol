// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CosmicCollection
 * @dev An ERC721 contract for the Cosmic Collection NFTs
 * Features:
 * - Enumerable for easier querying
 * - URI Storage for individual token metadata
 * - Pausable for emergency stops
 * - Owner controls for minting and management
 * - Reentrancy protection
 * - Royalty support (EIP-2981)
 */
contract CosmicCollection is
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    Pausable,
    Ownable,
    ReentrancyGuard
{
    uint256 private _tokenIdCounter = 1;

    // Constants
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MAX_MINT_PER_TX = 10;
    uint256 public constant RESERVED_TOKENS = 100;

    // Minting configuration
    uint256 public mintPrice = 0.01 ether;
    uint256 public maxMintPerAddress = 20;
    bool public publicMintEnabled = false;
    bool public whitelistMintEnabled = false;

    // Metadata
    string private _baseTokenURI;
    string private _contractURI;

    // Whitelist
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public mintedCount;

    // Royalties (EIP-2981)
    address public royaltyRecipient;
    uint256 public royaltyPercentage = 500; // 5%

    // Events
    event TokenMinted(
        address indexed to,
        uint256 indexed tokenId,
        string tokenURI
    );
    event MintPriceUpdated(uint256 newPrice);
    event BaseURIUpdated(string newBaseURI);
    event WhitelistStatusChanged(address indexed user, bool status);
    event RoyaltyInfoUpdated(address recipient, uint256 percentage);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initialBaseURI,
        address _royaltyRecipient
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        _baseTokenURI = _initialBaseURI;
        royaltyRecipient = _royaltyRecipient;
    }

    /**
     * @dev Mint tokens to a specific address (owner only)
     */
    function mintTo(
        address to,
        uint256 quantity,
        string[] calldata tokenURIs
    ) external onlyOwner nonReentrant {
        require(
            quantity > 0 && quantity <= MAX_MINT_PER_TX,
            "Invalid quantity"
        );
        require(tokenURIs.length == quantity, "URI count mismatch");
        require(totalSupply() + quantity <= MAX_SUPPLY, "Exceeds max supply");

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;

            _safeMint(to, tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);

            emit TokenMinted(to, tokenId, tokenURIs[i]);
        }
    }

    /**
     * @dev Public minting function
     */
    function mint(
        uint256 quantity
    ) external payable nonReentrant whenNotPaused {
        require(publicMintEnabled, "Public mint not enabled");
        require(
            quantity > 0 && quantity <= MAX_MINT_PER_TX,
            "Invalid quantity"
        );
        require(
            totalSupply() + quantity <= MAX_SUPPLY - RESERVED_TOKENS,
            "Exceeds available supply"
        );
        require(
            mintedCount[msg.sender] + quantity <= maxMintPerAddress,
            "Exceeds max per address"
        );
        require(msg.value >= mintPrice * quantity, "Insufficient payment");

        mintedCount[msg.sender] += quantity;

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;

            _safeMint(msg.sender, tokenId);

            emit TokenMinted(msg.sender, tokenId, "");
        }
    }

    /**
     * @dev Whitelist minting function
     */
    function whitelistMint(
        uint256 quantity
    ) external payable nonReentrant whenNotPaused {
        require(whitelistMintEnabled, "Whitelist mint not enabled");
        require(whitelist[msg.sender], "Not whitelisted");
        require(
            quantity > 0 && quantity <= MAX_MINT_PER_TX,
            "Invalid quantity"
        );
        require(
            totalSupply() + quantity <= MAX_SUPPLY - RESERVED_TOKENS,
            "Exceeds available supply"
        );
        require(
            mintedCount[msg.sender] + quantity <= maxMintPerAddress,
            "Exceeds max per address"
        );
        require(msg.value >= mintPrice * quantity, "Insufficient payment");

        mintedCount[msg.sender] += quantity;

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;

            _safeMint(msg.sender, tokenId);

            emit TokenMinted(msg.sender, tokenId, "");
        }
    }

    // Admin functions
    function setMintPrice(uint256 _mintPrice) external onlyOwner {
        mintPrice = _mintPrice;
        emit MintPriceUpdated(_mintPrice);
    }

    function setMaxMintPerAddress(uint256 _maxMint) external onlyOwner {
        maxMintPerAddress = _maxMint;
    }

    function setPublicMintEnabled(bool _enabled) external onlyOwner {
        publicMintEnabled = _enabled;
    }

    function setWhitelistMintEnabled(bool _enabled) external onlyOwner {
        whitelistMintEnabled = _enabled;
    }

    function addToWhitelist(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = true;
            emit WhitelistStatusChanged(addresses[i], true);
        }
    }

    function removeFromWhitelist(
        address[] calldata addresses
    ) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = false;
            emit WhitelistStatusChanged(addresses[i], false);
        }
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }

    function setContractURI(string calldata newContractURI) external onlyOwner {
        _contractURI = newContractURI;
    }

    function setRoyaltyInfo(
        address recipient,
        uint256 percentage
    ) external onlyOwner {
        require(percentage <= 1000, "Royalty too high"); // Max 10%
        royaltyRecipient = recipient;
        royaltyPercentage = percentage;
        emit RoyaltyInfoUpdated(recipient, percentage);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // View functions
    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function getCurrentTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function getTokensByOwner(
        address owner
    ) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokens = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokens;
    }

    // Royalty info (EIP-2981)
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view returns (address receiver, uint256 royaltyAmount) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return (royaltyRecipient, (salePrice * royaltyPercentage) / 10000);
    }

    // Required overrides
    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return
            interfaceId == 0x2a55205a || // EIP-2981 royalty standard
            super.supportsInterface(interfaceId);
    }
}
