"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";

export function WalletHeader() {
  return (
    <header className="w-full border-b border-cyan-500/20 bg-black/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            ⬡ AETHERION EMPIRE
          </div>
          <div className="text-xs text-cyan-400/60 font-mono">v2.0 | Ξ SOVEREIGNTY</div>
        </div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              authenticationStatus !== "unauthenticated";

            if (!connected) {
              return (
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-black font-bold border border-cyan-400/50 shadow-lg shadow-cyan-500/50"
                  size="sm"
                  onClick={openConnectModal}
                >
                  INITIATE CONNECTION
                </Button>
              );
            }

            if (chain.unsupported) {
              return (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={openChainModal}
                  className="animate-pulse"
                >
                  ⚠ INVALID NETWORK
                </Button>
              );
            }

            return (
              <div className="flex items-center gap-2">
                <Button
                  className="bg-cyan-950/50 border border-cyan-500/30 hover:bg-cyan-900/50 text-cyan-300"
                  size="sm"
                  onClick={openChainModal}
                >
                  {chain.iconUrl && (
                    <img
                      alt={chain.name ?? "Chain icon"}
                      src={chain.iconUrl}
                      className="mr-2 h-4 w-4 rounded-full"
                    />
                  )}
                  <span className="font-mono text-xs">{chain.name}</span>
                </Button>
                <Button
                  className="bg-gradient-to-r from-emerald-950 to-cyan-950 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-300"
                  size="sm"
                  onClick={openAccountModal}
                >
                  <span className="mr-2 font-mono text-xs">
                    {account.displayName}
                  </span>
                  {account.displayBalance && (
                    <span className="text-xs text-cyan-300">
                      {account.displayBalance}
                    </span>
                  )}
                </Button>
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  );
}
