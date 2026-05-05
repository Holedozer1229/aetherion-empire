import { NextRequest, NextResponse } from "next/server";

const PAYOUT_ADDRESS = "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20";
const GENESIS_ADDRESS = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
const GENESIS_COINBASE_TXID = "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b";

const API_BASE = "https://mempool.space/api";

interface UTXO {
  txid: string;
  vout: number;
  value: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_time?: number;
  };
}

async function fetchSpendableUtxos(address: string): Promise<UTXO[]> {
  try {
    const res = await fetch(`${API_BASE}/address/${address}/utxo`, {
      headers: { Accept: "application/json" },
    });
    
    if (!res.ok) {
      throw new Error(`Mempool API error: ${res.status}`);
    }
    
    const data: UTXO[] = await res.json();
    
    // Exclude the unspendable genesis coinbase
    return data.filter(
      (utxo) => !(utxo.txid === GENESIS_COINBASE_TXID && utxo.vout === 0)
    );
  } catch (err) {
    console.error("[v0] Failed to fetch UTXOs:", err);
    return [];
  }
}

async function fetchAddressInfo(address: string) {
  try {
    const res = await fetch(`${API_BASE}/address/${address}`, {
      headers: { Accept: "application/json" },
    });
    
    if (!res.ok) {
      throw new Error(`Mempool API error: ${res.status}`);
    }
    
    return await res.json();
  } catch (err) {
    console.error("[v0] Failed to fetch address info:", err);
    return null;
  }
}

async function fetchCurrentFeeRates() {
  try {
    const res = await fetch(`${API_BASE}/v1/fees/recommended`, {
      headers: { Accept: "application/json" },
    });
    
    if (!res.ok) {
      throw new Error(`Mempool API error: ${res.status}`);
    }
    
    return await res.json();
  } catch (err) {
    console.error("[v0] Failed to fetch fee rates:", err);
    return { fastestFee: 10, halfHourFee: 8, hourFee: 5, minimumFee: 1 };
  }
}

async function fetchBlockHeight() {
  try {
    const res = await fetch(`${API_BASE}/blocks/tip/height`, {
      headers: { Accept: "application/json" },
    });
    
    if (!res.ok) {
      throw new Error(`Mempool API error: ${res.status}`);
    }
    
    const height = await res.text();
    return parseInt(height, 10);
  } catch (err) {
    console.error("[v0] Failed to fetch block height:", err);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const address = searchParams.get("address") || GENESIS_ADDRESS;

  if (action === "utxos") {
    const utxos = await fetchSpendableUtxos(address);
    const totalValue = utxos.reduce((acc, u) => acc + u.value, 0);
    
    return NextResponse.json({
      success: true,
      address,
      utxos,
      count: utxos.length,
      total_sats: totalValue,
      total_btc: (totalValue / 100000000).toFixed(8),
      network: "MAINNET",
      timestamp: new Date().toISOString(),
    });
  }

  if (action === "fees") {
    const fees = await fetchCurrentFeeRates();
    
    return NextResponse.json({
      success: true,
      fees,
      network: "MAINNET",
      timestamp: new Date().toISOString(),
    });
  }

  if (action === "block_height") {
    const height = await fetchBlockHeight();
    
    return NextResponse.json({
      success: true,
      block_height: height,
      network: "MAINNET",
      timestamp: new Date().toISOString(),
    });
  }

  // Default: return all Bitcoin mainnet data
  const [utxos, addressInfo, fees, blockHeight] = await Promise.all([
    fetchSpendableUtxos(address),
    fetchAddressInfo(address),
    fetchCurrentFeeRates(),
    fetchBlockHeight(),
  ]);

  const totalValue = utxos.reduce((acc, u) => acc + u.value, 0);

  return NextResponse.json({
    success: true,
    bitcoin: {
      address,
      utxos: {
        count: utxos.length,
        total_sats: totalValue,
        total_btc: (totalValue / 100000000).toFixed(8),
        spendable: utxos,
      },
      address_info: addressInfo,
      fees,
      block_height: blockHeight,
    },
    payout_address_eth: PAYOUT_ADDRESS,
    network: "MAINNET",
    api: "mempool.space",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, address } = body;

  if (action === "scan_utxos") {
    const targetAddress = address || GENESIS_ADDRESS;
    const utxos = await fetchSpendableUtxos(targetAddress);
    const totalValue = utxos.reduce((acc, u) => acc + u.value, 0);

    return NextResponse.json({
      success: true,
      action: "scan_utxos",
      address: targetAddress,
      result: {
        utxos,
        count: utxos.length,
        total_sats: totalValue,
        total_btc: (totalValue / 100000000).toFixed(8),
      },
      network: "MAINNET",
      timestamp: new Date().toISOString(),
    });
  }

  if (action === "estimate_fee") {
    const fees = await fetchCurrentFeeRates();
    const txSize = body.tx_size || 250; // Default P2PKH tx size
    
    return NextResponse.json({
      success: true,
      action: "estimate_fee",
      fees: {
        fastest: {
          rate: fees.fastestFee,
          total_sats: fees.fastestFee * txSize,
        },
        half_hour: {
          rate: fees.halfHourFee,
          total_sats: fees.halfHourFee * txSize,
        },
        hour: {
          rate: fees.hourFee,
          total_sats: fees.hourFee * txSize,
        },
      },
      tx_size_vbytes: txSize,
      network: "MAINNET",
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json(
    { success: false, error: "Unknown action" },
    { status: 400 }
  );
}
