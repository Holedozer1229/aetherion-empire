"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Hash, Cpu } from "lucide-react";

interface BitcoinStats {
  blockHeight: number;
  feeRateFast: number;
  feeRateMed: number;
  difficulty: number;
  mempoolTxCount: number;
}

export function LiveStats() {
  const [stats, setStats] = useState<BitcoinStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/bitcoin");
        const json = await res.json();
        if (mounted && json.success) {
          setStats({
            blockHeight: json.block_height ?? 0,
            feeRateFast: json.fee_rates?.fast ?? 0,
            feeRateMed: json.fee_rates?.medium ?? 0,
            difficulty: json.network_difficulty ?? 0,
            mempoolTxCount: json.mempool_count ?? 0,
          });
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const liveStats = [
    {
      label: "Block Height",
      value: stats ? stats.blockHeight.toLocaleString() : "---",
      icon: Hash,
      sub: "Bitcoin Mainnet",
    },
    {
      label: "Fast Fee Rate",
      value: stats ? `${stats.feeRateFast} sat/vB` : "---",
      icon: Activity,
      sub: "~10 min confirm",
    },
    {
      label: "Mempool Txns",
      value: stats ? stats.mempoolTxCount.toLocaleString() : "---",
      icon: Cpu,
      sub: "Pending",
    },
    {
      label: "Network Difficulty",
      value: stats ? (stats.difficulty / 1e12).toFixed(2) + " T" : "---",
      icon: TrendingUp,
      sub: "Proof-of-Work",
    },
  ];

  return (
    <section className="py-8 border-b border-primary/20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-sm text-muted-foreground">
            Live Bitcoin Mainnet Stats
          </span>
          {loading && (
            <span className="text-xs text-muted-foreground">(loading...)</span>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {liveStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl border border-primary/10"
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                <p className="text-lg font-bold text-foreground font-mono">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
