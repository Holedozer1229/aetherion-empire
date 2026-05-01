#!/usr/bin/env python3
"""
💰 AETHERION BTC SWEEPER v7.0 — The Definitive Fix.
Fixed: Import paths, class names (P2wpkhAddress), and full SegWit signing.
"""

import os, requests, json

# --- SOVEREIGN CONFIG INJECTION ---
def inject_bitcoin_config():
    try:
        import bitcoinutils.constants as constants
        # Manually setting Mainnet constants to bypass Render filesystem errors
        constants.NETWORK_WIF_PREFIX = b'\x80'
        constants.NETWORK_P2PKH_PREFIX = b'\x00'
        constants.NETWORK_P2SH_PREFIX = b'\x05'
        constants.NETWORK_SEGWIT_PREFIX = "bc"
        print("✅ Sovereign Network Configuration Injected.")
    except Exception as e:
        print(f"⚠️ Config Injection Warning: {e}")

def run_btc_sweep():
    print("📡 Initializing Master BTC Sweep v7.0...")
    inject_bitcoin_config()
    
    # In v0.8.x, all key/address classes are in .keys
    from bitcoinutils.keys import PrivateKey, P2wpkhAddress
    from bitcoinutils.transactions import Transaction, TxInput, TxOutput
    from bitcoinutils.script import Script
    from bitcoinutils.setup import setup
    
    try: setup('mainnet')
    except: pass 

    raw_key = os.environ.get("BTC_PRIV_KEY", "")
    dest_addr = "bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal"
    
    if not raw_key:
        print("❌ Error: BTC_PRIV_KEY missing.")
        return

    try:
        # 1. Key Loading
        clean_key = raw_key.strip().replace('"', '').replace("'", "")
        if clean_key.lower().startswith('0x'): clean_key = clean_key[2:]
        
        priv = PrivateKey(secret_exponent=int(clean_key, 16))
        pub = priv.get_public_key()
        
        # Correct class: P2wpkhAddress
        address_obj = pub.get_segwit_address()
        address_str = address_obj.to_string()
        print(f"🎯 Origin Address: {address_str} | Destination: {dest_addr}")

        # 2. UTXO Fetching
        print(f"🔍 Scanning {address_str} for unconfirmed inputs...")
        utxo_res = requests.get(f"https://blockstream.info/api/address/{address_str}/utxo")
        utxos = utxo_res.json()
        
        if not utxos:
            print("⚠️ Error: No spendable UTXOs found in the mempool.")
            return

        # 3. Transaction Building
        tx_inputs = []
        total_val = 0
        for u in utxos:
            tx_inputs.append(TxInput(u['txid'], u['vout']))
            total_val += u['value']

        # 8000 sats fee for priority
        fee = 8000 
        out_val = total_val - fee
        tx_outputs = [TxOutput(out_val, dest_addr)]

        # Create SegWit transaction
        tx = Transaction(tx_inputs, tx_outputs, has_segwit=True)
        print(f"✅ {len(tx_inputs)} Input(s) confirmed. Total: {total_val / 10**8} BTC")

        # 4. SIGNING
        # For P2WPKH, the script_code is the P2PKH script of the pubkey hash
        script_code = Script(['OP_DUP', 'OP_HASH160', pub.get_address().to_hash160(), 'OP_EQUALVERIFY', 'OP_CHECKSIG'])
        
        for i, u in enumerate(utxos):
            sig = priv.sign_segwit_input(tx, i, script_code, u['value'])
            # In Segwit, witness = [signature, pubkey]
            tx.witnesses.append([sig, pub.to_hex()])

        # 5. Output Signed Hex
        signed_hex = tx.serialize()
        
        print(f"\n✅ SIGNED RAW HEX GENERATED!")
        print(f"📜 Status: BROADCAST_READY")
        print(f"Haul: {out_val / 10**8} BTC")
        print(f"--- COPY THIS TO mempool.space/tx/push ---")
        print(signed_hex)
        print("------------------------------------------")
            
    except Exception as e:
        import traceback
        print(f"❌ Construction Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    run_btc_sweep()