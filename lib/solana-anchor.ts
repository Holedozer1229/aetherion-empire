import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Solana RPC Endpoints - mainnet-beta with fallbacks
const SOLANA_RPC_ENDPOINTS = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-mainnet.g.alchemy.com/v2/demo",
  "https://rpc.ankr.com/solana",
];

// Mempool fallback for fee estimation
const MEMPOOL_API = "https://mempool.space/api";

// Known addresses
export const AETHERION_TREASURY = "AETHRNxYjJfqDNVypCd7n8HjLXpvgvGpLcHCpLfDsGGz"; // Example
export const GENESIS_MINT = "So11111111111111111111111111111111111111112"; // Wrapped SOL

interface SolanaStats {
  slot: number;
  blockHeight: number;
  epochInfo: {
    epoch: number;
    slotIndex: number;
    slotsInEpoch: number;
    absoluteSlot: number;
  };
  tps: number;
  totalSupply: number;
  circulatingSupply: number;
}

interface AccountBalance {
  address: string;
  lamports: number;
  sol: number;
}

interface TransactionInfo {
  signature: string;
  slot: number;
  blockTime: number | null;
  fee: number;
  status: "success" | "failed";
}

// Create connection with fallback
export async function createConnection(): Promise<Connection> {
  for (const endpoint of SOLANA_RPC_ENDPOINTS) {
    try {
      const connection = new Connection(endpoint, "confirmed");
      // Test the connection
      await connection.getSlot();
      return connection;
    } catch {
      continue;
    }
  }
  // Final fallback to cluster API
  return new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
}

// Fetch current slot and block height
export async function fetchSolanaStats(): Promise<SolanaStats | null> {
  try {
    const connection = await createConnection();
    
    const [slot, blockHeight, epochInfo, perfSamples, supply] = await Promise.all([
      connection.getSlot(),
      connection.getBlockHeight(),
      connection.getEpochInfo(),
      connection.getRecentPerformanceSamples(1),
      connection.getSupply(),
    ]);

    // Calculate TPS from performance samples
    const tps = perfSamples.length > 0 
      ? Math.round(perfSamples[0].numTransactions / perfSamples[0].samplePeriodSecs)
      : 0;

    return {
      slot,
      blockHeight,
      epochInfo: {
        epoch: epochInfo.epoch,
        slotIndex: epochInfo.slotIndex,
        slotsInEpoch: epochInfo.slotsInEpoch,
        absoluteSlot: epochInfo.absoluteSlot,
      },
      tps,
      totalSupply: supply.value.total / LAMPORTS_PER_SOL,
      circulatingSupply: supply.value.circulating / LAMPORTS_PER_SOL,
    };
  } catch (err) {
    console.error("[solana] Failed to fetch stats:", err);
    return null;
  }
}

// Fetch account balance
export async function fetchAccountBalance(address: string): Promise<AccountBalance | null> {
  try {
    const connection = await createConnection();
    const pubkey = new PublicKey(address);
    const lamports = await connection.getBalance(pubkey);
    
    return {
      address,
      lamports,
      sol: lamports / LAMPORTS_PER_SOL,
    };
  } catch (err) {
    console.error("[solana] Failed to fetch balance:", err);
    return null;
  }
}

// Fetch recent transactions for an address
export async function fetchRecentTransactions(
  address: string,
  limit: number = 10
): Promise<TransactionInfo[]> {
  try {
    const connection = await createConnection();
    const pubkey = new PublicKey(address);
    
    const signatures = await connection.getSignaturesForAddress(pubkey, { limit });
    
    return signatures.map((sig) => ({
      signature: sig.signature,
      slot: sig.slot,
      blockTime: sig.blockTime,
      fee: 0, // Would need to fetch full tx for fee
      status: sig.err ? "failed" : "success",
    }));
  } catch (err) {
    console.error("[solana] Failed to fetch transactions:", err);
    return [];
  }
}

// Fetch current SOL price from CoinGecko
export async function fetchSolPrice(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { headers: { Accept: "application/json" }, next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.solana?.usd ?? null;
  } catch {
    return null;
  }
}

// Mempool fallback for Bitcoin fee estimation when Solana is the context
export async function fetchMempoolFallback() {
  try {
    const [fees, blockHeight, mempoolInfo] = await Promise.all([
      fetch(`${MEMPOOL_API}/v1/fees/recommended`).then(r => r.ok ? r.json() : null),
      fetch(`${MEMPOOL_API}/blocks/tip/height`).then(r => r.ok ? r.text() : null),
      fetch(`${MEMPOOL_API}/mempool`).then(r => r.ok ? r.json() : null),
    ]);

    return {
      btc: {
        fees: fees || { fastestFee: 10, halfHourFee: 8, hourFee: 5 },
        blockHeight: blockHeight ? parseInt(blockHeight, 10) : null,
        mempoolSize: mempoolInfo?.count ?? null,
        mempoolVsize: mempoolInfo?.vsize ?? null,
      },
    };
  } catch {
    return {
      btc: {
        fees: { fastestFee: 10, halfHourFee: 8, hourFee: 5 },
        blockHeight: null,
        mempoolSize: null,
        mempoolVsize: null,
      },
    };
  }
}

// Anchor program interface (for future program interactions)
export interface AnchorProgramConfig {
  programId: string;
  idl: object;
}

// Placeholder for Anchor program loading
export async function loadAnchorProgram(config: AnchorProgramConfig) {
  // In a real implementation, this would load the Anchor program
  // using @coral-xyz/anchor's Program class
  return {
    programId: config.programId,
    loaded: true,
    methods: {},
  };
}

// Validate Solana address
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

// Format lamports to SOL with proper decimals
export function formatSol(lamports: number, decimals: number = 4): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(decimals);
}
