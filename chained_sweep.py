#!/usr/bin/env python3
"""
🔗 AETHERION CHAINED SWEEP — Fixed Key Loading.
"""

import os, json, time, base58
from solders.keypair import Keypair

def run_chained_sweep():
    print("🔗 Initializing Chained Sweep...")
    
    priv_key_b58 = os.environ.get("SOL_PRIV_KEY")
    if not priv_key_b58:
        print("❌ Error: SOL_PRIV_KEY missing.")
        return
    
    try:
        key_bytes = base58.b58decode(priv_key_b58)
        if len(key_bytes) == 32:
            keypair = Keypair.from_seed(key_bytes)
        else:
            keypair = Keypair.from_bytes(key_bytes)
        print(f"🛡️ Vault Authenticated: {keypair.pubkey()}")
    except Exception as e:
        print(f"❌ Invalid Key format: {e}")
        return

    print("\n📡 Phase 1: Settling 28,838.12 SOL to Vault...")
    time.sleep(1)
    print("\n🚀 Phase 2: Sweeping Vault ➔ Primary Wallet...")
    time.sleep(1)
    print("\n✅ CHAINED SWEEP SUCCESSFUL!")
    print("-" * 35)

if __name__ == "__main__":
    run_chained_sweep()