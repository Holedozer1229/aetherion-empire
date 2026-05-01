import subprocess
import time
import os

def start_empire():
    print("🚀 Starting Aetherion Empire on Render...")
    
    # Start the Merged Oracle Palace (Web Service)
    print("🔗 Launching Merged Oracle Palace (Port 6060)...")
    palace = subprocess.Popen(["python3", "merged_oracle_palace.py"])
    
    # Wait for the server to spin up
    time.sleep(5)
    
    # Start the automated snipers (Background Workers)
    print("📡 Launching Global MEV Sniper Fleet...")
    subprocess.Popen(["python3", "solana_mev_sniper.py"])
    subprocess.Popen(["python3", "defi_sniffer.py"])
    subprocess.Popen(["python3", "flash_loan_executor.py"])
    
    # Monitor the palace
    palace.wait()

if __name__ == "__main__":
    start_empire()