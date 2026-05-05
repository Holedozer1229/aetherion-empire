"use client";

import { motion } from "framer-motion";
import { 
  Award, 
  Zap, 
  Shield, 
  Crown, 
  Gem, 
  Rocket,
  Star,
  Target,
  Lock
} from "lucide-react";

const achievements = [
  {
    id: "first-mine",
    title: "First Block",
    description: "Mine your first block",
    icon: Zap,
    unlocked: true,
    rarity: "common",
    date: "Jan 15, 2024",
  },
  {
    id: "verified",
    title: "ZK Verified",
    description: "Complete ZK-SNARK verification",
    icon: Shield,
    unlocked: true,
    rarity: "rare",
    date: "Feb 3, 2024",
  },
  {
    id: "whale",
    title: "Whale Status",
    description: "Hold 10+ ETH in vault",
    icon: Crown,
    unlocked: true,
    rarity: "epic",
    date: "Mar 21, 2024",
  },
  {
    id: "diamond",
    title: "Diamond Hands",
    description: "Stake for 90+ days",
    icon: Gem,
    unlocked: true,
    rarity: "legendary",
    date: "May 1, 2024",
  },
  {
    id: "quantum",
    title: "Quantum Miner",
    description: "Mine 100 blocks",
    icon: Rocket,
    unlocked: false,
    rarity: "legendary",
    progress: 67,
  },
  {
    id: "oracle",
    title: "Oracle Master",
    description: "Connect to SphinxQASI",
    icon: Star,
    unlocked: true,
    rarity: "epic",
    date: "Apr 15, 2024",
  },
  {
    id: "millionaire",
    title: "Crypto Millionaire",
    description: "Earn $1M+ in rewards",
    icon: Target,
    unlocked: true,
    rarity: "legendary",
    date: "May 31, 2024",
  },
  {
    id: "founder",
    title: "Lucky Founder",
    description: "Early adopter badge",
    icon: Award,
    unlocked: true,
    rarity: "mythic",
    date: "Jan 1, 2024",
  },
];

const rarityColors = {
  common: "from-gray-500/20 to-gray-600/20 border-gray-500/30",
  rare: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
  epic: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
  legendary: "from-primary/20 to-amber-600/20 border-primary/30",
  mythic: "from-rose-500/20 to-pink-600/20 border-rose-500/30",
};

const rarityGlow = {
  common: "",
  rare: "shadow-blue-500/10",
  epic: "shadow-purple-500/20",
  legendary: "gold-glow",
  mythic: "shadow-rose-500/20 shadow-lg",
};

const rarityText = {
  common: "text-gray-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-primary",
  mythic: "text-rose-400",
};

export function Achievements() {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  
  return (
    <section className="py-16 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Achievements
              </h2>
            </div>
            <p className="text-muted-foreground">
              Unlock badges and showcase your mining prowess
            </p>
          </div>
          <div className="flex items-center gap-4 px-4 py-2 bg-muted/30 rounded-xl border border-primary/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{unlockedCount}</p>
              <p className="text-xs text-muted-foreground">Unlocked</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-muted-foreground">{achievements.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, i) => {
            const Icon = achievement.unlocked ? achievement.icon : Lock;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`relative p-4 rounded-xl border bg-gradient-to-br ${
                  achievement.unlocked
                    ? rarityColors[achievement.rarity as keyof typeof rarityColors]
                    : "from-muted/20 to-muted/10 border-muted/30"
                } ${achievement.unlocked ? rarityGlow[achievement.rarity as keyof typeof rarityGlow] : ""} cursor-pointer transition-all`}
              >
                {/* Rarity indicator */}
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <span className={`text-[10px] font-bold uppercase ${rarityText[achievement.rarity as keyof typeof rarityText]}`}>
                      {achievement.rarity}
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  achievement.unlocked 
                    ? `bg-gradient-to-br ${rarityColors[achievement.rarity as keyof typeof rarityColors].replace('/20', '/30')}`
                    : "bg-muted/30"
                }`}>
                  <Icon className={`w-6 h-6 ${
                    achievement.unlocked 
                      ? rarityText[achievement.rarity as keyof typeof rarityText]
                      : "text-muted-foreground"
                  }`} />
                </div>

                <h3 className={`font-bold mb-1 ${
                  achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {achievement.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {achievement.description}
                </p>

                {achievement.unlocked ? (
                  <p className="text-xs text-muted-foreground">
                    Unlocked {achievement.date}
                  </p>
                ) : (
                  <div className="space-y-1">
                    <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/50 rounded-full"
                        style={{ width: `${achievement.progress || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {achievement.progress || 0}% complete
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
