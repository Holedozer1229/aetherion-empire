import subprocess
import time
import os

def start_empire():
    print("🚀 Starting Aetherion Empire Autonomous Stack...")
    
    # Launch the Monarch Supervisor as the master process
    print("👑 Engaging Monarch Supervisor...")
    supervisor = subprocess.Popen(["python3", "monarch_supervisor.py"])
    
    # Wait for the master process
    supervisor.wait()

if __name__ == "__main__":
    start_empire()