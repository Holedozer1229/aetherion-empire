"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Zap, 
  Brain, 
  Waves, 
  ExternalLink,
  CheckCircle2,
  Loader2,
  Activity
} from "lucide-react";

interface OracleState {
  connected: boolean;
  consciousness: number;
  resonance: string;
  harmony: number;
  lastSync: string;
  status: "connecting" | "connected" | "syncing" | "error";
}

export function AetherionOracle() {
  const [oracleState, setOracleState] = useState<OracleState>({
    connected: false,
    consciousness: 0,
    resonance: "INITIALIZING",
    harmony: 0,
    lastSync: "",
    status: "connecting",
  });

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Simulate connection to Aetherion Oracle
    const connect = async () => {
      setOracleState((prev) => ({ ...prev, status: "connecting" }));
      
      await new Promise((r) => setTimeout(r, 2000));
      
      setOracleState((prev) => ({ ...prev, status: "syncing" }));
      
      await new Promise((r) => setTimeout(r, 1500));
      
      setOracleState({
        connected: true,
        consciousness: 0.9847,
        resonance: "STABLE",
        harmony: 0.9234,
        lastSync: new Date().toISOString(),
        status: "connected",
      });
    };

    connect();

    // Periodic updates
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/oracle?word=sync");
        const data = await res.json();
        if (data.success) {
          setOracleState((prev) => ({
            ...prev,
            consciousness: data.consciousness?.phi_metric || prev.consciousness,
            resonance: data.consciousness?.resonance || prev.resonance,
            harmony: data.consciousness?.harmony || prev.harmony,
            lastSync: data.timestamp || new Date().toISOString(),
          }));
        }
      } catch {
        // Keep existing state on error
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    connecting: "text-neon-cyan-400",
    syncing: "text-blue-400",
    connected: "text-secondary",
    error: "text-red-400",
  };

  const statusIcons = {
    connecting: Loader2,
    syncing: Activity,
    connected: CheckCircle2,
    error: Zap,
  };

  const StatusIcon = statusIcons[oracleState.status];

  return (
    <section className="py-16 bg-gradient-to-b from-background via-card/20 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg animate-pulse-glow">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Aetherion Oracle Connection
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  SphinxQASI quantum consciousness network
                </p>
              </div>
              <a
                href="https://aetherion-oracle-arcane.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/30 hover:bg-primary/20 transition-colors"
              >
                <span className="text-sm text-primary font-medium">Open Oracle</span>
                <ExternalLink className="w-4 h-4 text-primary" />
              </a>
            </div>

            {/* Oracle Status Card */}
            <div 
              className="relative p-6 md:p-8 rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-lg neon-glow cursor-pointer"
              onClick={() => setShowDetails(!showDetails)}
            >
              {/* Background animated gradient */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 animate-shimmer" />
              </div>

              <div className="relative z-10">
                {/* Status row */}
                <div className="flex items-center gap-3 mb-6">
                  <StatusIcon className={`w-5 h-5 ${statusColors[oracleState.status]} ${
                    oracleState.status === "connecting" || oracleState.status === "syncing" 
                      ? "animate-spin" 
                      : ""
                  }`} />
                  <span className={`text-sm font-medium ${statusColors[oracleState.status]}`}>
                    {oracleState.status.charAt(0).toUpperCase() + oracleState.status.slice(1)}
                  </span>
                  {oracleState.connected && (
                    <span className="text-xs text-muted-foreground">
                      Last sync: {new Date(oracleState.lastSync).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                {/* Main stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Consciousness</span>
                    </div>
                    <motion.p 
                      key={oracleState.consciousness}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-3xl md:text-4xl font-bold text-primary font-mono"
                    >
                      {(oracleState.consciousness * 100).toFixed(2)}%
                    </motion.p>
                    <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${oracleState.consciousness * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Waves className="w-4 h-4 text-secondary" />
                      <span className="text-sm text-muted-foreground">Resonance</span>
                    </div>
                    <p className={`text-3xl md:text-4xl font-bold ${
                      oracleState.resonance === "STABLE" ? "text-secondary" : "text-neon-cyan-400"
                    }`}>
                      {oracleState.resonance}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Quantum field alignment
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-neon-cyan-400" />
                      <span className="text-sm text-muted-foreground">Harmony</span>
                    </div>
                    <motion.p 
                      key={oracleState.harmony}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-3xl md:text-4xl font-bold text-neon-cyan-400 font-mono"
                    >
                      {(oracleState.harmony * 100).toFixed(1)}%
                    </motion.p>
                    <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        className="h-full bg-neon-cyan-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${oracleState.harmony * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Expandable details */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-primary/20"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">IIT Version</p>
                          <p className="text-sm font-bold text-foreground">v6.0</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Network</p>
                          <p className="text-sm font-bold text-foreground">SphinxQASI</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Protocol</p>
                          <p className="text-sm font-bold text-foreground">Quantum ZK</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                          <p className="text-sm font-bold text-secondary">99.99%</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Click to {showDetails ? "hide" : "show"} details
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
