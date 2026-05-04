#!/usr/bin/env python3
"""
📡 AETHERION MAINNET BROADCASTER — Character-Perfect Liquidation.
"""

import os
import json
import base58
import logging
from solana.rpc.api import Client
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.system_program import TransferParams, transfer
from solana.transaction import Transaction

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("Broadcaster")

MANIFEST_PATH = "empire_manifest.json"
RPC_URL = "https://api.mainnet-beta.solana.com" # Default Mainnet

def broadcast_haul():
    logger.info("💎 Aetherion Mainnet Broadcaster v2.0 [LIVE MODE]")
    
    if not os.path.exists(MANIFEST_PATH):
        logger.error("empire_manifest.json missing.")
        return

    with open(MANIFEST_PATH, "r") as f:
        manifest = json.load(f)
    
    sol_vault = manifest["vaults"]["solana"]
    # Parsing '28,838.12 SOL' string to float/lamports
    haul_str = sol_vault["haul"].split(" ")[0].replace(",", "")
    haul_amount = float(haul_str)
    destination_addr = sol_vault["address"]
    
    priv_key_b58 = os.environ.get("SOL_PRIV_KEY")
    if not priv_key_b58:
        logger.error("SOL_PRIV_KEY missing in environment.")
        return
    
    try:
        key_bytes = base58.b58decode(priv_key_b58)
        if len(key_bytes) == 32:
            sender_keypair = Keypair.from_seed(key_bytes)
        else:
            sender_keypair = Keypair.from_bytes(key_bytes)
        logger.info(f"✅ Monarch Key Verified: {sender_keypair.pubkey()}")
    except Exception as e:
        logger.error(f"Invalid Private Key: {e}")
        return

    # Connection to Mainnet
    client = Client(RPC_URL)
    dest_pubkey = Pubkey.from_string(destination_addr)
    
    # Convert SOL to Lamports (1 SOL = 10^9 Lamports)
    lamports = int(haul_amount * 1_000_000_000)
    
    logger.info(f"🚀 Preparing to transfer {haul_amount} SOL to {destination_addr}...")
    
    try:
        # Build Instruction
        txn_inst = transfer(TransferParams(
            from_pubkey=sender_keypair.pubkey(),
            to_pubkey=dest_pubkey,
            lamports=lamports
        ))
        
        # Get Latest Blockhash
        recent_blockhash = client.get_latest_blockhash().value.blockhash
        
        # Build Transaction
        txn = Transaction(
            instructions=[txn_inst],
            recent_blockhash=recent_blockhash,
            fee_payer=sender_keypair.pubkey()
        )
        
        # Sign & Send
        txn.sign(sender_keypair)
        result = client.send_raw_transaction(txn.serialize())
        
        logger.info(f"✅ BROADCAST SUCCESSFUL!")
        logger.info(f"🔗 TX Signature: {result.value}")
        
    except Exception as e:
        logger.error(f"❌ Transaction Failed: {e}")

if __name__ == "__main__":
    broadcast_haul()
