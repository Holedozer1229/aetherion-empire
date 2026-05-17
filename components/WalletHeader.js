"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

export function WalletHeader() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <header className="w-full border-b border-cyan-500/20 bg-black/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            ⬡ AETHERION EMPIRE
          </div>
          <div className="text-xs text-cyan-400/60 font-mono">v2.0 | Ξ SOVEREIGNTY</div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isConnected ? (
            <div className="flex gap-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-black font-bold border border-cyan-400/50 shadow-lg shadow-cyan-500/50"
                  size="sm"
                >
                  Connect {connector.name}
                </Button>
              ))}
            </div>
          ) : (
            <>
              {chain && (
                <div className="px-3 py-1 bg-cyan-950/50 border border-cyan-500/30 rounded text-cyan-300 text-xs font-mono">
                  {chain.name}
                </div>
              )}
              <div className="px-3 py-1 bg-emerald-950/50 border border-emerald-500/30 rounded text-emerald-300 text-xs font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <Button
                onClick={() => disconnect()}
                variant="destructive"
                size="sm"
              >
                Disconnect
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
