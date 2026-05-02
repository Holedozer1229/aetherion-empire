// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ExcaliburSovereign is ERC20, Ownable {
    address public stewardshipVault;
    uint256 public constant FEE_PERCENT = 1;

    constructor(address _vault) ERC20("Excalibur Sovereign", "EXCAL") Ownable(msg.sender) {
        stewardshipVault = _vault;
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        uint256 fee = (amount * FEE_PERCENT) / 100;
        uint256 netAmount = amount - fee;
        _transfer(_msgSender(), stewardshipVault, fee);
        return super.transfer(to, netAmount);
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        uint256 fee = (amount * FEE_PERCENT) / 100;
        uint256 netAmount = amount - fee;
        _transfer(from, stewardshipVault, fee);
        return super.transferFrom(from, to, netAmount);
    }
}