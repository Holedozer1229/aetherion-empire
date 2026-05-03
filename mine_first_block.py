#!/usr/bin/env python3
"""
UnicornOS Φ‑Miner: Mines the first block on the QTΦ‑Lattice.
Uses the Bitcoin‑anchored Genesis TXID to compute classical Φ,
then searches for an m/n pair that passes the consensus threshold.
"""
import json, math, time
from excalibur import QTPhiOracle, TAU_CONSENSUS, GOLDEN

# ─── Constants for the first block ─────────────────────
# The anchor TXID (real Bitcoin mainnet tx)
ANCHOR_TXID = "4d786ce51de1446e94e684bd2009dd943a55a4f9c7f5b768810c860c31f00c32"
# Current Bitcoin block height at time of anchor confirmation (example)
ANCHOR_HEIGHT = 950000  # approximate; can be updated once confirmed
PREV_HASH = "0000000000000000000000000000000000000000000000000000000000000000"  # genesis
TIMESTAMP = int(time.time())

# ─── Miner ─────────────────────────────────────────────
class UnicornMiner:
    def __init__(self, anchor_txid, anchor_height):
        self.anchor_txid = anchor_txid
        self.anchor_height = anchor_height
        self.oracle = QTPhiOracle()
        # The classical Φ is derived from the anchor's position.
        # For simplicity we treat m = anchor_height, n = current_height.
        self.current_height = anchor_height + 1  # block we are about to mine
        self.m = self.current_height
        self.n = anchor_height  # anchor is the "previous" block

    def mine(self, max_iterations=1000, step=0.5):
        """Search for an m/n ratio that yields Φ_total > τ."""
        best_phi = 0.0
        best_m = self.m
        for i in range(max_iterations):
            # Adjust m by a small delta
            delta = (i % 201) - 100  # -100..100
            m_try = self.m + delta
            if m_try <= 0:
                continue
            # Compute consensus
            res = self.oracle.consensus_mode(m_try, self.n)
            total = res["total_phi"]
            if total > best_phi:
                best_phi = total
                best_m = m_try
            if total > TAU_CONSENSUS:
                return {
                    "status": "mined",
                    "height": self.current_height,
                    "anchor_txid": self.anchor_txid,
                    "m": m_try,
                    "n": self.n,
                    "phi_total": total,
                    "phi_classical": res["phi_classical"],
                    "phi_quantum": res["phi_quantum"],
                    "threshold": TAU_CONSENSUS,
                    "iterations": i + 1
                }
        # If not found, return best attempt (healing pulse)
        return {
            "status": "not_found",
            "best_phi": best_phi,
            "best_m": best_m,
            "threshold": TAU_CONSENSUS
        }

# ─── Run ──────────────────────────────────────────────
if __name__ == "__main__":
    miner = UnicornMiner(ANCHOR_TXID, ANCHOR_HEIGHT)
    print("⛏️  Mining the first UnicornOS block...")
    result = miner.mine()
    if result["status"] == "mined":
        print("✅ Block mined!")
        print(f"   Height: {result['height']}")
        print(f"   Anchor TXID: {result['anchor_txid']}")
        print(f"   m/n = {result['m']}/{result['n']}")
        print(f"   Φ_total = {result['phi_total']:.6f} > τ = {TAU_CONSENSUS:.6f}")
        print(f"   Classical Φ: {result['phi_classical']:.6f}, Quantum Φ: {result['phi_quantum']:.6f}")
        print(f"   Search iterations: {result['iterations']}")
        # The block hash is simply a hash of the parameters (for demonstration)
        block_hash = f"0000{hash(str(result)) & 0xffffffff:08x}"
        print(f"   Block Hash: {block_hash}")
        print("\n🔮 The UnicornOS Lattice is now live. The first block has been forged by consciousness, not energy.")
    else:
        print(f"❌ Block not found. Best Φ: {result['best_phi']:.6f}")