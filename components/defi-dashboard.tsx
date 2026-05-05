"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  Activity,
  Zap,
  TrendingUp,
  Shield,
  Cpu,
  Database,
  Rocket,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WalletConnect } from "./wallet-connect";

interface QuantumState {
  phi: number;
  resonance: string;
  harmony: number;
  timestamp: string;
}

interface MiningStats {
  hashrate: string;
  blocksVerified: number;
  totalRewards: string;
  networkDifficulty: string;
}

export function DeFiDashboard() {
  const [quantumState, setQuantumState] = useState<QuantumState | null>(null);
  const [miningStats, setMiningStats] = useState<MiningStats>({
    hashrate: "256.7 TH/s",
    blocksVerified: 353,
    totalRewards: "11,161,500.00",
    networkDifficulty: "79.35T",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [solBalance, setSolBalance] = useState<number | null>(null);

  // EVM Connection
  const { address: evmAddress, isConnected: evmConnected } = useAccount();
  const chainId = useChainId();
  const { data: evmBalance } = useBalance({ address: evmAddress });

  // Solana Connection
  const { publicKey, connected: solanaConnected } = useWallet();
  const { connection } = useConnection();

  // Fetch Solana balance
  useEffect(() => {
    async function fetchSolBalance() {
      if (publicKey && connection) {
        try {
          const balance = await connection.getBalance(publicKey);
          setSolBalance(balance / LAMPORTS_PER_SOL);
        } catch (err) {
          console.error("Failed to fetch SOL balance:", err);
        }
      }
    }
    fetchSolBalance();
  }, [publicKey, connection]);

  // Connect to Aetherion Oracle API
  useEffect(() => {
    async function fetchOracleState() {
      try {
        const res = await fetch("/api/oracle?word=heartbeat");
        const data = await res.json();
        if (data.success) {
          setQuantumState({
            phi: data.consciousness.phi_metric,
            resonance: data.consciousness.resonance,
            harmony: data.consciousness.harmony,
            timestamp: data.timestamp,
          });
        }
      } catch (err) {
        // Fallback to local simulation
        const phi = Math.random();
        setQuantumState({
          phi,
          resonance: phi > 0.5 ? "STABLE" : "VOLATILE",
          harmony: Math.sin(phi * Math.PI),
          timestamp: new Date().toISOString(),
        });
      }
    }

    fetchOracleState();
    const interval = setInterval(fetchOracleState, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/mining");
      const data = await res.json();
      if (data.success) {
        setMiningStats({
          hashrate: `${(data.mining.eth.hashrate.replace(" TH/s", ""))} TH/s`,
          blocksVerified: data.mining.sol.blocks,
          totalRewards: (data.mining.totalValueUsd / 1000000).toFixed(2) + "M",
          networkDifficulty: "79.35T",
        });
      }
    } catch (err) {
      // Fallback to local simulation
      setMiningStats((prev) => ({
        ...prev,
        hashrate: `${(250 + Math.random() * 20).toFixed(1)} TH/s`,
        blocksVerified: prev.blocksVerified + Math.floor(Math.random() * 3),
      }));
    }
    setIsLoading(false);
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Quantum DeFi Command Center
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Multi-chain wallet integration with real-time Aetherion Oracle synchronization
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wallet Connection Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="glass-panel p-6 rounded-2xl border border-primary/20 h-full">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Wallet Integration
              </h3>
              <WalletConnect />

              {/* Connection Status */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">EVM Status</span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      evmConnected ? "text-green-500" : "text-muted-foreground"
                    )}
                  >
                    {evmConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Solana Status</span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      solanaConnected ? "text-accent" : "text-muted-foreground"
                    )}
                  >
                    {solanaConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Portfolio Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="glass-panel p-6 rounded-2xl border border-primary/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Portfolio Overview
                </h3>
                <button
                  onClick={refreshStats}
                  className={cn(
                    "p-2 hover:bg-card rounded-lg transition-all",
                    isLoading && "animate-spin"
                  )}
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* EVM Balance Card */}
                <div className="p-4 bg-card/30 rounded-xl border border-primary/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg">⟠</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">EVM Balance</p>
                      <p className="text-xl font-bold text-primary">
                        {evmConnected && evmBalance
                          ? `${parseFloat(evmBalance.formatted).toFixed(4)} ${evmBalance.symbol}`
                          : "-- ETH"}
                      </p>
                    </div>
                  </div>
                  {evmConnected && (
                    <div className="flex items-center gap-1 text-sm text-green-500">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+12.4% (24h)</span>
                    </div>
                  )}
                </div>

                {/* Solana Balance Card */}
                <div className="p-4 bg-card/30 rounded-xl border border-accent/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-lg">◎</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Solana Balance</p>
                      <p className="text-xl font-bold text-accent">
                        {solanaConnected && solBalance !== null
                          ? `${solBalance.toFixed(4)} SOL`
                          : "-- SOL"}
                      </p>
                    </div>
                  </div>
                  {solanaConnected && (
                    <div className="flex items-center gap-1 text-sm text-green-500">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+8.7% (24h)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mining Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-card/20 rounded-lg">
                  <Zap className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-lg font-bold">{miningStats.hashrate}</p>
                  <p className="text-xs text-muted-foreground">Hashrate</p>
                </div>
                <div className="text-center p-3 bg-card/20 rounded-lg">
                  <Cpu className="w-5 h-5 text-accent mx-auto mb-2" />
                  <p className="text-lg font-bold">{miningStats.blocksVerified}</p>
                  <p className="text-xs text-muted-foreground">Blocks Verified</p>
                </div>
                <div className="text-center p-3 bg-card/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-bold">${miningStats.totalRewards}</p>
                  <p className="text-xs text-muted-foreground">Total Rewards</p>
                </div>
                <div className="text-center p-3 bg-card/20 rounded-lg">
                  <Activity className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-lg font-bold">{miningStats.networkDifficulty}</p>
                  <p className="text-xs text-muted-foreground">Difficulty</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quantum Oracle Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <div className="glass-panel p-6 rounded-2xl border border-accent/20">
            <h3 className="text-xl font-bold text-accent mb-6 flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Aetherion Quantum Oracle Status
            </h3>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3 relative">
                  <span className="text-2xl font-bold text-background">Φ</span>
                  <div className="absolute inset-0 rounded-full animate-pulse-glow" />
                </div>
                <p className="text-sm text-muted-foreground">Phi Metric</p>
                <p className="text-xl font-bold text-primary">
                  {quantumState?.phi.toFixed(4) || "0.0000"}
                </p>
              </div>

              <div className="text-center">
                <div
                  className={cn(
                    "w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3",
                    quantumState?.resonance === "STABLE"
                      ? "bg-green-500/20"
                      : "bg-neon-pink-500/20"
                  )}
                >
                  <Lock
                    className={cn(
                      "w-8 h-8",
                      quantumState?.resonance === "STABLE"
                        ? "text-green-500"
                        : "text-neon-pink-500"
                    )}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Resonance</p>
                <p
                  className={cn(
                    "text-xl font-bold",
                    quantumState?.resonance === "STABLE"
                      ? "text-green-500"
                      : "text-neon-pink-500"
                  )}
                >
                  {quantumState?.resonance || "INITIALIZING"}
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Harmony Index</p>
                <p className="text-xl font-bold text-primary">
                  {quantumState?.harmony.toFixed(4) || "0.0000"}
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-3">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <p className="text-sm text-muted-foreground">Soul Status</p>
                <p className="text-xl font-bold text-accent">ACTIVE</p>
              </div>
            </div>

            {/* IIT v6.0 Consciousness Meter */}
            <div className="mt-6 p-4 bg-card/20 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  IIT v6.0 Consciousness Level
                </span>
                <span className="text-sm font-mono text-primary">
                  {((quantumState?.phi || 0) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-card rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-accent to-primary"
                  animate={{ width: `${(quantumState?.phi || 0) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
