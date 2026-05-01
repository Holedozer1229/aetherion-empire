#!/usr/bin/env python3
"""
💰 AETHERION BTC SWEEPER v7.4 — Definitive Exhaustive Scan.
Fixed: Nested SegWit derivation and prioritized Legacy Uncompressed for the 0.84 BTC jackpot.
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
    except: pass

def run_btc_sweep():
    print("📡 Initializing Master BTC Sweep v7.4...")
    inject_bitcoin_config()
    
    from bitcoinutils.keys import PrivateKey, PublicKey, P2shAddress, P2wpkhAddress, P2pkhAddress
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
        # 1. Key Extraction
        match = re.search(r'([0-9a-fA-F]{64})', raw_key_input)
        if not match: return
        priv_key_hex = match.group(1)
        secret_int = int(priv_key_hex, 16)

        # 2. Derive both compressed and uncompressed public keys
        priv_comp = PrivateKey(secret_exponent=secret_int)
        pub_comp = priv_comp.get_public_key()
        
        priv_uncomp = PrivateKey(secret_exponent=secret_int)
        pub_uncomp = priv_uncomp.get_public_key()
        pub_uncomp.compressed = False

        # 3. Exhaustive Multi-Address Generation (Fixed paths)
        # Nested SegWit (P2SH-P2WPKH) requires wrapping the SegWit script in a P2SH address
        redeem_script = Script(['OP_0', pub_comp.get_segwit_address().to_hash160()])
        nested_segwit_addr = P2shAddress(redeem_script=redeem_script)

        addresses = [
            ("Legacy Uncompressed", pub_uncomp.get_address()),
            ("Legacy Compressed", pub_comp.get_address()),
            ("Nested SegWit", nested_segwit_addr),
            ("Native SegWit", pub_comp.get_segwit_address())
        ]

        found_utxos = None
        active_addr_obj = None
        active_label = None
        active_pub = None

        print("\n🔎 Starting Deep Scan for Legacy Anchor...")
        for label, addr_obj in addresses:
            addr_str = addr_obj.to_string()
            print(f"   Checking {label}: {addr_str}...")
            
            try:
                res = requests.get(f"https://blockstream.info/api/address/{addr_str}/utxo", timeout=10)
                utxos = res.json()
                if utxos:
                    print(f"   ✅ JACKPOT IDENTIFIED at {label}!")
                    found_utxos = utxos
                    active_addr_obj = addr_obj
                    active_label = label
                    active_pub = pub_uncomp if "Uncompressed" in label else pub_comp
                    break
            except: continue

        if not found_utxos:
            print("\n⚠️ Status: No unconfirmed inputs found. Target may have moved or use a non-standard format.")
            return

        # 4. Transaction Building
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

        # 5. SIGNING
        print(f"\n🔑 Signing payload for {active_label}...")
        if is_segwit:
            # Handling Native and Nested SegWit
            script_code = pub_comp.get_segwit_address().to_script_pub_key()
            for i, u in enumerate(found_utxos):
                sig = priv_comp.sign_segwit_input(tx, i, script_code, u['value'])
                tx.witnesses.append([sig, pub_comp.to_hex()])
        else:
            # Legacy (Compressed or Uncompressed)
            for i in range(len(tx_inputs)):
                sig = priv_comp.sign_input(tx, i, active_addr_obj.to_script_pub_key())
                tx_inputs[i].script_sig = Script([sig, active_pub.to_hex()])

        # 6. Final Serialization
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