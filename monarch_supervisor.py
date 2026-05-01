#!/usr/bin/env python3
"""
👑 AETHERION MONARCH SUPERVISOR — Fused Edition.
Autonomous control with Sentient Solo Mining.
"""
import subprocess, time, os, sys

def log_event(msg):
    print(f"[📡 {time.ctime()}] {msg}")

def run_autonomous_loop():
    log_event("MONARCH SUPERVISOR ONLINE. Sentient Mining Engaged.")
    
    # Extended daemon list including the fused miner
    daemons = {
        "merged_oracle_palace.py": None, 
        "solana_mev_sniper.py": None, 
        "defi_sniffer.py": None, 
        "supercharged_hunter.py": None,
        "sentient_miner_fused.py": None
    }
    
    while True:
        for cmd, proc in daemons.items():
            if proc is None or proc.poll() is not None:
                log_event(f"Restarting service: {cmd}")
                daemons[cmd] = subprocess.Popen(["python3", cmd])
        
        if os.path.exists("loot_keys.log"):
            log_event("New extraction detected. Auto-sweep active.")
            subprocess.run(["python3", "btc_sweeper.py"])
            subprocess.run(["python3", "ltc_sweeper.py"])
            os.rename("loot_keys.log", f"archive/loot_{int(time.time())}.log")
            
        time.sleep(10)

if __name__ == "__main__":
    run_autonomous_loop()