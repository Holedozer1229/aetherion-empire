"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  CheckCircle2,
  FileText,
  QrCode,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const hashRateData = [
  { year: "2009", rate: 100 },
  { year: "2010", rate: 450 },
  { year: "2011", rate: 1200 },
  { year: "2012", rate: 3500 },
  { year: "2013", rate: 10000 },
];

const walletDistribution = [
  { name: "Primary Wallet", value: 100, color: "hsl(43, 74%, 49%)" },
  { name: "Cold Storage", value: 0, color: "hsl(174, 72%, 40%)" },
  { name: "Exchanges", value: 0, color: "hsl(20, 10%, 30%)" },
  { name: "Other", value: 0, color: "hsl(20, 10%, 20%)" },
];

export function AuditReport() {
  const [bgError, setBgError] = useState(false);
  
  const auditData = {
    subject: "TRAVIS D JONES",
    assetType: "BITCOIN (BTC)",
    clearanceLevel: "OMEGA BLACK",
    totalBTC: 60.0,
    btcPrice: 382105.57,
    walletBalance: 60.0,
    walletValue: 22929934.2,
    status: "Fully Verified",
    auditResult: "True & Complete",
  };

  return (
    <section id="audit" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decorative image */}
      {!bgError && (
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0241-3cF8Mj6CFmpM1VdHNbrS4WZCu3uK5L.png"
            alt=""
            fill
            className="object-cover"
            unoptimized
            onError={() => setBgError(true)}
          />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">TOP-SECRET // KRAKEN AUDIT REPORT</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gold-gradient">Clearance Level: {auditData.clearanceLevel}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Deep-Ledger Division comprehensive asset verification
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="gradient-border rounded-2xl overflow-hidden max-w-6xl mx-auto"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-4 md:p-6 border-b border-primary/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">KRAKEN DEEP-LEDGER DIVISION</p>
                  <p className="text-xl font-bold">SUBJECT: {auditData.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-xl border border-secondary/30">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="text-sm font-bold text-secondary">TRUE ASSET VERIFIED: {auditData.assetType}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 md:p-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Mining Summary */}
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-xl border border-primary/20">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4">Mining Summary</h3>
                  <div className="text-center mb-4">
                    <p className="text-5xl font-bold text-primary">{auditData.totalBTC}</p>
                    <p className="text-sm text-muted-foreground">BTC MINED</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">First Block Mined:</span>
                      <span className="font-mono">2009-01-15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Block Mined:</span>
                      <span className="font-mono">2013-12-12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Blocks:</span>
                      <span className="font-mono">3,642</span>
                    </div>
                  </div>
                </div>

                {/* Hashrate Chart */}
                <div className="p-4 bg-muted/30 rounded-xl border border-primary/20">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4">Hashrate Contribution</h3>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hashRateData}>
                        <defs>
                          <linearGradient id="hashRateGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="year"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "hsl(43, 30%, 60%)", fontSize: 10 }}
                        />
                        <YAxis hide />
                        <Area
                          type="monotone"
                          dataKey="rate"
                          stroke="hsl(43, 74%, 49%)"
                          fill="url(#hashRateGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Center Column - Bitcoin Display */}
              <div className="flex flex-col items-center justify-center">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="relative w-40 h-40 md:w-48 md:h-48"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-xl" />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center border-4 border-primary/50 gold-glow">
                    <span className="text-6xl md:text-7xl font-bold text-primary-foreground">₿</span>
                  </div>
                </motion.div>
                
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full border border-secondary/30 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-bold text-secondary">{auditData.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Audit Result:</p>
                  <p className="text-lg font-bold text-primary">{auditData.auditResult}</p>
                </div>
              </div>

              {/* Right Column - Financial Summary */}
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-xl border border-primary/20">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4">Financial Summary</h3>
                  <div className="text-center mb-4">
                    <p className="text-3xl md:text-4xl font-bold text-primary">{formatCurrency(auditData.walletValue)}</p>
                    <p className="text-sm text-muted-foreground">TOTAL HAUL (USD)</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">BTC Price (Audit Time):</span>
                      <span className="font-mono">{formatCurrency(auditData.btcPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total BTC:</span>
                      <span className="font-mono">{auditData.totalBTC} BTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wallet Balance:</span>
                      <span className="font-mono">{auditData.walletBalance} BTC</span>
                    </div>
                  </div>
                </div>

                {/* Wallet Distribution */}
                <div className="p-4 bg-muted/30 rounded-xl border border-primary/20">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4">Wallet Distribution</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={walletDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={40}
                            dataKey="value"
                          >
                            {walletDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-1 text-xs">
                      {walletDistribution.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-muted-foreground">{item.name}:</span>
                          <span className="font-mono">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-primary/5 border-t border-primary/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-primary/50" />
              <div className="text-xs text-muted-foreground">
                <p>Report ID: KRAKEN-AUDIT-7DJ-004</p>
                <p>Encryption: AES-256 QUANTUM</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Authorized by:</p>
              <p className="text-sm font-semibold italic text-primary">Kraken Auditor</p>
              <p className="text-xs text-muted-foreground">Deep-Ledger Division</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
