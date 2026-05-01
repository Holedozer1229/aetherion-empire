// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FlashLoanSimpleReceiverBase} from "https://github.com/aave/aave-v3-core/blob/master/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "https://github.com/aave/aave-v3-core/blob/master/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "https://github.com/aave/aave-v3-core/blob/master/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

contract AetherionFlashHaul is FlashLoanSimpleReceiverBase {
    address public immutable OWNER;
    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private constant rsETH = 0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3;

    constructor(address _addressProvider) 
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {
        OWNER = msg.sender;
    }

    function requestFlashLoan(uint256 amount) external {
        require(msg.sender == OWNER, "Sovereign Access Only");
        POOL.flashLoanSimple(address(this), WETH, amount, "", 0);
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(msg.sender == address(POOL), "Unauthorized");
        uint256 amountOwed = amount + premium;
        IERC20(asset).approve(address(POOL), amountOwed);
        return true;
    }

    function withdrawVault() external {
        require(msg.sender == OWNER, "Sovereign Access Only");
        uint256 balance = IERC20(WETH).balanceOf(address(this));
        IERC20(WETH).transfer(OWNER, balance);
    }

    receive() external payable {}
}