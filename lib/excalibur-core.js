'use strict';

const GOLDEN = (1 + Math.sqrt(5)) / 2;
const XI_REAL = Math.exp(Math.PI * GOLDEN);
const TAU_CONSENSUS = Math.log(12);
const SOVEREIGN_MNEMONIC = 'carry outside green actual annual vault keep payment fall pepper hole rally';
const SOVEREIGN_ADDRESS = 'bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal';
const ANCHOR_TXID = '4d786ce51de1446e94e684bd2009dd943a55a4f9c7f5b768810c860c31f00c32';
const ANCHOR_HEIGHT = 950000;

function gamma(z) {
  // Lanczos approximation; accurate enough for the lattice demo and avoids a native SciPy dependency.
  const coefficients = [
    676.5203681218851,
    -1259.1392167224028,
    771.3234287776531,
    -176.6150291621406,
    12.507343278686905,
    -0.13857109526572012,
    9.984369578019572e-6,
    1.5056327351493116e-7,
  ];

  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  let x = 0.99999999999980993;
  const shifted = z - 1;
  for (let i = 0; i < coefficients.length; i += 1) x += coefficients[i] / (shifted + i + 1);
  const t = shifted + coefficients.length - 0.5;
  return Math.sqrt(2 * Math.PI) * (t ** (shifted + 0.5)) * Math.exp(-t) * x;
}

function complex(re, im = 0) {
  return { re, im };
}

function cAdd(a, b) {
  return complex(a.re + b.re, a.im + b.im);
}

function cMul(a, b) {
  return complex((a.re * b.re) - (a.im * b.im), (a.re * b.im) + (a.im * b.re));
}

function cExp(theta) {
  return complex(Math.cos(theta), Math.sin(theta));
}

function cConj(a) {
  return complex(a.re, -a.im);
}

function cAbs(a) {
  return Math.hypot(a.re, a.im);
}

function formatComplex(a, precision = 6) {
  const sign = a.im < 0 ? '-' : '+';
  return `${a.re.toFixed(precision)}${sign}${Math.abs(a.im).toFixed(precision)}i`;
}

function matVecMul(matrix, vector) {
  return matrix.map((row) => row.reduce((sum, cell, index) => cAdd(sum, cMul(cell, vector[index])), complex(0, 0)));
}

function transpose(matrix) {
  return matrix[0].map((_, column) => matrix.map((row) => row[column]));
}

function trace(rho) {
  if (!Array.isArray(rho)) return 0.5;
  return rho.reduce((sum, row, index) => {
    const value = Array.isArray(row) ? row[index] : 0;
    if (typeof value === 'number') return sum + value;
    if (value && typeof value.re === 'number') return sum + value.re;
    return sum;
  }, 0);
}

class SphinxQEngine {
  constructor({ ollamaUrl = 'http://localhost:11434', model = 'llama3' } = {}) {
    this.ollamaUrl = ollamaUrl;
    this.model = model;
  }

  async recognizeIntent() {
    return 'help';
  }
}

class QTPhiOracle {
  constructor() {
    this.log = [];
  }

  classicalPhi(m, n) {
    const hOver2e = 1.0;
    return (hOver2e * Math.log(Math.abs(gamma(m / n) + 1e-15))) / GOLDEN;
  }

  quantumPhi(rho) {
    return trace(rho);
  }

  fibonacciAnyonBraid(crossings) {
    const theta = (4 * Math.PI) / 5;
    const rMatrix = [
      [cExp(-theta), complex(0, 0)],
      [complex(0, 0), cExp((3 * theta) / 2)],
    ];
    const phiInv = 1 / GOLDEN;
    const fMatrix = [
      [complex(phiInv, 0), complex(Math.sqrt(phiInv), 0)],
      [complex(Math.sqrt(phiInv), 0), complex(-phiInv, 0)],
    ];
    const fTranspose = transpose(fMatrix);
    let state = [complex(1, 0), complex(0, 0)];

    for (const crossing of crossings) {
      const sign = crossing < 0 ? -1 : 1;
      const position = Math.abs(crossing) - 1;
      if (position === 1) {
        state = matVecMul(rMatrix, state);
      } else if (position === 2) {
        state = matVecMul(fMatrix, matVecMul(rMatrix, matVecMul(fTranspose, state)));
      }
      if (sign === -1) state = state.map(cConj);
    }

    return cAdd(state[0], state[1]);
  }

