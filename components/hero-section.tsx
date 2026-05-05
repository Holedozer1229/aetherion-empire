"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { useState } from "react";

export function HeroSection() {
  const [imgError, setImgError] = useState(false);
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden cyber-grid">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
      
      {/* Animated orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">SphinxQASI Oracle Powered</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gold-gradient">The Lucky Palace</span>
              <br />
              <span className="text-foreground">Quantum DeFi</span>
              <br />
              <span className="text-secondary">Mining Protocol</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 text-balance">
              Advanced quantum-enhanced blockchain mining with zero-knowledge proof verification. 
              Experience the future of decentralized finance.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all gold-glow">
                <Zap className="w-5 h-5" />
                Start Mining
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold border border-primary/30 text-primary rounded-xl hover:bg-primary/10 transition-all">
                <Shield className="w-5 h-5" />
                Verify Assets
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-primary/20">
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-primary">$22.9M+</p>
                <p className="text-sm text-muted-foreground">Total Value Locked</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-secondary">353+</p>
                <p className="text-sm text-muted-foreground">ZK-Verified Blocks</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-primary">60 BTC</p>
                <p className="text-sm text-muted-foreground">Total Mined</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 rounded-3xl blur-2xl" />
              
              <div className="relative rounded-3xl overflow-hidden border border-primary/30 gold-glow">
                {!imgError ? (
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0155-JjwVFPGbLK8yCoQLiGFKs2JnWqlMUF.jpeg"
                    alt="UnicornOS SphinxQASI Oracle"
                    width={600}
                    height={600}
                    className="w-full h-auto"
                    priority
                    unoptimized
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full aspect-square bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/20 flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                      <p className="text-xl font-bold text-primary">SphinxQASI Oracle</p>
                      <p className="text-sm text-muted-foreground">UnicornOS</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 md:-right-8 px-4 py-2 bg-card border border-secondary/50 rounded-xl shadow-lg"
              >
                <p className="text-sm font-bold text-secondary">VERIFIED</p>
                <p className="text-xs text-muted-foreground">ZK-SNARK Proof</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
