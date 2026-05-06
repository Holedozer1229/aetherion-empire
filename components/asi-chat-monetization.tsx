"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, MessageSquare, Sparkles, ShieldCheck, Loader2 } from "lucide-react";

const tiers = [
  { name: "Free", price: "$0", limit: "7 days of agentic mode", cta: "Start Free Week", planKey: "free" },
  { name: "Pro", price: "$29/mo", limit: "Auto-charged after free week", cta: "Start Pro Trial", planKey: "pro" },
  { name: "Sovereign", price: "$199/mo", limit: "Auto-charged after free week", cta: "Start Sovereign Trial", planKey: "sovereign" },
];

export function AsiChatMonetization() {
  const [selectedTier, setSelectedTier] = useState("Pro");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const beginTrial = async (planKey: string) => {
    if (planKey === "free") {
      setStatus("Free agentic mode unlocked for 7 days.");
      return;
    }

    setIsLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/chat-paywall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();

      if (!data.success) {
        setStatus(data.error || "Unable to start trial.");
        return;
      }

      if (data.checkout?.redirect_url) {
        window.location.href = data.checkout.redirect_url;
        return;
      }

      setStatus("Stripe price ID not configured yet. Set STRIPE_PRICE_* env vars to enable checkout.");
    } catch {
      setStatus("Network error while starting Stripe trial.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">ASI Chat Paywall</h2>
          <p className="text-muted-foreground">Offer 7-day free agentic mode, then auto-charge monthly via Stripe subscriptions.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedTier(tier.name)}
              className={`text-left rounded-2xl border p-5 transition cursor-pointer ${
                selectedTier === tier.name ? "border-primary bg-primary/10" : "border-white/10 bg-card/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{tier.name}</h3>
                {tier.name === "Sovereign" ? <Crown className="w-4 h-4 text-yellow-400" /> : <MessageSquare className="w-4 h-4" />}
              </div>
              <p className="text-2xl font-bold mb-2">{tier.price}</p>
              <p className="text-sm text-muted-foreground">{tier.limit}</p>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  beginTrial(tier.planKey);
                }}
                disabled={isLoading}
                className="mt-4 text-sm px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isLoading && tier.planKey !== "free" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/30 bg-card/70 p-6">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3"><Sparkles className="w-4 h-4 text-primary mt-1" /> First 7 days free for full agentic mode chat access.</div>
            <div className="flex gap-3"><ShieldCheck className="w-4 h-4 text-cyan-400 mt-1" /> Stripe subscription paywall with automatic recurring billing.</div>
            <div className="flex gap-3"><Crown className="w-4 h-4 text-yellow-400 mt-1" /> Supports Pro and Sovereign tiers for higher usage and enterprise control.</div>
          </div>
          {status ? <p className="mt-4 text-sm text-cyan-400">{status}</p> : null}
        </div>
      </div>
    </section>
  );
}
