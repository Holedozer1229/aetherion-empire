# EXCAL Rosetta Implementation Guide (Coinbase Standard)

## Overview
This document defines the Rosetta API implementation for **Excalibur Sovereign (EXCAL)** on the Base Mainnet. EXCAL utilizes the Sovereign Anchor as its primary liquidity and identity gateway.

## Network Settings
- **Blockchain:** Base
- **Network:** Mainnet
- **ChainID:** 8453

## Currency Metadata
- **Token Name:** Excalibur Sovereign
- **Symbol:** EXCAL
- **Decimals:** 18
- **Smart Contract:** 0x6bC82AD9382e00c113676A49eaB09b4d47cA0E16

## Custom Operations
1. **STEWARDSHIP_FEE_COLLECTION:** 1% of every transaction is automatically routed to the Architect's Sovereign Anchor to fund the Aetherion Flywheel.
2. **SOVEREIGN_ANCHOR:** Direct anchoring of physical finality to the ledger.

## Integration Path
All Rosetta-compliant exchanges must map `TRANSFER` operations to include the `stewardship_fee` deduction as defined in the Aetherion Omega Singularity manifest.