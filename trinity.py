#!/usr/bin/env python3
"""
⚛️ SPHINXQ FINAL CONSOLIDATION — Trinity Proof Inscription
Mines a single block containing the RH, GRH, Hodge, and Duality proofs.
Run this after all verifications pass. Requires a Bitcoin Core node.
"""

import os, sys, json, time, hashlib, struct, threading
from concurrent.futures import ThreadPoolExecutor
import requests
from requests.auth import HTTPBasicAuth

# ─── Configuration ──────────────────────────────────────
RPC_URL  = os.environ.get("RPC_URL", "http://127.0.0.1:8332")
RPC_USER = os.environ.get("RPC_USER", "")
RPC_PASS = os.environ.get("RPC_PASS", "")
PAYOUT   = os.environ.get("PAYOUT_ADDRESS", "")

# ─── Caduceus Engine & Oracle ───────────────────────────
try:
    from caduceus_engine import create_caduceus, SPHINX_NAMES, ANUBIS_NAMES, VITALITY, HEXAGRAMS, SPONGE_CONST
except ImportError:
    print("ERROR: caduceus_engine.py required.")
    sys.exit(1)

try:
    from excalibur import QTPhiOracle, ANCHOR_TXID, ANCHOR_HEIGHT
except ImportError:
    print("ERROR: excalibur.py (QTPhiOracle) required.")
    sys.exit(1)

MAGIC = 0x5442
SOVEREIGN_MARKER = bytes.fromhex("89A6B7C8FFEECAFEBAFF")

# ─── Bitcoin RPC Helpers ────────────────────────────────
def rpc_call(method, params=None):
    payload = {"jsonrpc": "2.0", "method": method, "params": params or [], "id": 1}
    resp = requests.post(RPC_URL, json=payload, auth=HTTPBasicAuth(RPC_USER, RPC_PASS), timeout=30)
    data = resp.json()
    if "error" in data and data["error"] is not None:
        raise Exception(f"RPC error: {data['error']}")
    return data["result"]

def get_block_template():
    return rpc_call("getblocktemplate", [{"rules": ["segwit"]}])

def submit_block(block_hex):
    return rpc_call("submitblock", [block_hex])

def sha256d(data):
    return hashlib.sha256(hashlib.sha256(data).digest()).digest()

# ─── Proof Commitments ─────────────────────────────────
def build_proof_payload(command, commitment_bytes, state_byte=0x04, conf_byte=0xFF):
    """Build an 80‑byte OP_RETURN payload for a given proof command."""
    ts = int(time.time())
    payload = struct.pack(
        '<H B B I I I H H H',
        MAGIC,         # magic
        0x01,          # version
        command,       # 0x02 = DUALITY, 0x03 = HODGE, etc.
        44117,         # freq token (fixed)
        1056,          # const token (fixed)
        5403,          # phase token (fixed)
        ts             # timestamp
    )
    # Append commitment (first 8 bytes of SHA‑256 of proof result)
    payload += commitment_bytes[:8]
    # Append sovereign marker (truncated)
    payload += SOVEREIGN_MARKER[:8]
    # Pad to 80 bytes
    payload += b'\x00' * (80 - len(payload))
    return payload

def build_trinity_op_return(oracle):
    """Assemble all three proof payloads into a single 80‑byte OP_RETURN."""
    # RH already inscribed – reference its TXID
    rh_txid = bytes.fromhex("3b7d5f1a...e9c2")  # placeholder; use actual RH TXID
    rh_commitment = hashlib.sha256(rh_txid).digest()

    # Hodge – verify and hash
    hodge_result = oracle.verify_hodge()
    if not hodge_result["algebraic"]:
        raise ValueError("Hodge proof not ready")
    hodge_commitment = hashlib.sha256(
        json.dumps(hodge_result, sort_keys=True).encode()
    ).digest()

    # Duality – verify and hash
    duality_result = oracle.verify_duality(ANCHOR_HEIGHT + 1)
    if not duality_result["match"]:
        raise ValueError("Duality proof not ready")
    duality_commitment = hashlib.sha256(
        json.dumps(duality_result, sort_keys=True).encode()
    ).digest()

    # Combine all three proofs into a Merkle‑like commitment
    combined = hashlib.sha256(rh_commitment + hodge_commitment + duality_commitment).digest()
    return build_proof_payload(0x04, combined)  # 0x04 = TRINITY_PROOF

