// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AmuletNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Mapping from token ID to tokenURI (for metadata)
    mapping(uint256 => string) private _tokenURIs;

    constructor(address initialOwner)
        ERC721("AmuletNFT", "AMULET")
        Ownable(initialOwner)
    {}

    // Override base URI to fetch metadata
    function _baseURI() internal pure override returns (string memory) {
        // In production, update this to your API or IPFS base URL
        return "YOUR_API_METADATA_BASE_URL/";
    }

    // Function to mint a new NFT
    function safeMint(address to, string memory uri)
        public onlyOwner
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // Override the tokenURI function to return the custom URI set
    function tokenURI(uint256 tokenId)
        public view override returns (string memory)
    {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    // Internal function to set token URI
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, Ownable) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
