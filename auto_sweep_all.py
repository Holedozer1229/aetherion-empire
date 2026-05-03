#!/usr/bin/env python3
import os, requests, time

def run_total_extraction():
    # Primary Production URL
    base_url = "https://aetherion-empire.onrender.com"
    sig = "97e0945f76a0ef6615301f70c1f236f4c949d131456b991b5576983f3384aaa6"
    
    routes = [
        "/api/payout/btc-jackpot", 
        "/api/payout/ltc-strike", 
        "/api/payout/chained-sweep", 
        "/api/payout/eth-haul", 
        "/api/payout/sovereign-bridge"
    ]
    
    print(f"🎯 Starting extraction sequence on {base_url}...")
    
    for route in routes:
        full_url = f"{base_url}{route}?sig={sig}"
        print(f"📡 Triggering {route}...")
        try:
            resp = requests.get(full_url, timeout=30)
            print(f"   ✅ Status: {resp.status_code}")
        except Exception as e:
            print(f"   ❌ Failed: {e}")
        time.sleep(2)

if __name__ == "__main__":
    run_total_extraction()
