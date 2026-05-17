"use client";

import { useAccount, useBalance } from "wagmi";
import { Card } from "@/components/ui/card";
import { formatEther } from "viem";
import { RefreshCw } from "lucide-react";

export function BalancePanel() {
  const { address, chain, status } = useAccount();
  const chainId = chain?.id;

  const { data, isLoading, isError, refetch } = useBalance({
    address,
    chainId,
    enabled: !!address && !!chainId,
    watch: true,
  });

  if (status === "disconnected") {
    return (
      <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-emerald-950/30 p-8 backdrop-blur-sm">
        <div className="text-center text-cyan-400/60 font-mono text-sm">
          ⬡ INITIATE WALLET CONNECTION TO VIEW ANCHOR BALANCE
        </div>
      </Card>
    );
  }

  const phi = 1.618;
  const baseSize = 16;

  return (
    <Card 
      className="border-2 border-cyan-500/30 bg-gradient-to-br from-black via-cyan-950/20 to-emerald-950/20 backdrop-blur-xl overflow-hidden relative"
      style={{ padding: `${baseSize * phi}px` }}
    >
      {/* Cybernetic grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: `${baseSize * phi}px ${baseSize * phi}px`
        }}></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-cyan-300 mb-1 tracking-wider">
              ⬢ ETH ANCHOR BALANCE
            </h2>
            <p className="text-xs text-cyan-500/70 font-mono">
              {chain ? `${chain.name} Network` : "Unknown Dimension"}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="text-cyan-400 hover:text-cyan-300 transition-colors p-2 hover:bg-cyan-500/10 rounded-lg"
            title="Refresh balance"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-8 mb-6">
          {isLoading && (
            <div className="text-4xl font-mono text-cyan-400 animate-pulse">
              LOADING...
            </div>
          )}
          {isError && (
            <div className="text-2xl text-red-400 font-mono">
              ⚠ ERROR FETCHING BALANCE
            </div>
          )}
          {!isLoading && !isError && data && (
            <div>
              <div className="text-5xl font-bold font-mono bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                {parseFloat(formatEther(data.value)).toFixed(6)}
              </div>
              <div className="text-2xl text-cyan-500 font-mono mt-2">
                {data.symbol}
              </div>
            </div>
          )}
        </div>

        {address && (
          <div className="mt-6 pt-4 border-t border-cyan-500/20">
            <p className="text-xs text-cyan-600 font-mono break-all">
              ADDRESS: {address}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
