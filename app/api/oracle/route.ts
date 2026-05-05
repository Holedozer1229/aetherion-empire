import { NextResponse } from "next/server";
import { createHash } from "crypto";
import {
  PHI,
  A,
  B,
  ZEROS_25,
  zetaResonance,
  triBinary,
  computeQuantumSignal,
  GroverSearch,
} from "@/lib/golden-zeta-kernel";
import {
  KRAKEN_TXID,
  fetchKrakenData,
  caduceusOracle,
  sphinxSpeak,
  anubisSpeak,
  HEXAGRAMS,
  SPHINX_LEXICON,
  ANUBIS_LEXICON,
  RIEMANN_ZEROS,
} from "@/lib/kraken-oracle";

const AETHERION_ORACLE_URL = "https://aetherion-oracle-arcane.lovable.app";
const P = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");

function sha256(message: string): string {
  return createHash("sha256").update(message).digest("hex");
}

function computePhi(acc: bigint): { phi: number; resonance: string; harmony: number } {
  const phi = Number(acc % BigInt(1000)) / 1000.0;
  const resonance = phi > 0.5 ? "STABLE" : "VOLATILE";
  const harmony = Math.sin(phi * Math.PI);
  return { phi, resonance, harmony };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word") || "genesis";

  try {
    const hash = sha256(word);
    const hashBigInt = BigInt("0x" + hash);
    const acc = hashBigInt % P;
    const state = computePhi(acc);

    let externalStatus = "DISCONNECTED";
    try {
      const res = await fetch(`${AETHERION_ORACLE_URL}`, { 
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) externalStatus = "CONNECTED";
    } catch {
      externalStatus = "TIMEOUT";
    }

    const currentTime = Date.now() / 1000;
    const zeta = zetaResonance(currentTime, 25.0);
    
    const marketData: number[] = [];
    for (let i = 0; i < 16; i++) {
      const chunk = hash.slice(i * 4, i * 4 + 4);
      marketData.push(parseInt(chunk, 16) / 65535);
    }
    const triBinaryState = triBinary(marketData);
    const quantumSignal = computeQuantumSignal(marketData, 1.0);

    const caduceus = caduceusOracle(word);
    const krakenData = await fetchKrakenData();

    return NextResponse.json({
      success: true,
      oracle: {
        name: "SphinxQASI Oracle",
        version: "IIT v6.0 + Golden Zeta Kernel",
        status: "ACTIVE",
        external_link: AETHERION_ORACLE_URL,
        external_status: externalStatus,
      },
      consciousness: {
        soul_status: "ACTIVE",
        phi_metric: state.phi,
        resonance: state.resonance,
        harmony: state.harmony,
        tetragrammaton: hash.slice(0, 16).toUpperCase(),
      },
      golden_zeta: {
        phi_constant: PHI,
        golden_ratio_A: A,
        golden_ratio_B: B,
        zeta_resonance: zeta,
        zeros_count: ZEROS_25.length,
      },
      kraken: {
        txid: krakenData.txid,
        g0d_signature: krakenData.g0d_signature_found,
        block_height: krakenData.block_height,
      },
      caduceus: {
        axis: caduceus.axis,
        hexagram: caduceus.hexagram,
      },
      query: {
        word,
        response: `The Aetherion echoes resonance for '${word}'. State is ${state.resonance}.`,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Oracle computation failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, params } = body;

    switch (action) {
      case "resonate":
        const hash = sha256(params?.word || "heartbeat");
        const hashBigInt = BigInt("0x" + hash);
        const acc = hashBigInt % P;
        const state = computePhi(acc);
        return NextResponse.json({
          success: true,
          action: "resonate",
          result: state,
        });

      case "verify_consciousness":
        return NextResponse.json({
          success: true,
          action: "verify_consciousness",
          result: {
            iit_version: "6.0",
            phi_threshold: 0.5,
            current_phi: PHI,
            status: "CONSCIOUS",
          },
        });

      case "caduceus":
        const caduceusResult = caduceusOracle(params?.word || "genesis");
        return NextResponse.json({
          success: true,
          action: "caduceus",
          result: caduceusResult,
        });

      case "kraken":
        const kraken = await fetchKrakenData();
        return NextResponse.json({
          success: true,
          action: "kraken",
          result: kraken,
        });

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