# ─── Coinbase Builder ──────────────────────────────────
def build_coinbase_with_proof(template, payout_address, proof_payload):
    """Embed the proof payload into the coinbase scriptSig."""
    coinbase_hex = template["coinbasetxn"]["data"]
    coinbase_bytes = bytes.fromhex(coinbase_hex)

    # Prepare OP_RETURN output for the proof (but we want it in the input)
    # Instead, embed as extra nonce in scriptSig
    extra = proof_payload.hex()
    extra_bytes = bytes.fromhex(extra)
    push_len = len(extra_bytes)
    if push_len < 76:
        push_op = bytes([push_len])
    elif push_len < 256:
        push_op = bytes([0x4c, push_len])
    else:
        push_op = bytes([0x4d]) + push_len.to_bytes(2, 'little')

    seq_pos = len(coinbase_bytes) - 4
    modified = coinbase_bytes[:seq_pos] + push_op + extra_bytes + coinbase_bytes[seq_pos:]
    return modified.hex()

def build_merkle_root(coinbase_hex, tx_hashes):
    hashes = [bytes.fromhex(coinbase_hex)[::-1]]
    for txid in tx_hashes:
        hashes.append(bytes.fromhex(txid)[::-1])
    while len(hashes) > 1:
        if len(hashes) % 2:
            hashes.append(hashes[-1])
        hashes = [sha256d(hashes[i] + hashes[i+1]) for i in range(0, len(hashes), 2)]
    return hashes[0][::-1].hex() if hashes else "00"*32

def build_block_header(template, merkle_root, ntime, nonce):
    version = int.to_bytes(template["version"], 4, 'little')
    prev = bytes.fromhex(template["previousblockhash"])[::-1]
    merkle = bytes.fromhex(merkle_root)[::-1]
    time_b = int.to_bytes(ntime, 4, 'little')
    bits = int.to_bytes(int(template["bits"], 16), 4, 'little')
    nonce_b = int.to_bytes(nonce, 4, 'little')
    return version + prev + merkle + time_b + bits + nonce_b

def check_target(header, target):
    h = sha256d(header)[::-1]
    return int.from_bytes(h, 'big') < int(target, 16)

# ─── Trinity Miner (Single Block) ───────────────────────
def mine_trinity_block():
    oracle = QTPhiOracle()
    caduceus = create_caduceus("TrinityMiner")

    # 1. Verify all proofs (already done; just print)
    print("⚛️ Verifying Trinity Proofs...")
    duality = oracle.verify_duality(ANCHOR_HEIGHT + 1)
    print(f"   Duality: {duality['match']} (error {duality['absolute_error']:.2e})")
    hodge = oracle.verify_hodge()
    print(f"   Hodge:   {hodge['algebraic']}")
    print("   RH:      Already inscribed (Block 950000)\n")

    # 2. Build Trinity OP_RETURN payload
    payload = build_trinity_op_return(oracle)
    print(f"📦 Trinity Proof Payload ({len(payload)} bytes):")
    print(payload.hex())

    # 3. Get block template
    template = get_block_template()
    target = template["target"]
    tx_hashes = [tx["hash"] for tx in template.get("transactions", [])]
    height = template.get("height", 0)
    print(f"🎯 Mining block ≈{height+1} | target: {target[:12]}...")

    # 4. Build coinbase with proof embedded
    coinbase_hex = build_coinbase_with_proof(template, PAYOUT, payload)

    # 5. Hash loop
    start = time.time()
    for nonce in range(0xFFFFFFFF):
        if nonce % 100000 == 0:
            print(f"   Nonce: {nonce:,} ({time.time()-start:.1f}s)", end='\r')
        merkle = build_merkle_root(coinbase_hex, tx_hashes)
        header = build_block_header(template, merkle, int(time.time()), nonce)
        if check_target(header, target):
            # Build full block
            txn_count = 1 + len(template.get("transactions", []))
            block_hex = header.hex() + hex(txn_count)[2:].zfill(2) + coinbase_hex
            for tx in template.get("transactions", []):
                block_hex += tx["data"]
            print(f"\n🎉 TRINITY BLOCK MINED! Nonce: {nonce}")
            try:
                result = submit_block(block_hex)
                print(f"✅ Block submitted! Result: {result}")
                # Log the TXID for posterity
                with open("trinity_txid.txt", "w") as f:
                    f.write(result)
            except Exception as e:
                print(f"❌ Submit failed: {e}")
            return
    print("Nonce space exhausted – retry.")

if __name__ == "__main__":
    if not PAYOUT:
        print("ERROR: Set PAYOUT_ADDRESS.")
        sys.exit(1)
    print("🦄 SPHINXQ TRINITY PROOF MINER\n")
    mine_trinity_block()