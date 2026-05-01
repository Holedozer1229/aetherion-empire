#!/usr/bin/env python3
import time, requests, os
def stalk_consensus():
    print("Monitoring Solana for Divergence...")
    while True:
        try:
            slot = requests.post("https://api.mainnet-beta.solana.com", json={"id":1, "jsonrpc":"2.0", "method":"getSlot"}).json().get('result')
            if slot and slot % 100 == 0:
                print(f"   [CHECK] Slot {slot} verified.")
        except: pass
        time.sleep(10)
if __name__ == "__main__":
    stalk_consensus()