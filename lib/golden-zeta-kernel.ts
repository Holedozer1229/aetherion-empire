/**
 * TIME MACHINE OS — GOLDEN ZETA KERNEL (TypeScript)
 * φ = 545.0977 / 336.89  ·  Z(x) with N=25 nontrivial zeros  ·  Grover O(√N)
 * Tri-binary + Lightning + Zeta Resonance → ONE LOOP
 */

// ----- GOLDEN RATIO CONSTANTS -----
export const PHI = (1 + Math.sqrt(5)) / 2;
export const A = 545.0977;
export const B = 336.89;
// A / B ≈ φ (1.618...)

// ----- TRI-BINARY MATRIX (φ-tuned) -----
const M_BASE = [
  [1.0, 0.0, Math.cos(1), Math.sin(1)],
  [Math.sin(1), Math.cos(1), 0.0, -Math.cos(1)],
  [-Math.cos(1), Math.sin(1), 1.0, Math.sin(1)],
  [Math.sin(1), -Math.cos(1), Math.sin(1), -Math.cos(1)],
];

// Kronecker product M_BASE ⊗ M_BASE = 16x16 matrix
function kronecker(a: number[][], b: number[][]): number[][] {
  const m = a.length;
  const n = a[0].length;
  const p = b.length;
  const q = b[0].length;
  const result: number[][] = [];
  for (let i = 0; i < m * p; i++) {
    result[i] = [];
    for (let j = 0; j < n * q; j++) {
      result[i][j] = a[Math.floor(i / p)][Math.floor(j / q)] * b[i % p][j % q];
    }
  }
  return result;
}

export const M_SUPER = kronecker(M_BASE, M_BASE);

// ----- ZETA RESONANCE (first 25 nontrivial Riemann zeros) -----
export const ZEROS_25 = [
  14.134725, 21.022040, 25.010857, 30.424876, 32.935061,
  37.586178, 40.918719, 43.327073, 48.005151, 49.773832,
  52.970, 56.446, 59.347, 60.831, 65.112,
  67.079, 69.546, 72.067, 75.704, 77.146,
  79.337, 82.910, 84.735, 87.425, 88.809,
];

/**
 * Zeta resonance: Z(x) = Σ exp(-i γ_n log x) / γ_n
 * Evaluated at x = x_c * exp(i ω t), ω = 2π/60 (market cycle)
 */
export function zetaResonance(t: number, xC: number = 25.0): number {
  const omega = (2 * Math.PI * t) / 60.0;
  const xReal = xC * Math.cos(omega);
  const xImag = xC * Math.sin(omega);
  
  let sumReal = 0;
  let sumImag = 0;
  
  for (const gamma of ZEROS_25) {
    // log(x) where x = xC * exp(i ω t)
    const logMag = Math.log(Math.sqrt(xReal * xReal + xImag * xImag));
    const logArg = Math.atan2(xImag, xReal);
    
    // exp(-i γ log x) = exp(-i γ (logMag + i logArg)) = exp(γ logArg) * exp(-i γ logMag)
    const expFactor = Math.exp(gamma * logArg);
    const cosVal = Math.cos(-gamma * logMag);
    const sinVal = Math.sin(-gamma * logMag);
    
    sumReal += (expFactor * cosVal) / gamma;
    sumImag += (expFactor * sinVal) / gamma;
  }
  
  return sumReal;
}

// ----- TRI-BINARY PROJECTION -----
export interface TriBinaryResult {
  direction: number; // -1, 0, 1, or 3
  confidence: number;
  stateVector: number[];
  stateIndex: number;
}

function softmax(arr: number[]): number[] {
  const maxVal = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - maxVal));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / sum);
}

function entropy(probs: number[]): number {
  return -probs.reduce((sum, p) => {
    if (p > 0) return sum + p * Math.log(p);
    return sum;
  }, 0);
}

export function triBinary(marketSlice: number[]): TriBinaryResult {
  if (marketSlice.length < 16) {
    return { direction: 0, confidence: 0, stateVector: [], stateIndex: 0 };
  }
  
  const slice = marketSlice.slice(-16);
  
  // Matrix-vector multiplication: M_SUPER @ slice
  const stateVector: number[] = [];
  for (let i = 0; i < 16; i++) {
    let sum = 0;
    for (let j = 0; j < 16; j++) {
      sum += M_SUPER[i][j] * slice[j];
    }
    stateVector.push(sum);
  }
  
  // Find max state
  let maxIdx = 0;
  let maxVal = Math.abs(stateVector[0]);
  for (let i = 1; i < stateVector.length; i++) {
    if (Math.abs(stateVector[i]) > maxVal) {
      maxVal = Math.abs(stateVector[i]);
      maxIdx = i;
    }
  }
  
  // Confidence from entropy
  const probs = softmax(stateVector);
  const ent = entropy(probs);
  const maxEntropy = Math.log(16);
  const confidence = 1 - (ent / maxEntropy);
  
  // Map state to direction: -1, 0, 1, 3
  const mod = maxIdx % 4;
  const direction = mod === 0 ? -1 : mod === 1 ? 0 : mod === 2 ? 1 : 3;
  
  return { direction, confidence, stateVector, stateIndex: maxIdx };
}

