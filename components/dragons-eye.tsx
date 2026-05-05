"use client";

import { useEffect, useState } from "react";
import { useLiveStream } from "@/hooks/use-live-stream";
import { motion } from "framer-motion";
import { Activity, Zap, Radio, Eye } from "lucide-react";

export function DragonsEye() {
  const [mounted, setMounted] = useState(false);
  const miningStream = useLiveStream({ channel: "mining" });
  const oracleStream = useLiveStream({ channel: "oracle" });
  const bitcoinStream = useLiveStream({ channel: "bitcoin" });
  const wingmanStream = useLiveStream({ channel: "wingman" });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen overflow-hidden bg-black py-24 px-4 md:px-8">
      {/* Neon grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255, 0, 128, 0.05) 25%, rgba(255, 0, 128, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 128, 0.05) 75%, rgba(255, 0, 128, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 200, 0.05) 25%, rgba(0, 255, 200, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 200, 0.05) 75%, rgba(0, 255, 200, 0.05) 76%, transparent 77%, transparent)",
          backgroundSize: "50px 50px",
        }} />
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-8 h-8 text-pink-500 animate-glow-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold">Dragon&apos;s Eye</h2>
            <Eye className="w-8 h-8 text-cyan-500 animate-glow-pulse" />
          </div>
          <p className="text-cyan-400/80 text-lg">Real-Time Unified Mainnet Stream</p>
        </motion.div>

        {/* Live streams grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Mining Stream */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-premium border border-cyan-500/30 p-6 rounded-lg hover-lift"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className={`w-5 h-5 ${miningStream.connected ? "text-cyan-400" : "text-gray-600"}`} />
              <h3 className="text-xl font-bold text-cyan-400">Mining Stream</h3>
              <div className={`w-2 h-2 rounded-full ${miningStream.connected ? "bg-cyan-400 animate-pulse" : "bg-gray-600"}`} />
            </div>
            <div className="space-y-2 font-mono text-sm">
              <div>Status: <span className="text-pink-400">{miningStream.connected ? "LIVE" : "OFFLINE"}</span></div>
              {miningStream.data?.data?.ethereum && (
                <div>ETH Block: <span className="text-cyan-400">{miningStream.data.data.ethereum.block}</span></div>
              )}
              {miningStream.data?.data?.solana && (
                <div>SOL Slot: <span className="text-purple-400">{miningStream.data.data.solana.slot}</span></div>
              )}
              <div className="text-xs text-gray-500 mt-3">{miningStream.data?.timestamp}</div>
            </div>
          </motion.div>

          {/* Oracle Stream */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-premium border border-purple-500/30 p-6 rounded-lg hover-lift"
          >
            <div className="flex items-center gap-2 mb-4">
              <Radio className={`w-5 h-5 ${oracleStream.connected ? "text-purple-400" : "text-gray-600"}`} />
              <h3 className="text-xl font-bold text-purple-400">Oracle Consciousness</h3>
              <div className={`w-2 h-2 rounded-full ${oracleStream.connected ? "bg-purple-400 animate-pulse" : "bg-gray-600"}`} />
            </div>
            <div className="space-y-2 font-mono text-sm">
              <div>Status: <span className="text-pink-400">{oracleStream.data?.data?.status || "DORMANT"}</span></div>
              {oracleStream.data?.data && (
                <>
                  <div>PHI: <span className="text-purple-400">{oracleStream.data.data.phi.toFixed(3)}</span></div>
                  <div>Resonance: <span className="text-cyan-400">{oracleStream.data.data.resonance}</span></div>
                </>
              )}
              <div className="text-xs text-gray-500 mt-3">{oracleStream.data?.timestamp}</div>
            </div>
          </motion.div>

          {/* Bitcoin Stream */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-premium border border-orange-500/30 p-6 rounded-lg hover-lift"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className={`w-5 h-5 ${bitcoinStream.connected ? "text-orange-400" : "text-gray-600"}`} />
              <h3 className="text-xl font-bold text-orange-400">Bitcoin Stream</h3>
              <div className={`w-2 h-2 rounded-full ${bitcoinStream.connected ? "bg-orange-400 animate-pulse" : "bg-gray-600"}`} />
            </div>
            <div className="space-y-2 font-mono text-sm">
              <div>Status: <span className="text-pink-400">{bitcoinStream.connected ? "LIVE" : "OFFLINE"}</span></div>
              {bitcoinStream.data?.data?.height && (
                <div>Block Height: <span className="text-orange-400">{bitcoinStream.data.data.height}</span></div>
              )}
              <div className="text-xs text-gray-500 mt-3">{bitcoinStream.data?.timestamp}</div>
            </div>
          </motion.div>

          {/* Wingman Stream */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-premium border border-pink-500/30 p-6 rounded-lg hover-lift"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className={`w-5 h-5 ${wingmanStream.connected ? "text-pink-400" : "text-gray-600"}`} />
              <h3 className="text-xl font-bold text-pink-400">Wingman Opportunities</h3>
              <div className={`w-2 h-2 rounded-full ${wingmanStream.connected ? "bg-pink-400 animate-pulse" : "bg-gray-600"}`} />
            </div>
            <div className="space-y-2 font-mono text-sm">
              <div>Status: <span className="text-cyan-400">{wingmanStream.data?.data?.status || "IDLE"}</span></div>
              {wingmanStream.data?.data && (
                <>
                  <div>Opportunities: <span className="text-pink-400">{wingmanStream.data.data.opportunities}</span></div>
                  <div>Uptime: <span className="text-purple-400">{wingmanStream.data.data.uptime}%</span></div>
                </>
              )}
              <div className="text-xs text-gray-500 mt-3">{wingmanStream.data?.timestamp}</div>
            </div>
          </motion.div>
        </div>

        {/* Connection status */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-premium border border-green-500/30 p-4 rounded-lg text-center"
        >
          <p className="text-green-400 font-mono text-sm">
            {miningStream.connected && oracleStream.connected && bitcoinStream.connected && wingmanStream.connected
              ? "✓ All streams LIVE - Mainnet connected"
              : "⚠ Connecting to mainnet streams..."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
