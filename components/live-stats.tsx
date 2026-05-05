"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Users, Cpu } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function LiveStats() {
  const [stats, setStats] = useState({
    totalHashRate: 847.32,
    activeMiners: 12847,
    blocksToday: 23,
    networkDifficulty: 5647.35,
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        totalHashRate: prev.totalHashRate + (Math.random() - 0.5) * 10,
        activeMiners: prev.activeMiners + Math.floor((Math.random() - 0.5) * 50),
        blocksToday: prev.blocksToday + (Math.random() > 0.95 ? 1 : 0),
        networkDifficulty: prev.networkDifficulty + (Math.random() - 0.5) * 5,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const liveStats = [
    {
      label: "Total Hash Rate",
      value: `${stats.totalHashRate.toFixed(2)} TH/s`,
      icon: Cpu,
      change: "+12.4%",
      positive: true,
    },
    {
      label: "Active Miners",
      value: stats.activeMiners.toLocaleString(),
      icon: Users,
      change: "+847",
      positive: true,
    },
    {
      label: "Blocks Today",
      value: stats.blocksToday.toString(),
      icon: Activity,
      change: "Avg: 21/day",
      positive: true,
    },
    {
      label: "Network Difficulty",
      value: stats.networkDifficulty.toFixed(2),
      icon: TrendingUp,
      change: "+2.3%",
      positive: true,
    },
  ];

  return (
    <section className="py-8 border-b border-primary/20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-sm text-muted-foreground">Live Network Stats</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {liveStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl border border-primary/10"
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className={`text-xs ${stat.positive ? "text-secondary" : "text-red-500"}`}>
                  {stat.change}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
