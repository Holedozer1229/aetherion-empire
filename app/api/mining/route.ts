import { NextResponse } from "next/server";

// Use Cloudflare's free public ETH RPC when no key is configured
const ETH_RPC = process.env.INFURA_API_KEY
  ? `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
  : process.env.ALCHEMY_API_KEY
  ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  : "https://cloudflare-eth.com";

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

const VAULTS = {
  eth: "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20",
  sol: "3a5W4NmDavSbivQ2UAxRGe4Np5YYcRVPN3uM4St7YZ2z",
};

async function rpcCall(url: string, method: string, params: unknown[] = []): Promise<unknown> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
      signal: AbortSignal.timeout(5000),
    });
    const ct = res.headers.get("content-type") ?? "";
    if (!res.ok || !ct.includes("application/json")) return null;
    const data = await res.json();
    return data?.result ?? null;
  } catch {
    return null;
  }
}

async function getEthBlockData() {
  const result = await rpcCall(ETH_RPC, "eth_getBlockByNumber", ["latest", false]);
  if (!result || typeof result !== "object") return null;
  const block = result as Record<string, string>;
  return {
    number: parseInt(block.number ?? "0x0", 16),
    baseFeePerGas: block.baseFeePerGas
      ? (parseInt(block.baseFeePerGas, 16) / 1e9).toFixed(2)
      : null,
    gasUsed: parseInt(block.gasUsed ?? "0x0", 16),
    miner: block.miner ?? null,
    timestamp: block.timestamp ? new Date(parseInt(block.timestamp, 16) * 1000).toISOString() : null,
  };
}

async function getEthGasPrice(): Promise<string | null> {
  const result = await rpcCall(ETH_RPC, "eth_gasPrice");
  if (!result || typeof result !== "string") return null;
  return (parseInt(result, 16) / 1e9).toFixed(2);
}

async function getEthBalance(address: string): Promise<string | null> {
  const result = await rpcCall(ETH_RPC, "eth_getBalance", [address, "latest"]);
  if (!result || typeof result !== "string") return null;
  return (parseInt(result, 16) / 1e18).toFixed(6);
}

async function getSolanaSlot(): Promise<number | null> {
  const result = await rpcCall(SOLANA_RPC, "getSlot");
  return typeof result === "number" ? result : null;
}

export async function GET() {
  const [ethBlock, gasPrice, solSlot, ethBalance] = await Promise.all([
    getEthBlockData(),
    getEthGasPrice(),
    getSolanaSlot(),
    getEthBalance(VAULTS.eth),
  ]);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    mainnet: {
      ethereum: {
        current_block: ethBlock?.number ?? null,
        gas_price_gwei: gasPrice ?? null,
        base_fee_gwei: ethBlock?.baseFeePerGas ?? null,
        miner: ethBlock?.miner ?? null,
        block_timestamp: ethBlock?.timestamp ?? null,
        vault_address: VAULTS.eth,
        vault_balance_eth: ethBalance ?? null,
        network: "MAINNET",
      },
      solana: {
        current_slot: solSlot ?? null,
        vault_address: VAULTS.sol,
        network: "MAINNET",
      },
    },
    rpc_endpoint: ETH_RPC.replace(/\/v[23]\/[^/]+$/, "/v3/***"),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action } = body;

  if (action === "get_eth_balance") {
    const balance = await getEthBalance(VAULTS.eth);
    return NextResponse.json({
      success: true,
      vault: VAULTS.eth,
      balance_eth: balance,
      network: "MAINNET",
    });
  }

  return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
}
