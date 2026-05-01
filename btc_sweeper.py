#!/usr/bin/env python3
"""
💰 AETHERION BTC SWEEPER v7.3 — Exhaustive Address Search.
Scans every possible address type (Legacy Uncompressed, Legacy Compressed, P2SH, Native SegWit)
for the 0.84 BTC jackpot key.
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
    print("📡 Initializing Master BTC Sweep v7.3...")
    inject_bitcoin_config()
    
    from bitcoinutils.keys import PrivateKey, PublicKey
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
        
        # Initialize PrivateKey with the secret exponent
        secret_int = int(priv_key_hex, 16)
        priv_compressed = PrivateKey(secret_exponent=secret_int)
        pub_compressed = priv_compressed.get_public_key()
        
        # Manually constructing uncompressed public key path
        priv_uncompressed = PrivateKey(secret_exponent=secret_int)
        pub_uncompressed = priv_uncompressed.get_public_key()
        # Note: in bitcoin-utils, uncompressed is handled by a flag on the PublicKey
        pub_uncompressed.compressed = False

        # 2. Exhaustive Multi-Address Generation
        addresses = {
            "Legacy Uncompressed (1...)": pub_uncompressed.get_address(),
            "Legacy Compressed (1...)": pub_compressed.get_address(),
            "Nested SegWit (3...)": pub_compressed.get_segwit_address().to_p2sh_address(),
            "Native SegWit (bc1q...)": pub_compressed.get_segwit_address()
        }

        found_utxos = None
        active_addr_obj = None
        active_label = None
        active_pub = None

        print("\n🔎 Starting Exhaustive Address Scan...")
        for label, addr_obj in addresses.items():
            addr_str = addr_obj.to_string()
            print(f"   Scanning {label}: {addr_str}...")
            
            try:
                res = requests.get(f"https://blockstream.info/api/address/{addr_str}/utxo", timeout=10)
                utxos = res.json()
                if utxos:
                    print(f"   ✅ JACKPOT FOUND at {label}!")
                    found_utxos = utxos
                    active_addr_obj = addr_obj
                    active_label = label
                    active_pub = pub_uncompressed if "Uncompressed" in label else pub_compressed
                    break
            except: continue

        if not found_utxos:
            print("\n⚠️ Status: No unconfirmed inputs found across any of the 4 major formats.")
            return

        # 3. Transaction Building
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

        # 4. SIGNING
        print(f"\n🔑 Signing for {active_label} inputs...")
        if is_segwit:
            # Handling Native and Nested SegWit
            script_code = active_pub.get_segwit_address().to_script_pub_key()
            for i, u in enumerate(found_utxos):
                sig = priv_compressed.sign_segwit_input(tx, i, script_code, u['value'])
                tx.witnesses.append([sig, active_pub.to_hex()])
        else:
            # Legacy (Compressed or Uncompressed)
            for i in range(len(tx_inputs)):
                sig = priv_compressed.sign_input(tx, i, active_addr_obj.to_script_pub_key())
                tx_inputs[i].script_sig = Script([sig, active_pub.to_hex()])

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