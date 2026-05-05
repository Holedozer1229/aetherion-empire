"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Zap, Code2, CheckCircle } from "lucide-react";

export function GenesisAttestation() {
  const [attestation, setAttestation] = useState<any>(null);
  const [camelot, setCamelot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttestations = async () => {
      try {
        const [attRes, camelotRes] = await Promise.all([
          fetch("/api/genesis?action=verify"),
          fetch("/api/genesis?action=camelot"),
        ]);
        const attData = await attRes.json();
        const camelotData = await camelotRes.json();
        setAttestation(attData.attestation);
        setCamelot(camelotData.camelot);
      } catch (err) {
        console.error("[v0] Genesis fetch failed:", err);
      }
      setLoading(false);
    };
    fetchAttestations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-cyan text-2xl font-bold animate-pulse">
          GENESIS ATTESTATION LOADING...
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen relative overflow-hidden cyber-bg">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(0, 255, 136, 0.1) 25%, rgba(0, 255, 136, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 255, 136, 0.1) 75%, rgba(0, 255, 136, 0.1) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(0, 255, 136, 0.1) 25%, rgba(0, 255, 136, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 255, 136, 0.1) 75%, rgba(0, 255, 136, 0.1) 76%, transparent 77%, transparent)
            `,
            backgroundSize: "50px 50px",
            animation: "scan-lines 8s linear infinite",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="w-8 h-8 text-neon-pink animate-pulse" />
            <h1 className="text-5xl font-bold text-neon-cyan glyph-effect">
              GENESIS ATTESTATION
            </h1>
            <Lock className="w-8 h-8 text-neon-pink animate-pulse" />
          </div>
          <p className="text-neon-purple text-lg font-mono">
            BIP-420 | BIP-322 | SOVEREIGN SCALAR
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* BIP-322 Signature Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="cyber-panel cyber-border-glow-cyan p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-neon-cyan" />
              <h2 className="text-2xl font-bold text-neon-cyan glyph-effect">
                BIP-322 SIGNATURE
              </h2>
            </div>

            <div className="space-y-3 font-mono text-sm">
              <div>
                <p className="text-neon-purple text-xs uppercase">Message Hash</p>
                <p className="text-neon-pink break-all text-xs">
                  {attestation?.bip322_signature}
                </p>
              </div>

              <div>
                <p className="text-neon-purple text-xs uppercase">Genesis Public Key</p>
                <p className="text-neon-cyan break-all text-xs">
                  {attestation?.genesis_pubkey?.slice(0, 40)}...
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <CheckCircle className="w-4 h-4 text-neon-cyan" />
                <span className="text-neon-cyan font-bold">
                  {attestation?.genesis_verified ? "VERIFIED" : "INVALID"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Camelot Sovereign Scalar Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="cyber-panel cyber-border-glow-pink p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-neon-pink" />
              <h2 className="text-2xl font-bold text-neon-pink glyph-effect">
                CAMELOT SCALAR
              </h2>
            </div>

            <div className="space-y-3 font-mono text-sm">
              <div>
                <p className="text-neon-purple text-xs uppercase">Scalar Value</p>
                <p className="text-neon-pink text-lg font-bold">
                  {camelot?.scalar?.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-neon-purple text-xs uppercase">Hex Representation</p>
                <p className="text-neon-cyan break-all text-xs">
                  {camelot?.scalar_hex}
                </p>
              </div>

              <div>
                <p className="text-neon-purple text-xs uppercase">Shift (Left 127)</p>
                <p className="text-neon-pink break-all text-xs">
                  {camelot?.shift_left_127?.slice(0, 40)}...
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Zap className="w-4 h-4 text-neon-pink animate-pulse" />
                <span className="text-neon-pink font-bold">AMPLIFIER ACTIVE</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Genesis Constants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cyber-panel cyber-border-glow-purple p-8"
        >
          <h3 className="text-2xl font-bold text-neon-purple glyph-effect mb-6">
            CANONICAL SECP256K1 CONSTANTS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-neon-cyan/30 p-4 rounded">
              <p className="text-neon-purple text-xs uppercase font-bold mb-2">Genesis Key</p>
              <p className="text-neon-cyan text-2xl font-bold font-mono">0x1</p>
              <p className="text-neon-purple text-xs mt-2">Discrete logarithm of G</p>
            </div>

            <div className="border border-neon-pink/30 p-4 rounded">
              <p className="text-neon-purple text-xs uppercase font-bold mb-2">Camelot Scalar</p>
              <p className="text-neon-pink text-2xl font-bold font-mono">0x829D5E5A4B1E2D</p>
              <p className="text-neon-purple text-xs mt-2">56-bit amplifier</p>
            </div>

            <div className="border border-neon-cyan/30 p-4 rounded">
              <p className="text-neon-purple text-xs uppercase font-bold mb-2">Mainnet Status</p>
              <p className="text-neon-cyan text-2xl font-bold">ACTIVE</p>
              <p className="text-neon-purple text-xs mt-2">Bitcoin mainnet sealed</p>
            </div>
          </div>
        </motion.div>

        {/* Status Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-neon-cyan font-mono text-sm"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
            <span>AETHERION GENESIS DECLARED</span>
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
