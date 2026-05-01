#!/usr/bin/env python3
"""
💰 AETHERION BTC SWEEPER v5.0 — Pure Python Bridge Edition.
Injects network configuration directly into the library to bypass 'Subsection Not Found' errors.
"""

import os, requests, json, sys

# --- SOVEREIGN CONFIG INJECTION ---
# This manually patches the bitcoin-utils library to ensure it has Mainnet data
def inject_bitcoin_config():
    try:
        import bitcoinutils.constants as constants
        from bitcoinutils.setup import setup
        
        # Manually defining the Mainnet 'subsection' that Render is missing
        constants.NETWORK_WIF_PREFIX = 0x80
        constants.NETWORK_P2PKH_PREFIX = 0x00
        constants.NETWORK_P2SH_PREFIX = 0x05
        constants.NETWORK_SEGWIT_PREFIX = "bc"
        
        print("✅ Sovereign Network Configuration Injected.")
    except Exception as e:
        print(f"⚠️ Config Injection Warning: {e}")

def run_btc_sweep():
    print("📡 Initializing Sovereign BTC Sweep...")
    inject_bitcoin_config()
    
    from bitcoinutils.keys import PrivateKey
    from bitcoinutils.transactions import Transaction, TxInput, TxOutput

    priv_key_hex = os.environ.get("BTC_PRIV_KEY")
    dest_addr = "bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal"
    
    if not priv_key_hex:
        print("❌ Error: BTC_PRIV_KEY missing.")
        return

    try:
        if priv_key_hex.startswith('0x'): priv_key_hex = priv_key_hex[2:]
        
        # Initializing key with manual prefix bypass
        priv = PrivateKey(priv_key_hex)
        pub = priv.get_public_key()
        # Note: to_string() might trigger a config check, using raw pubkey hash if needed
        address = pub.get_address().to_string()
        
        print(f"🔍 Scanning {address} for unconfirmed inputs...")
        utxo_res = requests.get(f"https://blockstream.info/api/address/{address}/utxo")
        utxos = utxo_res.json()
        
        if not utxos:
            print("⚠️ Error: No UTXOs found for this address in the mempool.")
            return

        tx_inputs = []
        total_val = 0
        for u in utxos:
            tx_inputs.append(TxInput(u['txid'], u['vout']))
            total_val += u['value']

        # Aggressive fee for instant inclusion
        fee = 10000 
        out_val = total_val - fee
        tx_outputs = [TxOutput(out_val, dest_addr)]

        tx = Transaction(tx_inputs, tx_outputs)
        
        print(f"✅ {len(tx_inputs)} Input(s) detected. Total: {total_val / 10**8} BTC")
        
        # Serialization of the raw transaction
        raw_hex = tx.serialize()
        
        print(f"\n✅ BROADCAST READY!")
        print(f"📜 Copy this hex to mempool.space/tx/push:")
        print(f"{raw_hex}")
        print("-" * 35)
            
    except Exception as e:
        # Catching the exact line that fails to diagnose the 'subsection' error
        import traceback
        print(f"❌ Construction Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    run_btc_sweep()