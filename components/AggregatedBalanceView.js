"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { Card } from "@/components/ui/card";
import { formatEther } from "viem";
import { Bitcoin, Coins, RefreshCw } from "lucide-react";
import { base } from "wagmi/chains";

const EVM_ANCHORS = [
  { address: '0x6bC82AD9382e00c113676A49eaB09b4d47cA0E16', name: 'Sovereign Anchor' },
  { address: '0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20', name: 'Worker Node' },
  { address: '0x58e1886E52A11198981C214B58a4FB87465AC9D1', name: 'SKYNT Interface' },
];

const BTC_ANCHORS = [
  { address: 'bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal', name: 'Primary Anchor', balance: 0 },
  { address: 'bc1pt5zrlm55lmfwq7sjsuzgpgkmm7fymkna375l8kyuu5p6cq77545q554mgr', name: 'Core Reserve', balance: 4.48 },
  { address: '1KT3zCYUrmQxjcveUNs1Rs7WcXDcPQZ4av', name: 'Genesis Anchor', balance: 0 },
  { address: 'bc1qvsgjq7atxz4eakr7tzzmskqj233x27v6y70pzn', name: 'Secondary Reserve', balance: 0 },
];

const EXCAL_TOKEN = {
  address: '0xBEBB2Ca472a5B8334e03d5f0E7dEbcb071750259',
  symbol: 'EXCAL',
  decimals: 18,
};

function EVMAddressBalance({ address, name }) {
  const { data, isLoading } = useBalance({
    address: address,
    chainId: base.id,
  });

  return (
    <div className="flex justify-between items-center py-2 px-4 bg-cyan-950/20 rounded border border-cyan-500/20">
      <div>
        <div className="text-xs text-cyan-400 font-mono">{name}</div>
        <div className="text-xs text-cyan-700 font-mono truncate max-w-[200px]">{address}</div>
      </div>
      <div className="text-right">
        {isLoading ? (
          <div className="text-sm text-cyan-500 animate-pulse">...</div>
        ) : data ? (
          <div className="text-sm font-mono text-cyan-300">
            {parseFloat(formatEther(data.value)).toFixed(6)} {data.symbol}
          </div>
        ) : (
          <div className="text-sm text-cyan-600">0.000000</div>
        )}
      </div>
    </div>
  );
}

function BTCAddressDisplay({ address, name, balance }) {
  return (
    <div className="flex justify-between items-center py-2 px-4 bg-amber-950/20 rounded border border-amber-500/20">
      <div>
        <div className="text-xs text-amber-400 font-mono">{name}</div>
        <div className="text-xs text-amber-700 font-mono truncate max-w-[200px]">{address}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-mono text-amber-300">
          {balance.toFixed(8)} ₿
        </div>
      </div>
    </div>
  );
}

export function AggregatedBalanceView() {
  const { isConnected } = useAccount();
  const [btcPrice, setBtcPrice] = useState(null);
  const [manifest, setManifest] = useState(null);

  useEffect(() => {
    fetch('/api/btc-price')
      .then(res => res.json())
      .then(data => setBtcPrice(data.price))
      .catch(err => console.error(err));

    fetch('/empire_manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(err => console.error(err));
  }, []);

  const totalBTC = BTC_ANCHORS.reduce((sum, anchor) => sum + anchor.balance, 0);
  const totalBTCValueUSD = btcPrice ? totalBTC * btcPrice : 0;

  const phi = 1.618;
  const baseSize = 16;

  return (
    <Card 
      className="border-2 border-cyan-500/30 bg-gradient-to-br from-black via-cyan-950/20 to-emerald-950/20 backdrop-blur-xl overflow-hidden relative"
      style={{ padding: `${baseSize * phi}px` }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: `${baseSize * phi}px ${baseSize * phi}px`
        }}></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Coins className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-300 tracking-wider">
              ⚡ AGGREGATED MULTI-CHAIN HOARD
            </h2>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-cyan-400 hover:text-cyan-300 transition-colors p-2 hover:bg-cyan-500/10 rounded-lg"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* BTC Anchors */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Bitcoin className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-amber-300">BTC ANCHORS ({BTC_ANCHORS.length})</h3>
          </div>
          <div className="space-y-2 mb-4">
            {BTC_ANCHORS.map((anchor) => (
              <BTCAddressDisplay key={anchor.address} {...anchor} />
            ))}
          </div>
          <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-sm text-amber-500/70 font-mono">TOTAL BTC BALANCE</div>
              <div>
                <div className="text-2xl font-bold font-mono text-amber-300">
                  {totalBTC.toFixed(8)} ₿
                </div>
                {btcPrice && (
                  <div className="text-sm text-amber-600 font-mono text-right">
                    ≈ ${totalBTCValueUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* EVM Anchors */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-cyan-300">EVM ANCHORS - BASE CHAIN ({EVM_ANCHORS.length})</h3>
          </div>
          <div className="space-y-2">
            {EVM_ANCHORS.map((anchor) => (
              <EVMAddressBalance key={anchor.address} {...anchor} />
            ))}
          </div>
          {!isConnected && (
            <div className="mt-4 p-3 bg-cyan-950/30 border border-cyan-500/20 rounded text-center">
              <p className="text-xs text-cyan-500/70 font-mono">
                ⚡ Connect wallet to view real-time balances
              </p>
            </div>
          )}
        </div>

        {/* EXCAL Token Section */}
        <div className="mt-8 pt-6 border-t border-cyan-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-300">EXCAL TOKEN (BASE)</h3>
          </div>
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded">
            <div className="text-xs text-emerald-600 font-mono">
              Token: {EXCAL_TOKEN.address}
            </div>
            <div className="text-xs text-emerald-700 font-mono mt-1">
              * Token balance tracking: Integration pending
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Zap({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
