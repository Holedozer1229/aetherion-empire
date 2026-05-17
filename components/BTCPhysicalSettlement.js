"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bitcoin, ExternalLink, Shield } from "lucide-react";

const BTC_ANCHORS = [
  { address: 'bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal', name: 'Primary Anchor', balance: 0 },
  { address: 'bc1pt5zrlm55lmfwq7sjsuzgpgkmm7fymkna375l8kyuu5p6cq77545q554mgr', name: 'Core Reserve', balance: 4.48 },
  { address: '1KT3zCYUrmQxjcveUNs1Rs7WcXDcPQZ4av', name: 'Genesis Anchor', balance: 0 },
  { address: 'bc1qvsgjq7atxz4eakr7tzzmskqj233x27v6y70pzn', name: 'Secondary Reserve', balance: 0 },
];

export function BTCPhysicalSettlement() {
  const totalBTC = BTC_ANCHORS.reduce((sum, anchor) => sum + anchor.balance, 0);

  const phi = 1.618;
  const baseSize = 16;

  return (
    <Card 
      className="border-2 border-amber-500/30 bg-gradient-to-br from-black via-amber-950/20 to-orange-950/20 backdrop-blur-xl overflow-hidden relative"
      style={{ padding: `${baseSize * phi}px` }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)',
          backgroundSize: `${baseSize * phi}px ${baseSize * phi}px`
        }}></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Bitcoin className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-bold text-amber-300 tracking-wider">
            ₿ BTC PHYSICAL SETTLEMENT
          </h2>
        </div>

        <div className="mb-6 p-6 bg-amber-950/40 border border-amber-500/30 rounded-xl">
          <div className="text-center">
            <div className="text-sm text-amber-500/70 font-mono mb-3">TOTAL BTC UNDER CONTROL</div>
            <div className="text-5xl font-bold font-mono bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent mb-4">
              {totalBTC.toFixed(8)} ₿
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              {BTC_ANCHORS.map((anchor) => (
                <div key={anchor.address} className="p-3 bg-amber-950/30 border border-amber-500/20 rounded">
                  <div className="text-amber-400 mb-1">{anchor.name}</div>
                  <div className="text-amber-600 truncate">{anchor.address.slice(0, 12)}...</div>
                  <div className="text-amber-300 mt-1 font-bold">{anchor.balance.toFixed(8)} ₿</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-orange-950/30 border border-orange-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-bold text-orange-300">READ-ONLY TRACKING MODE</h3>
          </div>
          <p className="text-xs text-orange-500/70 font-mono leading-relaxed">
            BTC anchors are in read-only mode. For physical settlement and transfers, 
            use the Vulture Strike protocol through secure cold storage procedures.
          </p>
        </div>

        <Button
          onClick={() => {
            window.open('https://vulturestrike.network/settlement', '_blank');
          }}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-black font-bold py-6 text-lg"
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          ACCESS VULTURE STRIKE SETTLEMENT LOGS
        </Button>

        <div className="mt-6 pt-4 border-t border-amber-500/20">
          <p className="text-xs text-amber-700/60 font-mono text-center italic">
            ⚠ Physical BTC settlements require multi-signature verification and cold storage protocols.
            All movements logged on-chain with cryptographic proof.
          </p>
        </div>
      </div>
    </Card>
  );
}
