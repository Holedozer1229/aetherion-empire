"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bitcoin,
  Wallet,
  ArrowUpRight,
  RefreshCw,
  Zap,
  Shield,
  Activity,
  TrendingUp,
} from "lucide-react";

interface UTXO {
  txid: string;
  vout: number;
  value: number;
  status: {
    confirmed: boolean;
    block_height?: number;
  };
}

interface BitcoinData {
  address: string;
  utxos: {
    count: number;
    total_sats: number;
    total_btc: string;
    spendable: UTXO[];
  };
  fees: {
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
  };
  block_height: number;
}

export function BitcoinDashboard() {
  const [data, setData] = useState<BitcoinData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchBitcoinData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bitcoin");
      const json = await res.json();
      if (json.success && json.bitcoin) {
        setData(json.bitcoin);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("[v0] Bitcoin data fetch failed:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBitcoinData();
    const interval = setInterval(fetchBitcoinData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bitcoin className="w-10 h-10 text-[hsl(var(--neon-pink))]" />
            <h2 className="text-4xl font-bold text-neon-gradient">
              Bitcoin Mainnet
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Live UTXO scanning and fee estimation on Bitcoin mainnet
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-xl p-6 neon-glow-pink"
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-6 h-6 text-[hsl(var(--neon-pink))]" />
              <span className="text-xs text-muted-foreground">LIVE</span>
            </div>
            <div className="text-3xl font-mono font-bold text-[hsl(var(--neon-pink))]">
              {data?.block_height?.toLocaleString() || "---"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Block Height</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-xl p-6 neon-glow"
          >
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-6 h-6 text-[hsl(var(--neon-cyan))]" />
              <span className="text-xs text-[hsl(var(--neon-green))]">FAST</span>
            </div>
            <div className="text-3xl font-mono font-bold text-[hsl(var(--neon-cyan))]">
              {data?.fees?.fastestFee || "---"}
              <span className="text-lg ml-1">sat/vB</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">Priority Fee</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-xl p-6 neon-glow-purple"
          >
            <div className="flex items-center justify-between mb-4">
              <Wallet className="w-6 h-6 text-[hsl(var(--neon-purple))]" />
              <span className="text-xs text-muted-foreground">UTXOs</span>
            </div>
            <div className="text-3xl font-mono font-bold text-[hsl(var(--neon-purple))]">
              {data?.utxos?.count || 0}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Spendable Outputs</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-xl p-6 neon-glow"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-6 h-6 text-[hsl(var(--neon-cyan))]" />
              <span className="text-xs text-[hsl(var(--neon-green))]">BTC</span>
            </div>
            <div className="text-3xl font-mono font-bold text-[hsl(var(--neon-cyan))]">
              {data?.utxos?.total_btc || "0.00000000"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Total Balance</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-xl p-6 neon-glow"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-[hsl(var(--neon-cyan))]" />
              <h3 className="text-xl font-bold">Genesis Address Monitor</h3>
            </div>
            <button
              onClick={fetchBitcoinData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--neon-cyan))] text-background rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mb-6 font-mono text-sm break-all border border-[hsl(var(--neon-cyan)/0.3)]">
            <span className="text-muted-foreground">Address: </span>
            <span className="text-[hsl(var(--neon-cyan))]">{data?.address || "Loading..."}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/30 rounded-lg p-4 border border-[hsl(var(--neon-pink)/0.2)]">
              <div className="text-sm text-muted-foreground mb-1">Fastest Fee</div>
              <div className="text-xl font-mono text-[hsl(var(--neon-pink))]">
                {data?.fees?.fastestFee || 0} sat/vB
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 border border-[hsl(var(--neon-purple)/0.2)]">
              <div className="text-sm text-muted-foreground mb-1">30min Fee</div>
              <div className="text-xl font-mono text-[hsl(var(--neon-purple))]">
                {data?.fees?.halfHourFee || 0} sat/vB
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 border border-[hsl(var(--neon-cyan)/0.2)]">
              <div className="text-sm text-muted-foreground mb-1">1hr Fee</div>
              <div className="text-xl font-mono text-[hsl(var(--neon-cyan))]">
                {data?.fees?.hourFee || 0} sat/vB
              </div>
            </div>
          </div>

          {data?.utxos?.spendable && data.utxos.spendable.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-[hsl(var(--neon-green))]" />
                Spendable UTXOs
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.utxos.spendable.slice(0, 5).map((utxo, i) => (
                  <div
                    key={`${utxo.txid}-${utxo.vout}`}
                    className="bg-muted/20 rounded-lg p-3 font-mono text-xs border border-[hsl(var(--neon-cyan)/0.1)] hover:border-[hsl(var(--neon-cyan)/0.3)] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground truncate max-w-[60%]">
                        {utxo.txid.slice(0, 16)}...:{utxo.vout}
                      </span>
                      <span className="text-[hsl(var(--neon-green))] font-semibold">
                        {(utxo.value / 100000000).toFixed(8)} BTC
                      </span>
                    </div>
                    <div className="text-muted-foreground mt-1">
                      {utxo.status.confirmed ? (
                        <span className="text-[hsl(var(--neon-green))]">
                          Confirmed @ {utxo.status.block_height}
                        </span>
                      ) : (
                        <span className="text-[hsl(var(--neon-pink))]">Unconfirmed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[hsl(var(--neon-cyan)/0.2)] flex items-center justify-between text-sm text-muted-foreground">
            <span>Network: MAINNET</span>
            <span>Last Update: {lastUpdate || "---"}</span>
            <span>API: mempool.space</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
