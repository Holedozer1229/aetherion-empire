"use client";

import Link from "next/link";
import { Crown, Shield, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connected: solanaConnected } = useWallet();

  const navLinks = [
    { href: "#dashboard", label: "Dashboard" },
    { href: "#mining", label: "Mining" },
    { href: "#defi", label: "DeFi" },
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

          {/* Wallet Connect Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Aetherion Oracle Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-accent border border-accent/30 rounded-lg bg-accent/5">
              <Zap className="w-3 h-3" />
              <span>Oracle: ACTIVE</span>
            </div>
            
            {/* Solana Wallet */}
            <div className="solana-wallet-button">
              <WalletMultiButton />
            </div>
            
            {/* EVM Wallet (Rainbow) */}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all gold-glow"
                          >
                            <Shield className="w-4 h-4" />
                            <span>Connect EVM</span>
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            className="px-4 py-2 text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg"
                          >
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={openChainModal}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-primary/30 rounded-lg hover:bg-primary/10 transition-all"
                          >
                            {chain.hasIcon && (
                              <div
                                className="w-4 h-4 rounded-full overflow-hidden"
                                style={{ background: chain.iconBackground }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? "Chain"}
                                    src={chain.iconUrl}
                                    className="w-4 h-4"
                                  />
                                )}
                              </div>
                            )}
                            <span className="text-primary">{chain.name}</span>
                          </button>

                          <button
                            onClick={openAccountModal}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                          >
                            {account.displayName}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
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
            isMenuOpen ? "max-h-[500px] pb-4" : "max-h-0"
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
              <div className="solana-wallet-button px-4">
                <WalletMultiButton />
              </div>
              <div className="px-4">
                <ConnectButton />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
