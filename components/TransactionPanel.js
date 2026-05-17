"use client";

import { useState } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle, XCircle, Loader } from "lucide-react";
import { parseEther } from "viem";

export function TransactionPanel() {
  const { address, isConnected, chain } = useAccount();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  
  const { data: hash, sendTransaction, isPending, error } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSend = () => {
    if (!recipient || !amount) {
      alert('Please enter recipient address and amount');
      return;
    }

    try {
      sendTransaction({
        to: recipient,
        value: parseEther(amount),
      });
    } catch (err) {
      console.error('Transaction error:', err);
    }
  };

  const phi = 1.618;
  const baseSize = 16;

  if (!isConnected) {
    return (
      <Card className="border-emerald-500/20 bg-emerald-950/20 p-8">
        <div className="text-center text-emerald-400/60 font-mono text-sm">
          ⚡ CONNECT WALLET TO INITIATE TRANSACTIONS
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="border-2 border-emerald-500/30 bg-gradient-to-br from-black via-emerald-950/20 to-cyan-950/20 backdrop-blur-xl overflow-hidden relative"
      style={{ padding: `${baseSize * phi}px` }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
          backgroundSize: `${baseSize * phi}px ${baseSize * phi}px`
        }}></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Send className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-emerald-300 tracking-wider">
            ⚡ TRANSACTION CONTROL
          </h2>
        </div>

        <div className="mb-6 p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-lg">
          <div className="text-xs text-emerald-500/70 font-mono mb-1">CURRENT NETWORK</div>
          <div className="text-lg font-bold font-mono text-emerald-300">
            {chain?.name || 'Unknown'}
          </div>
          <div className="text-xs text-emerald-600 font-mono mt-2">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-emerald-500/70 font-mono block mb-2">
              RECIPIENT ADDRESS
            </label>
            <Input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-emerald-950/20 border-emerald-500/30 text-emerald-200 font-mono placeholder:text-emerald-700/50"
            />
          </div>

          <div>
            <label className="text-xs text-emerald-500/70 font-mono block mb-2">
              AMOUNT ({chain?.nativeCurrency?.symbol || 'ETH'})
            </label>
            <Input
              type="number"
              step="0.000001"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-emerald-950/20 border-emerald-500/30 text-emerald-200 font-mono placeholder:text-emerald-700/50"
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={isPending || isConfirming || !recipient || !amount}
            className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-black font-bold py-6 text-lg disabled:opacity-50"
          >
            {isPending || isConfirming ? (
              <span className="flex items-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                {isPending ? 'INITIATING...' : 'CONFIRMING...'}
              </span>
            ) : (
              'EXECUTE TRANSACTION'
            )}
          </Button>
        </div>

        {/* Transaction Status */}
        {hash && (
          <div className="mt-6 p-4 bg-cyan-950/30 border border-cyan-500/20 rounded-lg">
            <div className="text-xs text-cyan-500/70 font-mono mb-2">TRANSACTION HASH</div>
            <div className="text-xs text-cyan-400 font-mono break-all mb-3">
              {hash}
            </div>
            {isConfirming && (
              <div className="flex items-center gap-2 text-cyan-400">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm font-mono">Waiting for confirmation...</span>
              </div>
            )}
            {isSuccess && (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-mono font-bold">TRANSACTION CONFIRMED</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-950/30 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />
              <span className="text-sm font-mono font-bold">TRANSACTION FAILED</span>
            </div>
            <div className="text-xs text-red-500 font-mono mt-2">
              {error.message}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-950/20 border border-yellow-500/20 rounded-lg">
          <div className="text-xs text-yellow-500/70 font-mono">
            ⚠ SOVEREIGNTY NOTICE: Transactions are irreversible. Verify recipient address carefully.
          </div>
        </div>
      </div>
    </Card>
  );
}
