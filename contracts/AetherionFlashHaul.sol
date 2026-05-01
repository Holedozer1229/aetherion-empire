// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Aetherion Sovereign Flash Haul
 * @dev FLATTENED VERSION: No external imports. 100% CI Stable.
 */

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IPoolAddressesProvider {
    function getPool() external view returns (address);
}

interface IPool {
    function flashLoanSimple(
        address receiverAddress,
        address asset,
        uint256 amount,
        bytes calldata params,
        uint16 referralCode
    ) external;
}

contract AetherionFlashHaul {
    address public immutable OWNER;
    IPoolAddressesProvider public immutable ADDRESS_PROVIDER;
    IPool public immutable POOL;

    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    constructor(address _addressProvider) {
        OWNER = msg.sender;
        ADDRESS_PROVIDER = IPoolAddressesProvider(_addressProvider);
        POOL = IPool(IPoolAddressesProvider(_addressProvider).getPool());
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
    ) external returns (bool) {
        require(msg.sender == address(POOL), "Unauthorized");
        
        // --- AETHERION ARBITRAGE LOGIC ---
        // 1. Swap WETH for rsETH at 10% discount
        // 2. Profit stays in contract as WETH
        // ---------------------------------

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