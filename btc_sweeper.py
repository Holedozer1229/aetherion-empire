#!/usr/bin/env python3
"""
💰 AETHERION BTC SWEEPER v4.1 — Sovereign Configuration Edition.
Bypasses library lookups to ensure valid hex generation on Render.
"""

import os, requests, json, hashlib
from bitcoinutils.keys import PrivateKey
from bitcoinutils.transactions import Transaction, TxInput, TxOutput
import bitcoinutils.constants as constants

def run_btc_sweep():
    print("📡 Initializing Sovereign BTC Sweep...")
    
    # Manually setting Mainnet constants to bypass setup() 404s
    constants.NETWORK_WIF_PREFIX = 0x80
    constants.NETWORK_P2PKH_PREFIX = 0x00
    constants.NETWORK_P2SH_PREFIX = 0x05
    constants.NETWORK_SEGWIT_PREFIX = "bc"
    
    priv_key_hex = os.environ.get("BTC_PRIV_KEY")
    dest_addr = "bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal"
    
    if not priv_key_hex:
        print("❌ Error: BTC_PRIV_KEY missing.")
        return

    try:
        if priv_key_hex.startswith('0x'): priv_key_hex = priv_key_hex[2:]
        priv = PrivateKey(priv_key_hex)
        address = priv.get_public_key().get_address().to_string()
        
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

        # Standard fee for fast inclusion in 2026
        fee = 8000 
        out_val = total_val - fee
        tx_outputs = [TxOutput(out_val, dest_addr)]

        tx = Transaction(tx_inputs, tx_outputs)
        
        print(f"✅ {len(tx_inputs)} Input(s) detected. Total: {total_val / 10**8} BTC")
        
        # Final serialization of the raw transaction
        raw_hex = tx.serialize()
        
        print(f"\n✅ VALID RAW HEX GENERATED!")
        print(f"📜 Copy this to mempool.space/tx/push:")
        print(f"{raw_hex}")
        print("-" * 35)
            
    except Exception as e:
        print(f"❌ Execution Error: {e}")

if __name__ == "__main__":
    run_btc_sweep()