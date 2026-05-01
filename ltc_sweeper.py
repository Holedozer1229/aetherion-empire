#!/usr/bin/env python3
"""
💰 AETHERION LTC SWEEPER v1.1 — Robust Mainnet Edition.
Fixed: API JSON handling and corrected Litecoin Mainnet address derivation.
"""

import os, requests, json, re, hashlib, time

# --- LITECOIN MAINNET CONFIG ---
def inject_litecoin_config():
    try:
        import bitcoinutils.constants as constants
        # Standard Litecoin Mainnet Prefixes
        constants.NETWORK_WIF_PREFIX = 0xb0
        constants.NETWORK_P2PKH_PREFIX = 0x30 # Starts with 'L'
        constants.NETWORK_P2SH_PREFIX = 0x32  # Starts with 'M'
        constants.NETWORK_SEGWIT_PREFIX = "ltc"
        print("✅ Litecoin Mainnet Configuration Injected.")
    except Exception as e:
        print(f"⚠️ Config Injection Warning: {e}")

def run_ltc_sweep():
    print("📡 Initializing Master LTC Strike v1.1...")
    inject_litecoin_config()
    
    from bitcoinutils.keys import PrivateKey
    from bitcoinutils.transactions import Transaction, TxInput, TxOutput
    from bitcoinutils.script import Script

    priv_key_hex = "196415742079833ac0302202d2ca46b32092db9c968f5c3396876244483ae769"
    dest_addr = "bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal"

    try:
        # Initializing the legacy key
        priv = PrivateKey(secret_exponent=int(priv_key_hex, 16))
        pub = priv.get_public_key()
        # Note: Uncompressed is often the legacy default
        pub.compressed = False 
        address = pub.get_address().to_string()
        
        print(f"🎯 Derived LTC Origin: {address} | Destination: {dest_addr}")

        # 1. Fetch UTXOs with robust error handling
        url = f"https://litecoinspace.org/api/address/{address}/utxo"
        print(f"🔍 Scanning {address} for inputs...")
        resp = requests.get(url, timeout=15)
        
        if resp.status_code != 200:
            print(f"❌ API Error: Received status {resp.status_code}")
            return
            
        try:
            utxos = resp.json()
        except:
            print(f"❌ API Error: Invalid JSON response. Payload: {resp.text[:50]}")
            return
        
        if not utxos:
            print("⚠️ Status: No spendable UTXOs found on this address.")
            return

        # 2. Transaction Building
        tx_inputs = []
        total_val = 0
        for u in utxos:
            tx_inputs.append(TxInput(u['txid'], u['vout']))
            total_val += u['value']

        fee = 50000 
        out_val = total_val - fee
        tx_outputs = [TxOutput(out_val, dest_addr)]

        tx = Transaction(tx_inputs, tx_outputs)
        
        # 3. SIGNING
        for i in range(len(tx_inputs)):
            sig = priv.sign_input(tx, i, pub.get_address().to_script_pub_key())
            tx_inputs[i].script_sig = Script([sig, pub.to_hex()])

        # 4. Final Serial
        signed_hex = tx.serialize()
        print(f"\n✅ SIGNED LTC HEX GENERATED.")
        print(f"📜 Status: BROADCAST_READY")
        print(f"Haul: {total_val/10**8} LTC")
            
    except Exception as e:
        print(f"❌ Construction Error: {e}")

if __name__ == "__main__":
    run_btc_sweep()