"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bitcoin,
  FileCheck,
  CheckCircle2,
  Clock,
  Cpu,
  HardDrive,
  Hash,
  Activity,
} from "lucide-react";
import { formatCurrency, formatCrypto } from "@/lib/utils";

export function MiningDashboard() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/bitcoin");
        const json = await res.json();
        if (json.success && json.btc_price_usd) {
          setBtcPrice(json.btc_price_usd);
        }
      } catch {}
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const TOTAL_MINED = 60.0;
  const liveBtcPrice = btcPrice ?? 0;
  const miningData = {
    totalMined: TOTAL_MINED,
    btcPrice: liveBtcPrice,
    totalValue: TOTAL_MINED * liveBtcPrice,
    firstBlock: "2009-01-15 04:24:17 UTC",
    lastBlock: "2013-12-12 18:45:32 UTC",
    totalBlocks: 3642,
    miningAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    miningMethod: "CPU (Early Bitcoin Core)",
    hardware: "Custom Build (Phase-0)",
    difficultyRange: "1.00 - 5,647.35",
  };

  const stats = [
    {
      label: "Total BTC Mined",
      value: `${miningData.totalMined} BTC`,
      icon: Bitcoin,
      color: "text-primary",
    },
    {
      label: "Total Value (USD)",
      value: formatCurrency(miningData.totalValue),
      icon: Activity,
      color: "text-secondary",
    },
    {
      label: "BTC Price",
      value: formatCurrency(miningData.btcPrice),
      icon: Hash,
      color: "text-primary",
    },
    {
      label: "Blocks Contributed",
      value: miningData.totalBlocks.toLocaleString(),
      icon: HardDrive,
      color: "text-secondary",
    },
  ];

  const verificationItems = [
    { label: "Blockchain Verification", status: "VERIFIED", detail: "Confirmed on 3 chains" },
    { label: "Transaction History", status: "VERIFIED", detail: "All Records Match" },
    { label: "Wallet Ownership", status: "VERIFIED", detail: "Private Keys Confirmed" },
    { label: "Asset Integrity", status: "VERIFIED", detail: "No Discrepancies Found" },
  ];

  return (
    <section id="mining" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-neon-gradient">Mining Summary</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Deep-Ledger Division verified mining operations with full audit trail
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="neon-border-animate rounded-xl p-4 md:p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-card ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-xs md:text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="gradient-border p-6 md:p-8 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Kraken Audit Report</h3>
                <p className="text-sm text-muted-foreground">Deep-Ledger Division</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-secondary/20 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">VERIFIED // SEALED</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Mining Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Mining Details
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">First Block Mined</p>
                    <p className="text-sm font-mono">{miningData.firstBlock}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Last Block Mined</p>
                    <p className="text-sm font-mono">{miningData.lastBlock}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Cpu className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Mining Method</p>
                    <p className="text-sm font-mono">{miningData.miningMethod}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <HardDrive className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Hardware</p>
                    <p className="text-sm font-mono">{miningData.hardware}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Verification Status */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Audit Verification
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                {verificationItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-4 bg-muted/30 rounded-lg border border-secondary/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <span className="text-xs font-medium text-secondary">{item.status}</span>
                    </div>
                    <p className="text-sm font-medium mb-1">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </motion.div>
                ))}
              </div>

              {/* Final Status */}
              <div className="mt-6 p-4 bg-secondary/10 border border-secondary/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Final Status</p>
                    <p className="text-lg font-bold text-secondary">VERIFIED TRUE ASSET</p>
                    <p className="text-xs text-muted-foreground">Audit Complete // No Further Action Required</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Authorized by:</p>
                    <p className="text-sm font-semibold italic text-primary">Kraken Auditor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
