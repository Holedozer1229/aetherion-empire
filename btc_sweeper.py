#!/usr/bin/env python3
"""
💰 AETHERION BTC SWEEPER v6.1 — Import Correction Edition.
Fixed: P2WPKHAddress import and signing witness construction.
"""

import os, requests, json

# --- SOVEREIGN CONFIG INJECTION ---
def inject_bitcoin_config():
    try:
        import bitcoinutils.constants as constants
        # Manually setting Mainnet constants for Render
        constants.NETWORK_WIF_PREFIX = b'\x80'
        constants.NETWORK_P2PKH_PREFIX = b'\x00'
        constants.NETWORK_P2SH_PREFIX = b'\x05'
        constants.NETWORK_SEGWIT_PREFIX = "bc"
        print("✅ Sovereign Network Configuration Injected.")
    except Exception as e:
        print(f"⚠️ Config Injection Warning: {e}")

def run_btc_sweep():
    print("📡 Initializing Master BTC Sweep v6.1...")
    inject_bitcoin_config()
    
    from bitcoinutils.keys import PrivateKey
    from bitcoinutils.address import P2WPKHAddress
    from bitcoinutils.transactions import Transaction, TxInput, TxOutput
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
        
        # Correct address derivation for P2WPKH
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

        fee = 10000 
        out_val = total_val - fee
        tx_outputs = [TxOutput(out_val, dest_addr)]

        tx = Transaction(tx_inputs, tx_outputs, has_segwit=True)
        print(f"✅ {len(tx_inputs)} Input(s) confirmed. Total: {total_val / 10**8} BTC")

        # 4. SIGNING
        # Segwit signing requires the script code (p2pkh script inside p2wpkh)
        script_code = pub.get_segwit_address().to_script_pub_key()
        
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
        print(f"❌ Construction Error: {e}")

if __name__ == "__main__":
    run_btc_sweep()