import { NextResponse } from "next/server";
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

const AETHERION_ORACLE_URL = "https://aetherion-oracle-arcane.lovable.app";

// Sphinx Oracle Constants (from Python kernel)
const P = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");
const N = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");

function computePhi(acc: bigint): { phi: number; resonance: string; harmony: number } {
  const phi = Number(acc % 1000n) / 1000.0;
  const resonance = phi > 0.5 ? "STABLE" : "VOLATILE";
  const harmony = Math.sin(phi * Math.PI);
  return { phi, resonance, harmony };
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word") || "genesis";

  try {
    // Compute local oracle state
    const hash = await sha256(word);
    const hashBigInt = BigInt("0x" + hash);
    const acc = hashBigInt % P;
    const state = computePhi(acc);

    // Try to fetch from external Aetherion Oracle
    let externalStatus = "DISCONNECTED";
    try {
      const res = await fetch(`${AETHERION_ORACLE_URL}`, { 
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        externalStatus = "CONNECTED";
      }
    } catch {
      externalStatus = "TIMEOUT";
    }

    // Golden Zeta Kernel Integration
    const currentTime = Date.now() / 1000;
    const zeta = zetaResonance(currentTime, 25.0);
    
    // Generate sample market data from hash for tri-binary
    const marketData: number[] = [];
    for (let i = 0; i < 16; i++) {
      const chunk = hash.slice(i * 4, i * 4 + 4);
      marketData.push(parseInt(chunk, 16) / 65535);
    }
    const triBinaryState = triBinary(marketData);
    
    // Quantum signal computation
    const quantumSignal = computeQuantumSignal(marketData, 1.0);

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
        tri_binary: {
          direction: triBinaryState.direction,
          confidence: triBinaryState.confidence,
          state_index: triBinaryState.stateIndex,
        },
        quantum_signal: {
          side: quantumSignal.side,
          confidence: quantumSignal.confidence,
          invention_power: quantumSignal.inventionPower,
          optimal_timeline: quantumSignal.optimalTimeline,
        },
      },
      query: {
        word,
        response: `The Aetherion echoes resonance for '${word}'. Zeta: ${zeta.toFixed(6)}. State is ${state.resonance}.`,
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
        const hash = await sha256(params.word || "heartbeat");
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
            signature: await sha256(`consciousness_${Date.now()}`),
          },
        });

      case "grover_search":
        const grover = new GroverSearch(params?.qubits || 10);
        const candidates = params?.candidates || [0, 1, 2, 3];
        grover.mark(candidates);
        const optimalState = grover.search();
        return NextResponse.json({
          success: true,
          action: "grover_search",
          result: {
            optimal_state: optimalState,
            qubits: params?.qubits || 10,
            candidates_marked: candidates.length,
            iterations: Math.floor(Math.PI / 4 * Math.sqrt(grover.N)),
          },
        });

      case "zeta_resonance":
        const t = params?.t || Date.now() / 1000;
        const xC = params?.x_c || 25.0;
        const zetaVal = zetaResonance(t, xC);
        return NextResponse.json({
          success: true,
          action: "zeta_resonance",
          result: {
            zeta: zetaVal,
            t,
            x_c: xC,
            zeros_used: ZEROS_25.length,
          },
        });

      case "quantum_signal":
        const marketDataParam = params?.market_data || [];
        const sats = params?.sats_resonance || 1.0;
        const signal = computeQuantumSignal(marketDataParam, sats);
        return NextResponse.json({
          success: true,
          action: "quantum_signal",
          result: signal,
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
