"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, Users, Award, Coins } from "lucide-react";

interface Notification {
  id: string;
  type: "mining" | "payout" | "achievement" | "whale";
  message: string;
  amount?: string;
  user: string;
  timestamp: Date;
}

const generateNotification = (): Notification => {
  const types = ["mining", "payout", "achievement", "whale"] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const users = [
    "0xC5a4...C8cb",
    "0x7a2b...9f12",
    "0x3e8c...d4a1",
    "0x9b1f...c82e",
    "0x4d6a...7b93",
    "0x8f2e...1a5c",
  ];
  const user = users[Math.floor(Math.random() * users.length)];

  const notifications: Record<typeof type, { message: string; amount?: string }> = {
    mining: {
      message: "Just mined a block",
      amount: `+${(Math.random() * 0.5).toFixed(4)} ETH`,
    },
    payout: {
      message: "Claimed mining rewards",
      amount: `$${(Math.random() * 5000 + 500).toFixed(2)}`,
    },
    achievement: {
      message: "Unlocked Diamond Miner badge",
    },
    whale: {
      message: "Deposited into vault",
      amount: `${(Math.random() * 50 + 10).toFixed(2)} ETH`,
    },
  };

  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    ...notifications[type],
    user,
    timestamp: new Date(),
  };
};

const iconMap = {
  mining: Zap,
  payout: Coins,
  achievement: Award,
  whale: TrendingUp,
};

const colorMap = {
  mining: "text-secondary",
  payout: "text-primary",
  achievement: "text-amber-400",
  whale: "text-blue-400",
};

export function SocialProof() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visible, setVisible] = useState<Notification | null>(null);

  useEffect(() => {
    // Generate initial notifications
    const initial = Array.from({ length: 5 }, generateNotification);
    setNotifications(initial);

    // Show notifications in sequence
    const showInterval = setInterval(() => {
      const newNotification = generateNotification();
      setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);
      setVisible(newNotification);

      // Hide after 4 seconds
      setTimeout(() => setVisible(null), 4000);
    }, 8000);

    // Show first notification
    setTimeout(() => setVisible(initial[0]), 1000);
    setTimeout(() => setVisible(null), 5000);

    return () => clearInterval(showInterval);
  }, []);

  return (
    <>
      {/* Floating notification toast */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed bottom-6 left-6 z-50 max-w-sm"
          >
            <div className="flex items-center gap-3 p-4 bg-card/95 backdrop-blur-lg border border-primary/30 rounded-xl shadow-2xl gold-glow">
              <div className={`p-2 rounded-lg bg-muted ${colorMap[visible.type]}`}>
                {(() => {
                  const Icon = iconMap[visible.type];
                  return <Icon className="w-5 h-5" />;
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">
                    {visible.user}
                  </span>
                  <span className="text-xs text-muted-foreground">just now</span>
                </div>
                <p className="text-sm font-medium text-foreground truncate">
                  {visible.message}
                </p>
                {visible.amount && (
                  <p className={`text-sm font-bold ${colorMap[visible.type]}`}>
                    {visible.amount}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity feed section */}
      <section className="py-12 bg-gradient-to-b from-card/50 to-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Live Activity</h3>
                <p className="text-sm text-muted-foreground">Real-time network transactions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm text-secondary font-medium">Live</span>
            </div>
          </div>

          <div className="grid gap-3 max-h-80 overflow-hidden">
            <AnimatePresence mode="popLayout">
              {notifications.slice(0, 6).map((notification, i) => {
                const Icon = iconMap[notification.type];
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1 - i * 0.15, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <div className={`p-2 rounded-lg bg-card ${colorMap[notification.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-foreground">
                          {notification.user}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {notification.message}
                        </span>
                      </div>
                    </div>
                    {notification.amount && (
                      <span className={`font-bold ${colorMap[notification.type]}`}>
                        {notification.amount}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      just now
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
