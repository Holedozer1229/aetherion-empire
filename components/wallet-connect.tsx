"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAccount, useBalance } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function WalletConnect() {
  const [activeTab, setActiveTab] = useState<"evm" | "solana">("evm");
  const [copied, setCopied] = useState(false);
  const { address: evmAddress, isConnected: evmConnected } = useAccount();
  const { publicKey: solanaKey, connected: solanaConnected } = useWallet();

  const { data: evmBalance } = useBalance({
    address: evmAddress,
  });

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {/* Tab Selector */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab("evm")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "evm"
              ? "bg-primary text-background"
              : "bg-card/50 text-muted-foreground hover:bg-card"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">⟠</span>
            EVM Chains
          </div>
        </button>
        <button
          onClick={() => setActiveTab("solana")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "solana"
              ? "bg-accent text-background"
              : "bg-card/50 text-muted-foreground hover:bg-card"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">◎</span>
            Solana
          </div>
        </button>
      </div>

      {/* Connection Panel */}
      <AnimatePresence mode="wait">
        {activeTab === "evm" ? (
          <motion.div
            key="evm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel p-4 rounded-xl border border-primary/30"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  MetaMask / RainbowKit
                </span>
              </div>
              <Zap className="w-4 h-4 text-accent animate-pulse" />
            </div>

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
                            className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-background font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                          >
                            <Wallet className="w-5 h-5" />
                            Connect EVM Wallet
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            className="w-full px-4 py-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold rounded-lg transition-all"
                          >
                            Wrong Network
                          </button>
                        );
                      }

                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={openChainModal}
                              className="flex items-center gap-2 px-3 py-1.5 bg-card/50 rounded-lg hover:bg-card transition-all"
                            >
                              {chain.hasIcon && chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain"}
                                  src={chain.iconUrl}
                                  className="w-5 h-5 rounded-full"
                                />
                              )}
                              <span className="text-sm">{chain.name}</span>
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={openAccountModal}
                              className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 rounded-lg hover:bg-primary/30 transition-all"
                            >
                              <span className="text-sm font-mono">
                                {account.displayName}
                              </span>
                              {account.displayBalance && (
                                <span className="text-xs text-muted-foreground">
                                  ({account.displayBalance})
                                </span>
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-2 p-2 bg-card/30 rounded-lg">
                            <span className="text-xs font-mono text-muted-foreground truncate flex-1">
                              {account.address}
                            </span>
                            <button
                              onClick={() => copyAddress(account.address)}
                              className="p-1 hover:bg-card rounded transition-all"
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <a
                              href={`https://etherscan.io/address/${account.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-card rounded transition-all"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </motion.div>
        ) : (
          <motion.div
            key="solana"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel p-4 rounded-xl border border-accent/30"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">
                  Phantom / Solflare
                </span>
              </div>
              <Zap className="w-4 h-4 text-primary animate-pulse" />
            </div>

            <div className="solana-wallet-button">
              <WalletMultiButton />
            </div>

            {solanaConnected && solanaKey && (
              <div className="mt-3 flex items-center gap-2 p-2 bg-card/30 rounded-lg">
                <span className="text-xs font-mono text-muted-foreground truncate flex-1">
                  {solanaKey.toBase58()}
                </span>
                <button
                  onClick={() => copyAddress(solanaKey.toBase58())}
                  className="p-1 hover:bg-card rounded transition-all"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={`https://solscan.io/account/${solanaKey.toBase58()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-card rounded transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
