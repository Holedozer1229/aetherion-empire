"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRightLeft, Users } from "lucide-react";

interface MempoolTx {
  id: string;
  txid: string;
  value: number;
  fee: number;
  size: number;
}

function shortenTxid(txid: string) {
  return `${txid.slice(0, 6)}...${txid.slice(-6)}`;
}

function formatBTC(sats: number) {
  return (sats / 1e8).toFixed(6) + " BTC";
}

export function SocialProof() {
  const [txns, setTxns] = useState<MempoolTx[]>([]);
  const [visible, setVisible] = useState<MempoolTx | null>(null);
  const [toastIndex, setToastIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchMempool = async () => {
      try {
        const res = await fetch("https://mempool.space/api/mempool/recent");
        if (!res.ok) throw new Error("mempool fetch failed");
        const data: any[] = await res.json();
        if (mounted && Array.isArray(data) && data.length > 0) {
          const mapped: MempoolTx[] = data.slice(0, 25).map((tx: any) => ({
            id: tx.txid,
            txid: tx.txid,
            value: tx.value ?? 0,
            fee: tx.fee ?? 0,
            size: tx.size ?? 0,
          }));
          setTxns(mapped);
        }
      } catch {
        // silently fail — no mock fallback
      }
    };

    fetchMempool();
    const pollInterval = setInterval(fetchMempool, 15000);
    return () => {
      mounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  // Cycle through real txns as toast notifications
  useEffect(() => {
    if (txns.length === 0) return;
    const idx = toastIndex % txns.length;
    setVisible(txns[idx]);
    const hideTimer = setTimeout(() => setVisible(null), 4500);
    const nextTimer = setTimeout(() => setToastIndex((i) => i + 1), 8000);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [toastIndex, txns]);

  return (
    <>
      {/* Floating toast */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key={visible.txid}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed bottom-6 left-6 z-50 max-w-xs"
          >
            <div className="flex items-center gap-3 p-4 bg-card/95 backdrop-blur-lg border border-primary/30 rounded-xl shadow-2xl neon-glow">
              <div className="p-2 rounded-lg bg-muted text-secondary">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Live Mempool Tx</p>
                <p className="text-sm font-mono text-foreground truncate">
                  {shortenTxid(visible.txid)}
                </p>
                <p className="text-sm font-bold text-primary">
                  {formatBTC(visible.value)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity feed */}
      <section className="py-12 bg-gradient-to-b from-card/50 to-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Live Mempool</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time Bitcoin mainnet transactions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm text-secondary font-medium">Live</span>
            </div>
          </div>

          {txns.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Connecting to Bitcoin mempool...
            </p>
          ) : (
            <div className="grid gap-3 max-h-80 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {txns.slice(0, 6).map((tx, i) => (
                  <motion.div
                    key={tx.txid}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1 - i * 0.12, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-card text-secondary">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-foreground truncate">
                        {shortenTxid(tx.txid)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.size} bytes · {tx.fee} sats fee
                      </p>
                    </div>
                    <span className="font-bold text-primary text-sm whitespace-nowrap">
                      {formatBTC(tx.value)}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
