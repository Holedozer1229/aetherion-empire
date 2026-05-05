"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown, Shield, Wallet, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#dashboard", label: "Dashboard" },
    { href: "#mining", label: "Mining" },
    { href: "#audit", label: "Audit" },
    { href: "#payouts", label: "Payouts" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-glow" />
              <Crown className="w-full h-full text-primary p-1" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-gold-gradient tracking-wider">
                LUCKY PALACE
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground tracking-widest">
                QUANTUM WEB3 PROTOCOL
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-all">
              <Shield className="w-4 h-4" />
              <span>Verify</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all gold-glow">
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-primary"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-primary/20">
              <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg">
                <Shield className="w-4 h-4" />
                <span>Verify</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg">
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
