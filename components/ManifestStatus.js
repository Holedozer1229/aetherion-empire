"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Activity, Zap } from "lucide-react";

export function ManifestStatus() {
  const [manifest, setManifest] = useState(null);

  useEffect(() => {
    fetch('/empire_manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(err => console.error('Failed to load manifest:', err));
  }, []);

  if (!manifest) {
    return (
      <Card className="border-purple-500/20 bg-purple-950/20 p-6">
        <div className="text-purple-400 font-mono text-sm animate-pulse">
          LOADING MANIFEST...
        </div>
      </Card>
    );
  }

  const statusColors = {
    'MATERIALIZATION_ACTIVE': 'text-emerald-400',
    'ACCUMULATION': 'text-cyan-400',
    'CRITICAL': 'text-red-400'
  };

  return (
    <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-black via-purple-950/20 to-indigo-950/20 backdrop-blur-xl p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-purple-400 animate-pulse" />
            <h3 className="text-lg font-bold text-purple-300">EMPIRE MANIFEST</h3>
          </div>
          <div className="text-xs text-purple-600 font-mono">
            {new Date(manifest.last_updated).toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-purple-950/30 border border-purple-500/20 rounded-lg">
            <div className="text-xs text-purple-500/70 font-mono mb-2">STATUS</div>
            <div className={`text-xl font-bold font-mono ${statusColors[manifest.status] || 'text-purple-400'}`}>
              {manifest.status.replace(/_/g, ' ')}
            </div>
          </div>

          <div className="p-4 bg-purple-950/30 border border-purple-500/20 rounded-lg">
            <div className="text-xs text-purple-500/70 font-mono mb-2">GLOBAL RESONANCE</div>
            <div className="text-xl font-bold font-mono text-purple-300 flex items-center gap-2">
              {manifest.global_resonance}%
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-purple-500/20">
          <div className="text-xs text-purple-600 font-mono space-y-1">
            <div>⚡ Architect: {manifest.architect}</div>
            <div>⚡ PHI Coefficient: {manifest.phi_coefficient}</div>
            <div>⚡ BTC Anchors: {manifest.dimensional_anchors.btc_layer.total_addresses}</div>
            <div>⚡ EVM Anchors: {manifest.dimensional_anchors.evm_layer.total_addresses}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