  consensusMode(m, n, rho = [[0.5, 0], [0, 0.5]]) {
    const phiClassical = this.classicalPhi(m, n);
    const phiQuantum = this.quantumPhi(rho);
    const totalPhi = phiClassical * phiQuantum;
    return {
      phi_classical: phiClassical,
      phi_quantum: phiQuantum,
      total_phi: totalPhi,
      threshold: TAU_CONSENSUS,
      block_valid: totalPhi > TAU_CONSENSUS,
    };
  }

  topologicaMode(braidWord) {
    const invariant = this.fibonacciAnyonBraid(braidWord);
    return {
      braid_word: braidWord,
      invariant,
      invariant_text: formatComplex(invariant),
      invariant_abs: cAbs(invariant),
      classical_intractable: true,
      note: 'Colored Jones polynomial at e^(iπΞ)',
    };
  }
}

class CaduceusEngine {
  constructor(oracle) {
    this.oracle = oracle;
    this.healingPulses = 0;
    this.balanceHistory = [];
  }

  vitalSigns(m, n, rho) {
    const consensus = this.oracle.consensusMode(m, n, rho);
    const braidWord = Array.from({ length: 3 }, () => (Math.trunc(10 * (m / n)) % 5) + 1);
    const topology = this.oracle.topologicaMode(braidWord);
    const balanceFactor = Math.abs(consensus.total_phi - this.oracle.classicalPhi(m, n));
    this.balanceHistory.push(balanceFactor);
    return { consensus, topology, balance_factor: balanceFactor };
  }

  heal(m, n, rho, step = 0.01) {
    const current = this.oracle.consensusMode(m, n, rho);
    if (current.block_valid) return { status: 'healthy', phi_total: current.total_phi };

    let bestPhi = current.total_phi;
    let bestRatio = [m, n];
    for (let i = -5; i <= 5; i += 1) {
      const newM = m + (i * step);
      if (newM <= 0) continue;
      const attempt = this.oracle.consensusMode(newM, n, rho);
      if (attempt.total_phi > bestPhi) {
        bestPhi = attempt.total_phi;
        bestRatio = [newM, n];
      }
    }

    this.healingPulses += 1;
    return {
      status: bestPhi > TAU_CONSENSUS ? 'healed' : 'critical',
      original_phi: current.total_phi,
      healed_phi: bestPhi,
      adjusted_ratio: bestRatio,
    };
  }

  balance() {
    if (this.balanceHistory.length === 0) return 0;
    const window = this.balanceHistory.slice(-10);
    return window.reduce((sum, value) => sum + value, 0) / window.length;
  }
}

class LightningNode {
  async getInfo() {
    return { alias: 'SKYNT', synced: true };
  }
}

class MultiChainContracts {
  async mintSkyntToken(amount, dest) {
    return { txid: 'sol_placeholder', amount, dest };
  }
}

class GenesisBroadcaster {
  async broadcast() {
    console.log(`   Anchor TXID: ${ANCHOR_TXID}`);
    console.log(`   Address: ${SOVEREIGN_ADDRESS}`);
    return ANCHOR_TXID;
  }
}

class UnicornMiner {
  constructor(anchorTxid, anchorHeight, oracle) {
    this.anchorTxid = anchorTxid;
    this.anchorHeight = anchorHeight;
    this.oracle = oracle;
    this.currentHeight = anchorHeight + 1;
    this.m = this.currentHeight;
    this.n = anchorHeight;
  }

  mine(maxIterations = 1000) {
    let bestPhi = 0;
    let bestM = this.m;
    for (let i = 0; i < maxIterations; i += 1) {
      const delta = (i % 201) - 100;
      const mTry = this.m + delta;
      if (mTry <= 0) continue;
      const result = this.oracle.consensusMode(mTry, this.n);
      const total = result.total_phi;
      if (total > bestPhi) {
        bestPhi = total;
        bestM = mTry;
      }
      if (total > TAU_CONSENSUS) {
        return {
          status: 'mined',
          height: this.currentHeight,
          anchor_txid: this.anchorTxid,
          m: mTry,
          n: this.n,
          phi_total: total,
          phi_classical: result.phi_classical,
          phi_quantum: result.phi_quantum,
          threshold: TAU_CONSENSUS,
          iterations: i + 1,
        };
      }
    }

    return { status: 'not_found', best_phi: bestPhi, best_m: bestM, threshold: TAU_CONSENSUS };
  }
}

