import { NextResponse } from "next/server";

const INFURA_RPC = process.env.INFURA_API_KEY
  ? `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
  : "https://eth-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY;

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

const VAULTS = {
  eth: "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20",
  sol: "3a5W4NmDavSbivQ2UAxRGe4Np5YYcRVPN3uM4St7YZ2z",
};

interface EthBlock {
  number: string;
  baseFeePerGas?: string;
  gasUsed: string;
  miner: string;
  timestamp: string;
}

async function getEthBlockData(): Promise<EthBlock | null> {
  try {
    const res = await fetch(INFURA_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: ["latest", false],
        id: 1,
      }),
    });
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error("[v0] ETH block fetch failed:", err);
    return null;
  }
}

async function getEthGasPrice(): Promise<string | null> {
  try {
    const res = await fetch(INFURA_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_gasPrice",
        params: [],
        id: 1,
      }),
    });
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error("[v0] ETH gas price fetch failed:", err);
    return null;
  }
}

async function getSolanaSlot(): Promise<number | null> {
  try {
    const res = await fetch(SOLANA_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "getSlot",
        params: [],
        id: 1,
      }),
    });
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error("[v0] Solana slot fetch failed:", err);
    return null;
  }
}

async function getEthBalance(address: string): Promise<string | null> {
  try {
    const res = await fetch(INFURA_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1,
      }),
    });
    const data = await res.json();
    return data.result ? (BigInt(data.result) / BigInt(10 ** 18)).toString() : null;
  } catch (err) {
    console.error("[v0] ETH balance fetch failed:", err);
    return null;
  }
}

export async function GET() {
  const [ethBlock, gasPrice, solSlot, ethBalance] = await Promise.all([
    getEthBlockData(),
    getEthGasPrice(),
    getSolanaSlot(),
    getEthBalance(VAULTS.eth),
  ]);

  const blockNum = ethBlock ? parseInt(ethBlock.number) : 0;
  const gasPriceGwei = gasPrice ? (BigInt(gasPrice) / BigInt(10 ** 9)).toString() : "0";

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    mainnet: {
      ethereum: {
        current_block: blockNum,
        gas_price_gwei: gasPriceGwei,
        vault_address: VAULTS.eth,
        vault_balance_eth: ethBalance,
        network: "MAINNET",
      },
      solana: {
        current_slot: solSlot,
        vault_address: VAULTS.sol,
        network: "MAINNET",
      },
    },
    rpc_endpoints: {
      eth: INFURA_RPC.split("/").slice(0, 3).join("/") + "/v3/***",
      sol: SOLANA_RPC,
    },
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
