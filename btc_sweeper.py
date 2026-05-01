#!/usr/bin/env python3
"""
💰 AETHERION BTC SWEEPER v8.0 — The Total Sweep Edition.
Fixed: Uncompressed vs Compressed pubkey logic and added P2SH scan.
"""

import os, requests, json, re, hashlib, time

# --- SOVEREIGN CONFIG INJECTION ---
def inject_bitcoin_config():
    try:
        import bitcoinutils.constants as constants
        constants.NETWORK_WIF_PREFIX = b'\x80'
        constants.NETWORK_P2PKH_PREFIX = b'\x00'
        constants.NETWORK_P2SH_PREFIX = b'\x05'
        constants.NETWORK_SEGWIT_PREFIX = "bc"
    except: pass

def broadcast_tx(raw_hex):
    print(" 📡 [BROADCAST] Pushing transaction to Bitcoin Mainnet...")
    try:
        resp = requests.post("https://blockstream.info/api/tx", data=raw_hex, timeout=15)
        if resp.status_code == 200:
            txid = resp.text.strip()
            print(f"\n✅ BROADCAST SUCCESSFUL!")
            print(f"📜 Transaction ID: {txid}")
            return txid
        else:
            print(f"❌ Broadcast Failed: {resp.status_code} - {resp.text}")
            return None
    except Exception as e:
        print(f"❌ API Error: {e}")
        return None

def run_btc_sweep():
    print("📡 Initializing Master BTC Sweep v8.0...")
    inject_bitcoin_config()
    
    from bitcoinutils.keys import PrivateKey, PublicKey, P2shAddress
    from bitcoinutils.transactions import Transaction, TxInput, TxOutput
    from bitcoinutils.script import Script
    from bitcoinutils.setup import setup
    
    try: setup('mainnet')
    except: pass 

    raw_key_input = os.environ.get("BTC_PRIV_KEY", "")
    dest_addr = "bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal"
    
    if not raw_key_input:
        print("❌ Error: BTC_PRIV_KEY missing.")
        return

    try:
        match = re.search(r'([0-9a-fA-F]{64})', raw_key_input)
        if not match: return
        priv_key_hex = match.group(1)
        secret_int = int(priv_key_hex, 16)

        priv = PrivateKey(secret_exponent=secret_int)
        pub_uncomp = priv.get_public_key()
        pub_uncomp.compressed = False
        pub_comp = priv.get_public_key()
        pub_comp.compressed = True

        redeem_script = Script(['OP_0', pub_comp.get_segwit_address().to_hash160()])
        p2sh_nested_addr = P2shAddress(redeem_script=redeem_script)

        scan_targets = [
            ("Legacy Uncompressed", pub_uncomp.get_address(), pub_uncomp),
            ("Legacy Compressed", pub_comp.get_address(), pub_comp),
            ("Nested SegWit (P2SH)", p2sh_nested_addr, pub_comp),
            ("Native SegWit (Bech32)", pub_comp.get_segwit_address(), pub_comp)
        ]

        found_utxos = None
        active_addr_obj = None
        active_label = None
        active_pub = None

        print("\n🔍 Deep Scanning all address variants...")
        for label, addr_obj, pub_obj in scan_targets:
            addr_str = addr_obj.to_string()
            print(f"   Checking {label}: {addr_str}...")
            
            addr_info = requests.get(f"https://blockstream.info/api/address/{addr_str}", timeout=10).json()
            funded = addr_info.get('chain_stats', {}).get('funded_txo_sum', 0) + addr_info.get('mempool_stats', {}).get('funded_txo_sum', 0)
            spent = addr_info.get('chain_stats', {}).get('spent_txo_sum', 0) + addr_info.get('mempool_stats', {}).get('spent_txo_sum', 0)
            balance = funded - spent

            if balance > 0:
                print(f"   ✅ JACKPOT LOCATED: {balance/10**8} BTC found on {label}!")
                res = requests.get(f"https://blockstream.info/api/address/{addr_str}/utxo", timeout=10)
                found_utxos = res.json()
                active_addr_obj = addr_obj
                active_label = label
                active_pub = pub_obj
                break

        if not found_utxos:
            print("\n⚠️ Status: Zero balance detected across all 4 major address formats.")
            return

        tx_inputs = []
        total_val = 0
        for u in found_utxos:
            tx_inputs.append(TxInput(u['txid'], u['vout']))
            total_val += u['value']

        fee = 10000 
        out_val = total_val - fee
        tx_outputs = [TxOutput(out_val, dest_addr)]
        
        is_segwit = "SegWit" in active_label
        tx = Transaction(tx_inputs, tx_outputs, has_segwit=is_segwit)

        if "Native SegWit" in active_label:
            script_code = active_pub.get_segwit_address().to_script_pub_key()
            for i, u in enumerate(found_utxos):
                sig = priv.sign_segwit_input(tx, i, script_code, u['value'])
                tx.witnesses.append([sig, active_pub.to_hex()])
        elif "Nested SegWit" in active_label:
            script_code = active_pub.get_segwit_address().to_script_pub_key()
            for i, u in enumerate(found_utxos):
                sig = priv.sign_segwit_input(tx, i, script_code, u['value'])
                tx.witnesses.append([sig, active_pub.to_hex()])
                tx_inputs[i].script_sig = Script([redeem_script.to_hex()])
        else:
            for i in range(len(tx_inputs)):
                sig = priv.sign_input(tx, i, active_addr_obj.to_script_pub_key())
                tx_inputs[i].script_sig = Script([sig, active_pub.to_hex()])

        signed_hex = tx.serialize()
        print(f"\n✅ SIGNED RAW HEX GENERATED.")
        broadcast_tx(signed_hex)
            
    except Exception as e:
        print(f"❌ Execution Error: {e}")

if __name__ == "__main__":
    run_btc_sweep()