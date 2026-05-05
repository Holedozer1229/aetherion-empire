"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Activity, Layers, DollarSign, Clock } from "lucide-react";

interface SolanaStats {
  slot: number | null;
  block_height: number | null;
  epoch: number | null;
  epoch_progress: string | null;
  tps: number | null;
  total_supply: number | null;
  circulating_supply: number | null;
  sol_price_usd: number | null;
}

interface MempoolFallback {
  btc: {
    fees: { fastestFee: number; halfHourFee: number; hourFee: number };
    blockHeight: number | null;
    mempoolSize: number | null;
  };
}

export function SolanaDashboard() {
  const [solanaStats, setSolanaStats] = useState<SolanaStats | null>(null);
  const [mempoolData, setMempoolData] = useState<MempoolFallback | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/solana?action=stats");
        const json = await res.json();
        
        if (json.success) {
          setSolanaStats(json.solana);
          setMempoolData(json.mempool_fallback);
          setLastUpdate(new Date());
        }
      } catch (err) {
        console.error("[solana] Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // Update every 15s
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number | null, decimals = 0): string => {
    if (num === null) return "---";
    return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
  };

  const formatPrice = (price: number | null): string => {
    if (price === null) return "$---";
    return `$${price.toFixed(2)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="neon-border-animate bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-neon-gradient text-xl">
                  Solana Mainnet
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Live blockchain data with mempool.space fallback
                </p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${loading ? "animate-pulse" : ""} border-purple-500/50 text-purple-400`}
            >
              {loading ? "SYNCING" : "LIVE"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Solana Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Layers className="w-4 h-4" />}
              label="Slot"
              value={formatNumber(solanaStats?.slot)}
              color="cyan"
            />
            <StatCard
              icon={<Activity className="w-4 h-4" />}
              label="TPS"
              value={formatNumber(solanaStats?.tps)}
              color="green"
            />
            <StatCard
              icon={<DollarSign className="w-4 h-4" />}
              label="SOL Price"
              value={formatPrice(solanaStats?.sol_price_usd)}
              color="purple"
            />
            <StatCard
              icon={<TrendingUp className="w-4 h-4" />}
              label="Epoch"
              value={`${solanaStats?.epoch ?? "---"}`}
              subValue={solanaStats?.epoch_progress}
              color="pink"
            />
          </div>

          {/* Supply Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Total Supply</p>
              <p className="text-lg font-mono text-foreground">
                {formatNumber(solanaStats?.total_supply)} SOL
              </p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Circulating</p>
              <p className="text-lg font-mono text-foreground">
                {formatNumber(solanaStats?.circulating_supply)} SOL
              </p>
            </div>
          </div>

          {/* Mempool Fallback Section */}
          <div className="border-t border-border/50 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm font-medium text-orange-400">
                Bitcoin Mempool Fallback
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-xs text-muted-foreground">Fast Fee</p>
                <p className="text-sm font-mono text-orange-400">
                  {mempoolData?.btc.fees.fastestFee ?? "---"} sat/vB
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-xs text-muted-foreground">BTC Block</p>
                <p className="text-sm font-mono text-orange-400">
                  {formatNumber(mempoolData?.btc.blockHeight)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-xs text-muted-foreground">Mempool</p>
                <p className="text-sm font-mono text-orange-400">
                  {formatNumber(mempoolData?.btc.mempoolSize)} txs
                </p>
              </div>
            </div>
          </div>

          {/* Last Update */}
          {lastUpdate && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string | null;
  color: "cyan" | "green" | "purple" | "pink";
}) {
  const colorClasses = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  };

  return (
    <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={colorClasses[color].split(" ")[0]}>{icon}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`text-lg font-mono font-bold ${colorClasses[color].split(" ")[0]}`}>
        {value}
      </p>
      {subValue && (
        <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
      )}
    </div>
  );
}
