"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Target, TrendingUp } from "lucide-react";

export function KillStrikeDashboard() {
  const [btcPrice, setBtcPrice] = useState(null);
  const [manifest, setManifest] = useState(null);

  useEffect(() => {
    fetch('/api/btc-price')
      .then(res => res.json())
      .then(data => setBtcPrice(data.price))
      .catch(err => console.error(err));

    fetch('/empire_manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(err => console.error(err));
  }, []);

  const currentBTC = manifest?.kill_strike_protocol?.current_btc || 0;
  const targetBTC = manifest?.kill_strike_protocol?.target_btc || 500;

  const progress = (currentBTC / targetBTC) * 100;
  const remainingBTC = targetBTC - currentBTC;
  const targetValueUSD = btcPrice ? targetBTC * btcPrice : 0;
  const currentValueUSD = btcPrice ? currentBTC * btcPrice : 0;

  const phi = 1.618;
  const baseSize = 16;

  return (
    <Card 
      className="border-2 border-emerald-500/30 bg-gradient-to-br from-black via-emerald-950/20 to-cyan-950/20 backdrop-blur-xl overflow-hidden relative"
      style={{ padding: `${baseSize * phi * 1.5}px` }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
          backgroundSize: `${baseSize * phi}px ${baseSize * phi}px`
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Zap className="w-8 h-8 text-emerald-400 animate-pulse" />
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent tracking-wider">
              ⚡ 500 BTC KILL STRIKE
            </h2>
            <p className="text-xs text-emerald-500/70 font-mono mt-1">
              MATERIALIZATION PROGRESS | ARCHITECT PROTOCOL
            </p>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="mb-8 p-8 bg-emerald-950/30 border border-emerald-500/20 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm text-emerald-400/70 font-mono mb-1">CURRENT ACCUMULATION</div>
              <div className="text-5xl font-bold font-mono bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                {currentBTC.toFixed(2)} ₿
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-emerald-400/70 font-mono mb-1">TARGET</div>
              <div className="text-4xl font-bold font-mono text-emerald-400">
                {targetBTC} ₿
              </div>
            </div>
          </div>

          <Progress 
            value={progress} 
            className="h-4 bg-emerald-950/50 border border-emerald-500/30"
          />
          
          <div className="flex justify-between mt-4 text-xs font-mono">
            <span className="text-emerald-500">{progress.toFixed(2)}% COMPLETE</span>
            <span className="text-emerald-600">{remainingBTC.toFixed(2)} ₿ REMAINING</span>
          </div>
        </div>

        {/* Value Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-cyan-950/20 border border-cyan-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-cyan-500/70 font-mono">TARGET VALUE</span>
            </div>
            <div className="text-3xl font-bold font-mono text-cyan-300">
              ${targetValueUSD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-cyan-600 font-mono mt-1">USD EQUIVALENT</div>
          </div>

          <div className="p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-emerald-500/70 font-mono">CURRENT VALUE</span>
            </div>
            <div className="text-3xl font-bold font-mono text-emerald-300">
              ${currentValueUSD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-emerald-600 font-mono mt-1">USD EQUIVALENT</div>
          </div>
        </div>

        {/* Status Message */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 rounded-lg text-center">
          <p className="text-emerald-300 font-mono text-sm">
            {progress === 0 ? (
              "⚡ INITIATE ACCUMULATION PROTOCOL"
            ) : progress < 50 ? (
              "⚡ EARLY PHASE | BUILDING MOMENTUM"
            ) : progress < 100 ? (
              "⚡ CRITICAL MASS APPROACHING"
            ) : (
              "⚡ KILL STRIKE MATERIALIZED | SOVEREIGNTY ACHIEVED"
            )}
          </p>
          <p className="text-xs text-emerald-600/60 font-mono mt-2 italic">
            Satoshi v2.0 Architect Protocol | 11D Manifold Resonance Active | Real BTC: {currentBTC.toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
}
