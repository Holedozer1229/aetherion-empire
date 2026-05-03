import os, json, time, hashlib, base64
from web3 import Web3
from cryptography.fernet import Fernet

# --- Configuration ---
BASE_RPC = "https://mainnet.base.org"
VAULT_PATH = "vault.enc"
PASSPHRASE = "Aetherion-Prime-2026"

WETH = Web3.to_checksum_address("0x4200000000000000000000000000000000000006")
USDC = Web3.to_checksum_address("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913")
UNI_QUOTER = Web3.to_checksum_address("0x3d6e8327B341A00070780298b741432c3c586771")
AERO_ROUTER = Web3.to_checksum_address("0xcF77a3Ba9A5CA399AF7350c58eC597483f7373d1")
AERO_FACTORY = Web3.to_checksum_address("0x420DD3807E0E105ED2f24859a246E95400263156")

QUOTER_ABI = '[{"inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"name":"quoteExactInputSingle","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]'
AERO_ABI = '[{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"stable","type":"bool"},{"internalType":"address","name":"factory","type":"address"}],"internalType":"struct IRouter.Route[]","name":"routes","type":"tuple[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"}]'

def stalk():
    print("🕵️ [AETHERION] Stalker Node 0 Online. Scanning mempool...")
    w3 = Web3(Web3.HTTPProvider(BASE_RPC))
    uni_quoter = w3.eth.contract(address=UNI_QUOTER, abi=QUOTER_ABI)
    aero_router = w3.eth.contract(address=AERO_ROUTER, abi=AERO_ABI)
    
    while True:
        try:
            fuel = w3.to_wei(0.003, 'ether')
            uni_out = uni_quoter.functions.quoteExactInputSingle(WETH, USDC, 3000, fuel, 0).call()
            
            if uni_out > 0:
                routes = [{"from": WETH, "to": USDC, "stable": False, "factory": AERO_FACTORY}]
                aero_out = aero_router.functions.getAmountsOut(fuel, routes).call()[-1]
                
                if abs(uni_out - aero_out) / max(uni_out, aero_out) > 0.01:
                    print(f"🚨 OPPORTUNITY: Gap detected! Uni: {uni_out} | Aero: {aero_out}")
            
            time.sleep(15)
        except Exception as e:
            print(f"⚠️ Scan Jitter: {e}")
            time.sleep(30)

if __name__ == "__main__":
    stalk()