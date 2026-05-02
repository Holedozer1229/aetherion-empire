import subprocess
import time
import os
import sys

def start_empire():
    print("🚀 [AETHERION] Initializing Cloud-Native Ascension...")
    
    # 1. Start the Merged Oracle Palace (Web Service) via Gunicorn for production
    port = os.environ.get('PORT', '6060')
    print(f"🔗 Launching Merged Oracle Palace on Port {port}...")
    
    # Using gunicorn for the Flask app to ensure Render health checks pass
    palace_cmd = ["gunicorn", "--bind", f"0.0.0.0:{port}", "merged_oracle_palace:app", "--timeout", "120"]
    palace = subprocess.Popen(palace_cmd)
    
    # Wait for the server to stabilize
    time.sleep(10)
    
    # 2. Start Background Workers (Optional/Silent)
    workers = [
        "solana_mev_sniper.py",
        "defi_sniffer.py",
        "flash_loan_executor.py"
    ]
    
    for worker in workers:
        if os.path.exists(worker):
            print(f"📡  Launching Background Worker: {worker}")
            subprocess.Popen(["python3", worker], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    print("✅ Aetherion Empire is now operational.")
    
    # Monitor the palace process
    try:
        palace.wait()
    except KeyboardInterrupt:
        palace.terminate()
        sys.exit(0)

if __name__ == "__main__":
    start_empire()