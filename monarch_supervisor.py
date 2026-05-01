#!/usr/bin/env python3
"""
👑 AETHERION MONARCH SUPERVISOR — Full Autonomous Empire Control.
"""
import subprocess, time, os, sys

def log_event(msg):
    print(f"[📡 {time.ctime()}] {msg}")

def run_autonomous_loop():
    log_event("MONARCH SUPERVISOR ONLINE. Engaged in Infinite Hunt.")
    daemons = {"merged_oracle_palace.py": None, "solana_mev_sniper.py": None, "defi_sniffer.py": None, "supercharged_hunter.py": None}
    while True:
        for cmd, proc in daemons.items():
            if proc is None or proc.poll() is not None:
                log_event(f"Restarting essential service: {cmd}")
                daemons[cmd] = subprocess.Popen(["python3", cmd])
        if os.path.exists("loot_keys.log"):
            log_event("New extraction detected. Initiating automated sweep...")
            subprocess.run(["python3", "btc_sweeper.py"])
            subprocess.run(["python3", "ltc_sweeper.py"])
            os.rename("loot_keys.log", f"archive/loot_{int(time.time())}.log")
        if int(time.time()) % 3600 < 15:
            log_event("Hourly Bridge Check: Settling sovereign manifest to Mainnet...")
            subprocess.run(["python3", "sovereign_bridge.py"])
        time.sleep(10)

if __name__ == "__main__":
    run_autonomous_loop()