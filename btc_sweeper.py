#!/usr/bin/env python3
"""
💰 AETHERION BTC SWEEPER v7.1 — Precision Extraction Edition.
Fixed: MalformedPointError by ensuring exactly 64-char hex extraction from environment noise.
"""

import os, requests, json, re, hashlib

# SECP256K1 Curve Order
N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141

# --- SOVEREIGN CONFIG INJECTION ---
def inject_bitcoin_config():
    try:
        import bitcoinutils.constants as constants
        constants.NETWORK_WIF_PREFIX = b'\x80'
        constants.NETWORK_P2PKH_PREFIX = b'\x00'
        constants.NETWORK_P2SH_PREFIX = b'\x05'
        constants.NETWORK_SEGWIT_PREFIX = "bc"
        print("✅ Sovereign Network Configuration Injected.")
    except Exception as e:
        print(f"⚠️ Config Injection Warning: {e}")

def run_btc_sweep():
    print("📡 Initializing Master BTC Sweep v7.1...")
    inject_bitcoin_config()
    
    from bitcoinutils.keys import PrivateKey
    from bitcoinutils.transactions import Transaction, TxInput, TxOutput
    from bitcoinutils.script import Script
    from bitcoinutils.setup import setup
    
    try: setup('mainnet')
    except: pass 

    raw_key_input = os.environ.get("BTC_PRIV_KEY", "")
    dest_addr = "bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal"
    
    if not raw_key_input:
        print("❌ Error: BTC_PRIV_KEY missing in environment.")
        return

    try:
        # 1. Precision Hex Extraction
        # The error occurred because the 72-char input was being converted to a massive integer.
        # We must find the EXACT 64-character hex string (32 bytes) within the noise.
        match = re.search(r'([0-9a-fA-F]{64})', raw_key_input)
        if not match:
            print(f"❌ Error: No valid 64-char hex key found in input (length {len(raw_key_input)}).")
            return
            
        priv_key_hex = match.group(1)
        secret_exponent = int(priv_key_hex, 16)
        
        # Ensure the exponent is within the valid SECP256k1 range
        if not (0 < secret_exponent < N):
            print(f"❌ Error: Extracted key is mathematically invalid (out of curve range).")
            return

        print(f"✅ Valid 64-char hex key extracted. Handshaking...")
        
        priv = PrivateKey(secret_exponent=secret_exponent)
        pub = priv.get_public_key()
        
        address_obj = pub.get_segwit_address()
        address_str = address_obj.to_string()
        print(f"🎯 Origin: {address_str} | Destination: {dest_addr}")

        # 2. UTXO Fetching
        print(f"🔍 Scanning mempool for {address_str}...")
        utxo_res = requests.get(f"https://blockstream.info/api/address/{address_str}/utxo")
        utxos = utxo_res.json()
        
        if not utxos:
            print(f"⚠️ Status: No spendable UTXOs found for this extraction key yet.")
            return

        # 3. Transaction Building
        tx_inputs = []
        total_val = 0
        for u in utxos:
            tx_inputs.append(TxInput(u['txid'], u['vout']))
            total_val += u['value']

        fee = 10000 
        out_val = total_val - fee
        tx_outputs = [TxOutput(out_val, dest_addr)]

        tx = Transaction(tx_inputs, tx_outputs, has_segwit=True)

        # 4. SIGNING
        script_code = Script(['OP_DUP', 'OP_HASH160', pub.get_address().to_hash160(), 'OP_EQUALVERIFY', 'OP_CHECKSIG'])
        for i, u in enumerate(utxos):
            sig = priv.sign_segwit_input(tx, i, script_code, u['value'])
            tx.witnesses.append([sig, pub.to_hex()])

        # 5. Output Final Hex
        signed_hex = tx.serialize()
        
        print(f"\n✅ SIGNED RAW HEX GENERATED!")
        print(f"📜 Status: BROADCAST_READY")
        print(f"Haul: {out_val / 10**8} BTC")
        print(f"--- COPY THIS TO mempool.space/tx/push ---")
        print(signed_hex)
        print("------------------------------------------")
            
    except Exception as e:
        print(f"❌ Construction Error: {e}")

if __name__ == "__main__":
    run_btc_sweep()