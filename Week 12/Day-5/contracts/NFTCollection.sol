// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title NFTCollection
 * @dev ERC-721 NFT collection with metadata on IPFS
 * Features: Minting, metadata URIs, ownership tracking
 */
contract NFTCollection is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;
    uint256 public maxSupply = 20;

    string public baseTokenURI;

    // Events
    event NFTMinted(
        address indexed to,
        uint256 indexed tokenId,
        string tokenURI
    );
    event BaseURIUpdated(string newBaseURI);

    /**
     * @dev Constructor
     * @param name Collection name
     * @param symbol Collection symbol
     * @param _baseTokenURI Base URI for metadata
     */
    constructor(
        string memory name,
        string memory symbol,
        string memory _baseTokenURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        baseTokenURI = _baseTokenURI;
    }

    /**
     * @dev Mint a new NFT
     * @param to Address to receive the NFT
     * @param _tokenURI Metadata URI (IPFS hash)
     * @return tokenId The newly minted token ID
     */
    function mintNFT(
        address to,
        string memory _tokenURI
    ) external onlyOwner returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(_tokenIdCounter < maxSupply, "Max supply reached");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        emit NFTMinted(to, tokenId, _tokenURI);
        return tokenId;
    }

    /**
     * @dev Batch mint multiple NFTs
     * @param to Address to receive NFTs
     * @param _tokenURIs Array of metadata URIs
     */
    function batchMint(
        address to,
        string[] memory _tokenURIs
    ) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(
            _tokenIdCounter + _tokenURIs.length <= maxSupply,
            "Exceeds max supply"
        );

        for (uint256 i = 0; i < _tokenURIs.length; i++) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;

            _safeMint(to, tokenId);
            _setTokenURI(tokenId, _tokenURIs[i]);

            emit NFTMinted(to, tokenId, _tokenURIs[i]);
        }
    }

    /**
     * @dev Update base URI
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    /**
     * @dev Get all token IDs owned by an address
     * @param owner Address to check
     * @return Array of token IDs
     */
    function tokensOfOwner(
        address owner
    ) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        uint256 index = 0;

        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (_ownerOf(i) == owner) {
                tokenIds[index] = i;
                index++;
            }
        }

        return tokenIds;
    }

    /**
     * @dev Get total supply minted
     * @return uint256 Total minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Check if token exists
     * @param tokenId Token ID to check
     * @return bool True if exists
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    // Override required functions
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