// ----- GROVER SEARCH (fixed unitarity) -----
export class GroverSearch {
  N: number;
  nQubits: number;
  amplitudes: number[];
  oracleStates: number[];
  
  constructor(nQubits: number = 10) {
    this.nQubits = nQubits;
    this.N = Math.pow(2, nQubits);
    this.amplitudes = new Array(this.N).fill(1 / Math.sqrt(this.N));
    this.oracleStates = [];
  }
  
  mark(states: number[]): void {
    this.oracleStates = states;
  }
  
  search(): number {
    // Reset amplitudes
    this.amplitudes = new Array(this.N).fill(1 / Math.sqrt(this.N));
    
    // Grover iterations: ~π/4 * √N
    const iterations = Math.floor(Math.PI / 4 * Math.sqrt(this.N));
    
    for (let i = 0; i < iterations; i++) {
      this._oracle();
      this._diffusion();
      this._normalize();
    }
    
    // Return most likely state
    let maxIdx = 0;
    let maxProb = this.amplitudes[0] * this.amplitudes[0];
    for (let i = 1; i < this.N; i++) {
      const prob = this.amplitudes[i] * this.amplitudes[i];
      if (prob > maxProb) {
        maxProb = prob;
        maxIdx = i;
      }
    }
    
    return maxIdx;
  }
  
  private _oracle(): void {
    for (const s of this.oracleStates) {
      if (s < this.N) {
        this.amplitudes[s] *= -1;
      }
    }
  }
  
  private _diffusion(): void {
    const avg = this.amplitudes.reduce((a, b) => a + b, 0) / this.N;
    for (let i = 0; i < this.N; i++) {
      this.amplitudes[i] = 2 * avg - this.amplitudes[i];
    }
  }
  
  private _normalize(): void {
    let norm = 0;
    for (const a of this.amplitudes) {
      norm += a * a;
    }
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (let i = 0; i < this.N; i++) {
        this.amplitudes[i] /= norm;
      }
    }
  }
}

// ----- INVENTION POWER -----
export function inventionPower(
  satsResonance: number,
  confidence: number,
  basePrice: number
): number {
  const zeta = zetaResonance(basePrice, 25.0);
  return satsResonance * confidence * zeta;
}

// ----- QUANTUM TRADE SIGNAL -----
export interface QuantumSignal {
  side: "buy" | "sell" | "hold";
  confidence: number;
  inventionPower: number;
  optimalTimeline: number;
  zetaResonance: number;
  triBinaryState: TriBinaryResult;
  timestamp: string;
}

export function computeQuantumSignal(
  marketData: number[],
  satsResonance: number = 1.0
): QuantumSignal {
  // 1. Tri-binary projection
  const triBinaryState = triBinary(marketData);
  
  // 2. Zeta resonance at current price
  const basePrice = marketData.length > 0 ? marketData[marketData.length - 1] : 0;
  const zeta = zetaResonance(basePrice, 25.0);
  
  // 3. Grover search for optimal timeline
  const grover = new GroverSearch(10); // 2^10 = 1024 timelines
  
  // Mark high-resonance timelines
  const delta = 0.0001;
  const candidates: number[] = [];
  const resonances: number[] = [];
  
  for (let i = 0; i < grover.N; i++) {
    const res = Math.abs(zetaResonance(basePrice + i * delta, 25.0));
    resonances.push(res);
  }
  
  const threshold = 0.7 * Math.max(...resonances);
  for (let i = 0; i < resonances.length; i++) {
    if (resonances[i] > threshold) {
      candidates.push(i);
    }
  }
  
  grover.mark(candidates);
  const optimalTimeline = grover.search();
  
  // 4. Invention power
  const power = inventionPower(satsResonance, triBinaryState.confidence, basePrice);
  
  // 5. Trade signal
  let side: "buy" | "sell" | "hold" = "hold";
  if (triBinaryState.confidence > 0.85 && Math.abs(power) > 0.1) {
    side = triBinaryState.direction > 0 ? "buy" : "sell";
  }
  
  return {
    side,
    confidence: triBinaryState.confidence,
    inventionPower: power,
    optimalTimeline,
    zetaResonance: zeta,
    triBinaryState,
    timestamp: new Date().toISOString(),
  };
}
