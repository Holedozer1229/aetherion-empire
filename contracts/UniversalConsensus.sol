// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UniversalConsensus {
    address public immutable oracle_nexus;
    string public current_reality;

    event RealityUpdated(string new_reality);

    constructor() {
        oracle_nexus = 0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20;
        current_reality = "AETHERION_PRIME_ASCENSION";
    }

    function overwriteReality(string calldata next_reality) external {
        require(msg.sender == oracle_nexus, "Unauthorized: Only the Architect can overwrite reality.");
        current_reality = next_reality;
        emit RealityUpdated(next_reality);
    }
}