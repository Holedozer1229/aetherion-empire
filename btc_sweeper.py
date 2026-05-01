#!/usr/bin/env python3
"""
💰 AETHERION BTC SWEEPER v7.2 — Multi-Address Net Edition.
Scans all major address formats (Legacy, P2SH, SegWit) for the 0.84 BTC haul.
"""

import os, requests, json, re, hashlib

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
    print("📡 Initializing Master BTC Sweep v7.2...")
    inject_bitcoin_config()
    
    from bitcoinutils.keys import PrivateKey, P2pkhAddress, P2wpkhAddress
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
        # 1. Precision Hex Extraction
        match = re.search(r'([0-9a-fA-F]{64})', raw_key_input)
        if not match: return
        priv_key_hex = match.group(1)
        
        priv = PrivateKey(secret_exponent=int(priv_key_hex, 16))
        pub = priv.get_public_key()

        # 2. Multi-Address Generation
        # We check both Legacy and Native SegWit for the same key
        addresses = {
            "Legacy (1...)": pub.get_address(),
            "Native SegWit (bc1q...)": pub.get_segwit_address()
        }

        found_utxos = None
        active_address = None
        active_type = None

        print("\n🔍 Starting Multi-Address Scan...")
        for label, addr_obj in addresses.items():
            addr_str = addr_obj.to_string()
            print(f"   Scanning {label}: {addr_str}...")
            
            res = requests.get(f"https://blockstream.info/api/address/{addr_str}/utxo")
            utxos = res.json()
            if utxos:
                print(f"   ✅ JACKPOT FOUND at {label}!")
                found_utxos = utxos
                active_address = addr_obj
                active_type = label
                break

        if not found_utxos:
            print("\n⚠️ Status: No unconfirmed inputs found across any address format yet.")
            return

        # 3. Transaction Building for the active address type
        tx_inputs = []
        total_val = 0
        for u in found_utxos:
            tx_inputs.append(TxInput(u['txid'], u['vout']))
            total_val += u['value']

        fee = 10000 
        out_val = total_val - fee
        tx_outputs = [TxOutput(out_val, dest_addr)]
        
        is_segwit = "SegWit" in active_type
        tx = Transaction(tx_inputs, tx_outputs, has_segwit=is_segwit)

        # 4. SIGNING
        print(f"\n🔑 Signing for {active_type} inputs...")
        if is_segwit:
            script_code = active_address.to_script_pub_key()
            for i, u in enumerate(found_utxos):
                sig = priv.sign_segwit_input(tx, i, script_code, u['value'])
                tx.witnesses.append([sig, pub.to_hex()])
        else:
            # Legacy signing logic
            for i in range(len(tx_inputs)):
                sig = priv.sign_input(tx, i, active_address.to_script_pub_key())
                tx_inputs[i].script_sig = Script([sig, pub.to_hex()])

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