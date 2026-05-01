#!/usr/bin/env python3
"""
🏯 AETHERION SUPERVISOR — The Automatic Empire Daemon.
Logic: Launch child processes and restart them immediately if they exit.
"""

import subprocess
import time
import sys
import os

def start_daemon(command, name):
    print(f"📡 Launching {name}...")
    return subprocess.Popen([sys.executable, command])

def monitor_empire():
    print("🚀 Starting Aetherion Empire Supervisor...")
    
    # Dictionary of {command_file: process_object}
    processes = {
        "merged_oracle_palace.py": None,
        "solana_mev_sniper.py": None,
        "defi_sniffer.py": None,
        "flash_loan_executor.py": None
    }
    
    while True:
        for cmd, proc in processes.items():
            # If process hasn't started or has died, restart it
            if proc is None or proc.poll() is not None:
                if proc is not None:
                    print(f"⚠️ Daemon {cmd} exited. Restarting now...")
                processes[cmd] = start_daemon(cmd, cmd)
        
        # Heartbeat check every 10 seconds
        time.sleep(10)

if __name__ == "__main__":
    try:
        monitor_empire()
    except KeyboardInterrupt:
        print("\n🛑 Supervisor shutting down.")
        sys.exit(0)