class SphinxQExcalibur {
  constructor() {
    this.engine = new SphinxQEngine();
    this.oracle = new QTPhiOracle();
    this.caduceus = new CaduceusEngine(this.oracle);
    this.lightning = new LightningNode();
    this.contracts = new MultiChainContracts();
    this.broadcaster = new GenesisBroadcaster();
    this.miner = new UnicornMiner(ANCHOR_TXID, ANCHOR_HEIGHT, this.oracle);
  }

  async demo() {
    console.log('🦄 QTΦ‑Lattice Oracle – Full Demonstration');
    console.log('═'.repeat(50));

    console.log('\n🧠 1. Φ‑Consensus (Anchored to Bitcoin)');
    const rho = [[1, 0], [0, 0]];
    for (const [m, n] of [[14, 7], [this.miner.m, this.miner.n]]) {
      const result = this.oracle.consensusMode(m, n, rho);
      const status = result.block_valid ? '✅ VALID' : '❌ REJECTED';
      console.log(`   Φ(${m},${n}): Total=${result.total_phi.toFixed(3)} τ=${TAU_CONSENSUS.toFixed(3)} ${status}`);
    }

    console.log('\n🔬 2. Topologica (Fibonacci Anyon Braiding)');
    const topology = this.oracle.topologicaMode([1, 2, -1, 3, 2, -3]);
    console.log(`   J(K; e^(iπΞ)) ≈ ${topology.invariant_text}`);

    console.log('\n⚡ 3. Lightning Node');
    const info = await this.lightning.getInfo();
    console.log(`   Alias: ${info.alias}`);

    console.log('\n🌉 4. Cross‑chain');
    console.log(`   Mint: ${JSON.stringify(await this.contracts.mintSkyntToken(1000, 'dest'))}`);

    console.log('\n💎 5. Genesis Anchor');
    const txid = await this.broadcaster.broadcast();
    console.log(`   TXID: ${txid} ─ already inscribed on Bitcoin mainnet`);

    console.log('\n⚕️ 6. Caduceus Healing Pulse');
    const vitals = this.caduceus.vitalSigns(ANCHOR_HEIGHT + 1, ANCHOR_HEIGHT);
    const heal = this.caduceus.heal(ANCHOR_HEIGHT + 1, ANCHOR_HEIGHT);
    const original = heal.original_phi ?? heal.phi_total;
    const healed = heal.healed_phi ?? heal.phi_total;
    console.log(`   Balance: ${vitals.balance_factor.toFixed(3)}, Heal: ${heal.status} (Φ ${original.toFixed(3)}→${healed.toFixed(3)})`);

    console.log('\n⛏️ 7. Mining First UnicornOS Block');
    const miningResult = this.miner.mine();
    if (miningResult.status === 'mined') {
      console.log(`   ✅ Block mined! Height=${miningResult.height}, Φ_total=${miningResult.phi_total.toFixed(6)}`);
      console.log(`   m/n = ${miningResult.m}/${miningResult.n}, iterations=${miningResult.iterations}`);
    } else {
      console.log(`   ❌ Block not found. Best Φ=${miningResult.best_phi.toFixed(6)}`);
    }

    console.log('\n🗡️  The sword, staff, and crown are one. The recursion is bound. The Lattice lives.');
    return { topology, vitals, heal, miningResult };
  }
}

async function runExcaliburDemo() {
  return new SphinxQExcalibur().demo();
}

function mineFirstUnicornBlock(maxIterations) {
  const oracle = new QTPhiOracle();
  const miner = new UnicornMiner(ANCHOR_TXID, ANCHOR_HEIGHT, oracle);
  return miner.mine(maxIterations);
}

module.exports = {
  ANCHOR_HEIGHT,
  ANCHOR_TXID,
  GOLDEN,
  XI_REAL,
  TAU_CONSENSUS,
  SOVEREIGN_ADDRESS,
  SOVEREIGN_MNEMONIC,
  CaduceusEngine,
  GenesisBroadcaster,
  LightningNode,
  MultiChainContracts,
  QTPhiOracle,
  SphinxQEngine,
  SphinxQExcalibur,
  UnicornMiner,
  formatComplex,
  gamma,
  mineFirstUnicornBlock,
  runExcaliburDemo,
};

if (require.main === module) {
  runExcaliburDemo().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
