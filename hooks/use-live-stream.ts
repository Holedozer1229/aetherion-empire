"use client";

import { useEffect, useState, useCallback } from "react";

interface UseLiveStreamOptions {
  channel: "mining" | "oracle" | "bounty" | "wingman" | "bitcoin" | "genesis";
  onData?: (data: any) => void;
  interval?: number;
}

const CHANNEL_ENDPOINTS: Record<string, string> = {
  mining: "/api/mining",
  oracle: "/api/oracle?word=heartbeat",
  bounty: "/api/bounty",
  wingman: "/api/wingman?action=status",
  bitcoin: "/api/bitcoin",
  genesis: "/api/genesis?action=verify",
};

export function useLiveStream({ channel, onData, interval = 10000 }: UseLiveStreamOptions) {
  const [data, setData] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const endpoint = CHANNEL_ENDPOINTS[channel];
    if (!endpoint) return;

    try {
      const res = await fetch(endpoint);
      const json = await res.json();
      
      if (json.success !== false) {
        const streamData = {
          channel,
          timestamp: new Date().toISOString(),
          data: transformChannelData(channel, json),
        };
        setData(streamData);
        setConnected(true);
        setError(null);
        onData?.(streamData);
      }
    } catch (err) {
      console.error(`[v0] Stream fetch failed for ${channel}:`, err);
      setError(err instanceof Error ? err.message : "Fetch failed");
      setConnected(false);
    }
  }, [channel, onData]);

  useEffect(() => {
    fetchData();
    const pollInterval = setInterval(fetchData, interval);
    return () => clearInterval(pollInterval);
  }, [fetchData, interval]);

  return { data, connected, error };
}

function transformChannelData(channel: string, json: any): any {
  switch (channel) {
    case "mining":
      return {
        status: "ACTIVE",
        ethereum: { block: json.mining?.ethereum_block || 0 },
        solana: { slot: json.mining?.solana_slot || 0 },
      };
    case "oracle":
      return {
        status: json.oracle?.status || "ACTIVE",
        phi: json.consciousness?.phi_metric || 0.618,
        resonance: json.consciousness?.resonance || "STABLE",
      };
    case "bounty":
      return {
        status: json.bounty_hunter?.status || "ACTIVE",
        targets: json.active_targets?.length || 0,
      };
    case "wingman":
      return {
        status: json.wingman?.active ? "ACTIVE" : "IDLE",
        opportunities: json.opportunities?.length || 0,
        uptime: json.wingman?.uptime || 99.97,
      };
    case "bitcoin":
      return {
        height: json.bitcoin?.block_height || 0,
        utxos: json.bitcoin?.utxos?.count || 0,
      };
    case "genesis":
      return {
        verified: json.success || false,
        signature: json.genesis?.signature_hex?.slice(0, 16) || "---",
      };
    default:
      return json;
  }
}
