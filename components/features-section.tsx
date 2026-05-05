"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Zap,
  Shield,
  Layers,
  Network,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Quantum Mining Engine",
    description: "Advanced quantum-enhanced computational mining with optimized hash rates and energy efficiency.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "ZK-SNARK Verification",
    description: "Zero-knowledge proof verification ensures complete privacy while maintaining full transparency.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Layers,
    title: "Multi-Chain Support",
    description: "Seamlessly operate across Bitcoin, Ethereum, Solana, and other major blockchain networks.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Network,
    title: "Decentralized Oracle",
    description: "SphinxQASI Oracle provides real-time market data and automated smart contract execution.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Lock,
    title: "Military-Grade Security",
    description: "AES-256 quantum encryption protects all assets with audited smart contracts.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    description: "Lightning-fast transaction finality with automated payout distribution system.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-neon-gradient">Protocol Features</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge technology powering the future of decentralized finance
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 neon-border-animate rounded-xl hover:border-primary/50 transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
