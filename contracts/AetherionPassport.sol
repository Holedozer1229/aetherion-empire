// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AetherionPassport is ERC721Enumerable, Ownable {
    uint256 public constant MINT_PRICE = 0.01 ether;
    uint256 public constant MAX_SUPPLY = 1000;
    uint256 private _nextTokenId;

    constructor() ERC721("Aetherion Diplomatic Passport", "ADPASS") Ownable(msg.sender) {}

    function mint() external payable {
        require(msg.value >= MINT_PRICE, "Insufficient ETH");
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}