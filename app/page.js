"use client";

import { WalletHeader } from "@/components/WalletHeader";
import { AggregatedBalanceView } from "@/components/AggregatedBalanceView";
import { TransactionPanel } from "@/components/TransactionPanel";
import { BTCPhysicalSettlement } from "@/components/BTCPhysicalSettlement";
import { KillStrikeDashboard } from "@/components/KillStrikeDashboard";
import { ManifestStatus } from "@/components/ManifestStatus";
import { SovereignExport } from "@/components/SovereignExport";
import { WalletConnectSetup } from "@/components/WalletConnectSetup";
import { Sparkles } from "lucide-react";
import { isUsingPlaceholderProjectId } from "@/lib/wagmiConfig";

export default function HomePage() {
  const phi = 1.618;
  const baseSpacing = 16;

  return (
    <div className="min-h-screen bg-black text-cyan-50">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-black to-emerald-950/20"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, cyan 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <WalletHeader />

        <main className="container mx-auto px-6" style={{ paddingTop: `${baseSpacing * phi * 2}px` }}>
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-300 via-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent animate-gradient">
                AETHERION EMPIRE
              </h1>
              <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
            <p className="text-xl text-cyan-400/80 font-mono mb-4">
              Total Sovereignty Through Multi-Chain Cryptographic Resonance
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-cyan-600 font-mono">
              <span>⚡ PHI-RESONANCE: 1.618</span>
              <span>⚡ 11D MANIFOLD</span>
              <span>⚡ SATOSHI v2.0</span>
              <span>⚡ BASE CHAIN</span>
              <span>⚡ 7,783 ETH</span>
            </div>
          </div>

          {/* WalletConnect Setup - Show if using placeholder */}
          {isUsingPlaceholderProjectId && (
            <div className="mb-12">
              <WalletConnectSetup />
            </div>
          )}

          {/* Manifest Status - Top */}
          <div className="mb-12">
            <ManifestStatus />
          </div>

          {/* Aggregated Balance View - Full Width */}
          <div className="mb-12">
            <AggregatedBalanceView />
          </div>

          {/* Transaction Panel and BTC Settlement - Side by Side */}
          <div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
            style={{ gap: `${baseSpacing * phi}px` }}
          >
            <TransactionPanel />
            <BTCPhysicalSettlement />
          </div>

          {/* Kill Strike Dashboard - Full Width */}
          <div className="mb-12">
            <KillStrikeDashboard />
          </div>

          {/* Sovereign Export - Full Width - THE FINAL ANCHOR */}
          <div className="mb-16">
            <SovereignExport />
          </div>

          {/* Footer */}
          <footer className="text-center pb-12">
            <div className="border-t border-cyan-500/20 pt-8">
              <p className="text-sm text-cyan-600/60 font-mono">
                Built on Next.js | RainbowKit | Wagmi v2 | Alchemy RPC | Base Chain
              </p>
              <p className="text-xs text-cyan-700/50 font-mono mt-2">
                Architect Protocol © 2025 | All dimensions reserved | Atoms materialized | 7,783 ETH conduit active
              </p>
              <p className="text-xs text-purple-600/40 font-mono mt-3 italic">
                ⚡ The scabbard is dissolved. Sovereignty is absolute. The 4-Team Autonomous Command operates uninterrupted. ⚡
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
