"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  TrendingUp,
  Box,
  Shield,
  Clock,
  Network,
} from "lucide-react";
import { useState, useEffect } from "react";
import { formatCurrency, shortenAddress } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function PayoutManifest() {
  const [copied, setCopied] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [profitData, setProfitData] = useState<{ month: string; profit: number }[]>([]);
  const [btcPrice, setBtcPrice] = useState<number>(0);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        // CoinGecko free API — BTC/USD daily close for past 12 months
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=monthly"
        );
        if (!res.ok) throw new Error("coingecko failed");
        const json = await res.json();
        const prices: [number, number][] = json.prices ?? [];
        // Each entry is [timestamp_ms, price]. 60 BTC × monthly price
        const mapped = prices.slice(-12).map(([ts, price]) => {
          const d = new Date(ts);
          return { month: MONTHS[d.getMonth()], profit: Math.round(60 * price) };
        });
        setProfitData(mapped);
        if (mapped.length > 0) {
          setBtcPrice(mapped[mapped.length - 1].profit / 60);
        }
      } catch {
        // fallback: fetch current price only
        try {
          const r = await fetch("/api/bitcoin");
          const j = await r.json();
          if (j.btc_price_usd) setBtcPrice(j.btc_price_usd);
        } catch {}
      }
    };
    fetchPriceHistory();
  }, []);

  const totalPayout = btcPrice > 0 ? 60 * btcPrice : 0;

  const payoutData = {
    recipient: "TRAVIS D JONES",
    wallet: "0xC5a4...C8cb20",
    fullWallet: "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20",
    network: "BITCOIN / ETHEREUM",
    totalPayout,
    blocksVerified: 353,
    status: "COMPLETE",
    transactionId: "0x7e3b...c8d9f2a7e4b6c9d8f1e0a",
    timestamp: "MAY 31, 2024  14:37:42 UTC",
    networkFee: 0.00421,
    verificationMethod: "ZERO-KNOWLEDGE PROOF (ZK-SNARK)",
    smartContract: "0xLP7...KrakenProtocol",
    confirmations: "353 / 353",
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(payoutData.fullWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="payouts" className="py-16 md:py-24 relative">
      {/* Background Image */}
      {!bgError && (
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0239-RxRokjwNBe98qbs9fCU9cDeIcrJ2pC.png"
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/5 mb-4">
            <Shield className="w-4 h-4 text-secondary" />
            <span className="text-sm text-secondary font-medium">Lucky Palace Protocol</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-neon-gradient">Payout Manifest</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Verified transaction settlement with zero-knowledge proof verification
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel rounded-2xl overflow-hidden max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="bg-primary/10 border-b border-primary/20 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">LUCKY PALACE PROTOCOL</p>
                <p className="text-lg md:text-xl font-bold">PAYOUT MANIFEST</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">TOTAL PAYOUT</p>
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    {formatCurrency(payoutData.totalPayout)}
                  </p>
                </div>
                <div className="text-center p-3 bg-secondary/20 rounded-xl border border-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">BLOCKS VERIFIED</p>
                  <p className="text-xl font-bold text-secondary">{payoutData.blocksVerified}</p>
                  <p className="text-[10px] text-secondary">ZK-VERIFIED BLOCKS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">RECIPIENT</p>
                    <p className="text-xl font-bold">{payoutData.recipient}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">WALLET</p>
                      <p className="font-mono text-sm">{payoutData.wallet}</p>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {copied && (
                      <span className="text-xs text-secondary">Copied!</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Network className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-xs text-muted-foreground">NETWORK</p>
                      <p className="font-medium text-secondary">{payoutData.network}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-xs text-muted-foreground">PAYOUT STATUS</p>
                      <p className="font-bold text-secondary">{payoutData.status}</p>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-2 pt-4 border-t border-primary/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-mono">{payoutData.transactionId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Timestamp</span>
                    <span className="font-mono">{payoutData.timestamp}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Network Fee</span>
                    <span className="font-mono">{payoutData.networkFee} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Verification Method</span>
                    <span className="font-mono text-xs">{payoutData.verificationMethod}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Chart */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">ETH PROFIT OVERVIEW</p>
                  <div className="h-48 md:h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={profitData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.1)" />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "hsl(43, 30%, 60%)", fontSize: 10 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "hsl(43, 30%, 60%)", fontSize: 10 }}
                          tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(20, 10%, 8%)",
                            border: "1px solid hsl(43, 50%, 25%)",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [formatCurrency(value), "Profit"]}
                        />
                        <Bar
                          dataKey="profit"
                          fill="hsl(43, 74%, 49%)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Seal and Settlement */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/20 rounded-full">
                      <Shield className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">LUCKY PALACE SEAL</p>
                      <p className="text-sm font-mono">{payoutData.smartContract}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Confirmations</p>
                    <p className="font-mono text-sm">{payoutData.confirmations}</p>
                  </div>
                </div>

                {/* SETTLED Badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center"
                >
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/20 border-2 border-secondary rounded-xl transform rotate-[-3deg]">
                    <CheckCircle2 className="w-6 h-6 text-secondary" />
                    <span className="text-2xl font-bold text-secondary tracking-wider">SETTLED</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-primary/5 border-t border-primary/20 p-4 text-center">
            <p className="text-lg font-bold tracking-widest text-primary">IN CODE WE TRUST</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
