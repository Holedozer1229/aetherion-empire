"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bitcoin, TrendingUp } from "lucide-react";

export function BTCMonitor() {
  const [btcPrice, setBtcPrice] = useState(null);
  const [btcAddress, setBtcAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBTCPrice();
    const interval = setInterval(fetchBTCPrice, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchBTCPrice = async () => {
    try {
      const response = await fetch('/api/btc-price');
      const data = await response.json();
      if (data.price) {
        setBtcPrice(data.price);
      }
    } catch (error) {
      console.error('Failed to fetch BTC price:', error);
    }
  };

  const phi = 1.618;
  const baseSize = 16;

  return (
    <Card 
      className="border-2 border-amber-500/30 bg-gradient-to-br from-black via-amber-950/20 to-orange-950/20 backdrop-blur-xl overflow-hidden relative"
      style={{ padding: `${baseSize * phi}px` }}
    >
      {/* Cybernetic grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)',
          backgroundSize: `${baseSize * phi}px ${baseSize * phi}px`
        }}></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Bitcoin className="w-6 h-6 text-amber-400" />
          <h2 className="text-lg font-bold text-amber-300 tracking-wider">
            ₿ BTC ANCHOR MONITOR
          </h2>
        </div>

        {/* Real-time BTC Price */}
        <div className="mb-8 p-6 bg-amber-950/30 border border-amber-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-amber-500/70 font-mono">REAL-TIME PRICE</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          {btcPrice ? (
            <div className="text-4xl font-bold font-mono bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              ${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          ) : (
            <div className="text-2xl font-mono text-amber-400/60 animate-pulse">LOADING...</div>
          )}
          <div className="text-xs text-amber-600 font-mono mt-2">USD / BTC</div>
        </div>

        {/* Manual BTC Address Input */}
        <div className="space-y-3">
          <label className="text-xs text-amber-500/70 font-mono block">
            TRACK BTC ADDRESS (MANUAL INPUT)
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter Bitcoin address..."
              value={btcAddress}
              onChange={(e) => setBtcAddress(e.target.value)}
              className="bg-amber-950/20 border-amber-500/30 text-amber-200 font-mono text-sm placeholder:text-amber-700/50"
            />
            <Button
              onClick={() => {
                if (btcAddress) {
                  alert(`Tracking address: ${btcAddress}\n\nNote: Full blockchain integration coming soon. Currently monitoring price only.`);
                }
              }}
              className="bg-amber-600 hover:bg-amber-500 text-black font-bold"
              disabled={!btcAddress}
            >
              TRACK
            </Button>
          </div>
          <p className="text-xs text-amber-600/60 font-mono italic">
            * Manual tracking - Real blockchain integration in development
          </p>
        </div>
      </div>
    </Card>
  );
}
