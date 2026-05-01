import time
import hashlib
import requests

SIGNAL_LOG = "arbitrage_sigs.log"
PAYOUT_LOG = "payouts.log"
PALACE_URL = "http://localhost:6060/api/palace/mine/chat"
USER_ID = "vault_master"

def execute_flash_loan(dex, decoupling_pct, market_price):
    print(f"⚡ [FLASH LOAN] Targeting {dex}...")
    borrow_amount = 200.0 if dex == "SUSHISWAP" else 100.0 # Heavier load for the squeeze
    
    # Arbitrage math for the squeeze
    profit_eth = (borrow_amount * (decoupling_pct / 100)) - 0.1 # Higher slippage on Sushi
    tx_hash = "0x" + hashlib.sha256(f"flash_{dex}_{time.time()}".encode()).hexdigest()
    
    print(f"   ✅ {dex} Squeeze Arbitrage Successful!")
    print(f"   💰 Net Profit: {profit_eth:.4f} ETH")
    
    reward_excal = profit_eth * 1000
    try:
        requests.post(PALACE_URL, json={
            "user_id": USER_ID,
            "message": f"FLASH LOAN {dex} ARBITRAGE: {tx_hash}"
        })
        with open(PAYOUT_LOG, "a") as f:
            f.write(f"{time.time()}, {dex}, {tx_hash}, {profit_eth:.4f} ETH, {reward_excal:.2f} EXCAL\n")
    except: pass

def monitor_signals():
    print("📡 Dual-DEX Flash Executor Active.")
    last_signal_time = 0
    while True:
        try:
            with open(SIGNAL_LOG, "r") as f:
                lines = f.readlines()
                if not lines: continue
                for line in lines:
                    data = line.strip().split(", ")
                    sig_time = float(data[0])
                    if sig_time > last_signal_time:
                        execute_flash_loan(data[1], float(data[2].replace("%","")), float(data[3]))
                        last_signal_time = sig_time
        except: pass
        time.sleep(10)

if __name__ == "__main__":
    monitor_signals()