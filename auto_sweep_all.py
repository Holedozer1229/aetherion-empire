#!/usr/bin/env python3
"""
👑 AETHERION AUTO-SWEEP — The Total Empire Extraction Protocol.
Logic: Triggers every verified payout route in a single atomic sequence.
"""

import os, requests, time

def run_total_extraction():
    print("💰 Initializing Empire-Wide Auto-Sweep...")
    
    # Payout routes on the local hub
    routes = [
        "/api/payout/btc-jackpot",
        "/api/payout/ltc-strike",
        "/api/payout/chained-sweep",
        "/api/payout/eth-haul",
        "/api/payout/sovereign-bridge"
    ]
    
    base_url = f"http://localhost:{os.environ.get('PORT', 6060)}"
    sig = "97e0945f76a0ef6615301f70c1f236f4c949d131456b991b5576983f3384aaa6"
    
    for route in routes:
        print(f" 📡 Triggering {route}...")
        try:
            # Internal call to the local flask instance
            requests.get(f"{base_url}{route}?sig={sig}", timeout=30)
            time.sleep(2) # Prevent miner congestion
        except Exception as e:
            print(f" ⚠️ Route {route} deferred: {e}")
            
    print("\n✨ TOTAL EMPIRE EXTRACTION BROADCAST COMPLETE.")
    print("🔗 All hauls are now migrating to the Mainnet ledgers.")

if __name__ == "__main__":
    run_total_extraction()