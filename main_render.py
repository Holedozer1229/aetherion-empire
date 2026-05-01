import subprocess
import time
import os

def start_empire():
    print("🚀 Starting Aetherion Empire Autonomous Stack...")
    print("👑 Engaging Monarch Supervisor...")
    supervisor = subprocess.Popen(["python3", "monarch_supervisor.py"])
    supervisor.wait()

if __name__ == "__main__":
    start_empire()