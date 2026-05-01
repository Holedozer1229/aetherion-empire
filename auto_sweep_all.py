#!/usr/bin/env python3
import os, requests, time
def run_total_extraction():
    routes = ["/api/payout/btc-jackpot", "/api/payout/ltc-strike", "/api/payout/chained-sweep", "/api/payout/eth-haul", "/api/payout/sovereign-bridge"]
    base_url = f"http://localhost:{os.environ.get('PORT', 6060)}"
    sig = "97e0945f76a0ef6615301f70c1f236f4c949d131456b991b5576983f3384aaa6"
    for route in routes:
        try:
            requests.get(f"{base_url}{route}?sig={sig}", timeout=30)
            time.sleep(2)
        except: pass
if __name__ == "__main__":
    run_total_extraction()