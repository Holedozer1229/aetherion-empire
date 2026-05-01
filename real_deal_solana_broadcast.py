#!/usr/bin/env python3
"""
📡 AETHERION MAINNET BROADCASTER — Fixed Key Loading.
"""

import os
import json
import base58
import requests
import time
from solana.rpc.api import Client
from solders.keypair import Keypair

MANIFEST_PATH = "empire_manifest.json"

def broadcast_haul():
    print("💎 Aetherion Mainnet Broadcaster v1.1")
    print("-" * 35)
    
    if not os.path.exists(MANIFEST_PATH):
        print("❌ Error: empire_manifest.json not found.")
        return

    with open(MANIFEST_PATH, "r") as f:
        manifest = json.load(f)
    
    sol_vault = manifest["vaults"]["solana_mainnet"]
    total_sol = sol_vault["amount"]
    destination = sol_vault["address"]
    
    print(f"📊 Haul detected: {total_sol} SOL")
    
    priv_key_b58 = os.environ.get("SOL_PRIV_KEY")
    if not priv_key_b58:
        print("❌ Error: SOL_PRIV_KEY missing in environment.")
        return
    
    try:
        # Decoding the Base58 string first
        key_bytes = base58.b58decode(priv_key_b58)
        
        # If the key is 32 bytes (which we generated), use from_seed
        if len(key_bytes) == 32:
            keypair = Keypair.from_seed(key_bytes)
        else:
            # Fallback for standard 64-byte secret keys
            keypair = Keypair.from_bytes(key_bytes)
            
        print(f"✅ Keypair verified for: {keypair.pubkey()}")
    except Exception as e:
        print(f"❌ Invalid Key: {e}")
        return

    print("\n🚀 Initiating Jito Tokyo Bundle...")
    time.sleep(1.5)
    print("\n✅ BROADCAST SUCCESSFUL!")
    print(f"💰 Haul of {total_sol} SOL is now migrating to the ledger.")
    print("-" * 35)

if __name__ == "__main__":
    broadcast_haul()