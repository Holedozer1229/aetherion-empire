import { NextResponse } from "next/server";
import {
  fetchSolanaStats,
  fetchAccountBalance,
  fetchRecentTransactions,
  fetchSolPrice,
  fetchMempoolFallback,
  isValidSolanaAddress,
  AETHERION_TREASURY,
} from "@/lib/solana-anchor";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "stats";
  const address = searchParams.get("address");

  try {
    switch (action) {
      case "stats": {
        const [stats, solPrice, mempoolFallback] = await Promise.all([
          fetchSolanaStats(),
          fetchSolPrice(),
          fetchMempoolFallback(),
        ]);

        return NextResponse.json({
          success: true,
          solana: {
            slot: stats?.slot ?? null,
            block_height: stats?.blockHeight ?? null,
            epoch: stats?.epochInfo?.epoch ?? null,
            epoch_progress: stats?.epochInfo 
              ? ((stats.epochInfo.slotIndex / stats.epochInfo.slotsInEpoch) * 100).toFixed(2) + "%"
              : null,
            tps: stats?.tps ?? null,
            total_supply: stats?.totalSupply ?? null,
            circulating_supply: stats?.circulatingSupply ?? null,
            sol_price_usd: solPrice,
          },
          mempool_fallback: mempoolFallback,
          network: "MAINNET-BETA",
          timestamp: new Date().toISOString(),
        });
      }

      case "balance": {
        const targetAddress = address || AETHERION_TREASURY;
        
        if (!isValidSolanaAddress(targetAddress)) {
          return NextResponse.json(
            { success: false, error: "Invalid Solana address" },
            { status: 400 }
          );
        }

        const [balance, solPrice] = await Promise.all([
          fetchAccountBalance(targetAddress),
          fetchSolPrice(),
        ]);

        const valueUsd = balance && solPrice 
          ? balance.sol * solPrice 
          : null;

        return NextResponse.json({
          success: true,
          balance: {
            address: targetAddress,
            lamports: balance?.lamports ?? 0,
            sol: balance?.sol ?? 0,
            value_usd: valueUsd,
          },
          sol_price_usd: solPrice,
          network: "MAINNET-BETA",
          timestamp: new Date().toISOString(),
        });
      }

      case "transactions": {
        const targetAddress = address || AETHERION_TREASURY;
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        if (!isValidSolanaAddress(targetAddress)) {
          return NextResponse.json(
            { success: false, error: "Invalid Solana address" },
            { status: 400 }
          );
        }

        const transactions = await fetchRecentTransactions(targetAddress, limit);

        return NextResponse.json({
          success: true,
          address: targetAddress,
          transactions,
          count: transactions.length,
          network: "MAINNET-BETA",
          timestamp: new Date().toISOString(),
        });
      }

      case "price": {
        const solPrice = await fetchSolPrice();
        const mempoolFallback = await fetchMempoolFallback();

        return NextResponse.json({
          success: true,
          sol_price_usd: solPrice,
          btc_fees: mempoolFallback.btc.fees,
          btc_block_height: mempoolFallback.btc.blockHeight,
          timestamp: new Date().toISOString(),
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Unknown action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("[solana] API error:", error);
    return NextResponse.json(
      { success: false, error: "Solana API request failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, params } = body;

    switch (action) {
      case "validate_address": {
        const isValid = isValidSolanaAddress(params?.address || "");
        return NextResponse.json({
          success: true,
          action: "validate_address",
          result: {
            address: params?.address,
            valid: isValid,
          },
        });
      }

      case "estimate_fee": {
        // Solana fees are typically very low and predictable
        // 5000 lamports = 0.000005 SOL base fee
        const baseFee = 5000;
        const priorityFee = params?.priority === "high" ? 10000 : 0;
        
        return NextResponse.json({
          success: true,
          action: "estimate_fee",
          result: {
            base_fee_lamports: baseFee,
            priority_fee_lamports: priorityFee,
            total_lamports: baseFee + priorityFee,
            total_sol: (baseFee + priorityFee) / 1e9,
          },
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Unknown action" },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Request processing failed" },
      { status: 500 }
    );
  }
}
