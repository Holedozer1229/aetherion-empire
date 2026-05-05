"use client";

import { motion } from "framer-motion";
import { Crown, Medal, Trophy, TrendingUp, Sparkles } from "lucide-react";

const leaderboardData = [
  {
    rank: 1,
    address: "0xC5a4...C8cb20",
    name: "Travis D Jones",
    mined: "60.00 BTC",
    value: "$22,929,934.20",
    blocks: 3642,
    badge: "Kraken Elite",
    isYou: true,
  },
  {
    rank: 2,
    address: "0x7a2b...9f12",
    name: "QuantumWhale",
    mined: "45.32 BTC",
    value: "$17,318,726.08",
    blocks: 2891,
    badge: "Diamond Miner",
  },
  {
    rank: 3,
    address: "0x3e8c...d4a1",
    name: "CryptoKing42",
    mined: "38.91 BTC",
    value: "$14,867,194.22",
    blocks: 2456,
    badge: "Platinum Status",
  },
  {
    rank: 4,
    address: "0x9b1f...c82e",
    name: "BlockMaster",
    mined: "31.24 BTC",
    value: "$11,937,412.56",
    blocks: 1987,
    badge: "Gold Tier",
  },
  {
    rank: 5,
    address: "0x4d6a...7b93",
    name: "HashPower99",
    mined: "28.17 BTC",
    value: "$10,764,122.34",
    blocks: 1654,
    badge: "Silver Tier",
  },
];

const rankIcons = {
  1: Crown,
  2: Medal,
  3: Trophy,
};

const rankColors = {
  1: "text-primary bg-primary/10 border-primary/30",
  2: "text-gray-300 bg-gray-300/10 border-gray-300/30",
  3: "text-amber-600 bg-amber-600/10 border-amber-600/30",
};

export function Leaderboard() {
  return (
    <section className="py-16 bg-gradient-to-b from-card/30 to-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Global Leaderboard
              </h2>
            </div>
            <p className="text-muted-foreground">
              Top miners in the Lucky Palace ecosystem
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-xl border border-secondary/30">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <span className="text-sm text-secondary font-medium">Updated live</span>
          </div>
        </div>

        <div className="space-y-3">
          {leaderboardData.map((entry, i) => {
            const RankIcon = rankIcons[entry.rank as keyof typeof rankIcons];
            const isTopThree = entry.rank <= 3;
            
            return (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className={`relative flex items-center gap-4 p-4 md:p-5 rounded-xl border transition-all ${
                  entry.isYou
                    ? "bg-primary/5 border-primary/40 gold-glow"
                    : "bg-muted/20 border-primary/10 hover:border-primary/30"
                }`}
              >
                {/* Rank */}
                <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl border ${
                  isTopThree
                    ? rankColors[entry.rank as keyof typeof rankColors]
                    : "text-muted-foreground bg-muted/30 border-muted/50"
                }`}>
                  {RankIcon ? (
                    <RankIcon className="w-5 h-5 md:w-6 md:h-6" />
                  ) : (
                    <span className="text-lg font-bold">#{entry.rank}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground">{entry.name}</span>
                    {entry.isYou && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-primary/20 text-primary rounded-full">
                        YOU
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground font-mono hidden md:inline">
                      {entry.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-xs text-muted-foreground">{entry.badge}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{entry.blocks.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Blocks</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{entry.mined}</p>
                    <p className="text-xs text-muted-foreground">Mined</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-secondary">{entry.value}</p>
                    <p className="text-xs text-muted-foreground">Value</p>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="flex sm:hidden flex-col items-end">
                  <p className="text-sm font-bold text-primary">{entry.mined}</p>
                  <p className="text-xs text-secondary">{entry.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
