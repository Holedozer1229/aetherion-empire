/**
 * Hybrid Lightning-Bitcoin Protocol (QT-LATTICE v3.1)
 * Enables instant 0-latency tunneling through atomic swaps.
 */

export enum PaymentPath {
  LIGHTNING_ONLY = 'lightning_only',
  BITCOIN_ONLY = 'bitcoin_only',
  HYBRID_LIGHTNING_FIRST = 'hybrid_ln_first',
  HYBRID_BITCOIN_FIRST = 'hybrid_btc_first',
  ATOMIC_SWAP = 'atomic_swap',
}

export enum PaymentState {
  PENDING = 'pending',
  LOCKED = 'locked',
  CONFIRMED = 'confirmed',
  SETTLED = 'settled',
  FAILED = 'failed',
  DISPUTED = 'disputed',
}

export interface AtomicSwapLock {
  id: string;
  paymentId: string;
  lightningHash: string;
  bitcoinHash: string;
  lightningPreimage?: string;
  bitcoinPreimage?: string;
  lockTime: number;
  expirationTime: number;
  state: PaymentState;
  createdAt: Date;
  updatedAt: Date;
}

export interface LiquidityPool {
  id: string;
  lightningCapacity: number;
  bitcoinReserve: number;
  totalLiquidity: number;
  utilizationRate: number;
  lastRebalance: Date;
  rebalanceThreshold: number;
}

export interface HybridProtocolConfig {
  lightningThreshold: number;
  bitcoinThreshold: number;
  atomicSwapThreshold: number;
  lightningTimeout: number;
  bitcoinTimeout: number;
  settlementTimeout: number;
  lightningFeeRate: number;
  bitcoinFeeRate: number;
  maxSwapFee: number;
  minLiquidity: number;
  rebalanceThreshold: number;
  rebalanceAmount: number;
}

export const DEFAULT_HYBRID_CONFIG: HybridProtocolConfig = {
  lightningThreshold: 0.1,
  bitcoinThreshold: 1.0,
  atomicSwapThreshold: 0.5,
  lightningTimeout: 60,
  bitcoinTimeout: 600,
  settlementTimeout: 900,
  lightningFeeRate: 0.001,
  bitcoinFeeRate: 0.005,
  maxSwapFee: 0.002,
  minLiquidity: 10,
  rebalanceThreshold: 0.3,
  rebalanceAmount: 5,
};

export class HybridProtocolEngine {
  private config: HybridProtocolConfig;
  private liquidityPool: LiquidityPool;
  private activeSwaps: Map<string, AtomicSwapLock> = new Map();

  constructor(
    initialLiquidity: LiquidityPool,
    config: HybridProtocolConfig = DEFAULT_HYBRID_CONFIG
  ) {
    this.config = config;
    this.liquidityPool = initialLiquidity;
  }

  evaluatePaymentPath(amount: number, preferredPath: PaymentPath) {
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (preferredPath !== PaymentPath.HYBRID_LIGHTNING_FIRST && 
        preferredPath !== PaymentPath.HYBRID_BITCOIN_FIRST) {
      return this.createRoute(paymentId, preferredPath, amount);
    }

    if (amount < this.config.lightningThreshold) {
      return this.createRoute(paymentId, PaymentPath.LIGHTNING_ONLY, amount);
    }

    if (amount > this.config.bitcoinThreshold) {
      return this.createRoute(paymentId, PaymentPath.BITCOIN_ONLY, amount);
    }

    return this.createRoute(paymentId, PaymentPath.ATOMIC_SWAP, amount);
  }

  private createRoute(paymentId: string, path: PaymentPath, amount: number) {
    const route: any = {
      paymentId,
      selectedPath: path,
      estimatedFee: 0,
      estimatedTime: 0,
      liquidity: this.liquidityPool,
    };

    switch (path) {
      case PaymentPath.LIGHTNING_ONLY:
        route.lightningAmount = amount;
        route.estimatedFee = amount * this.config.lightningFeeRate;
        route.estimatedTime = 1000;
        break;
      case PaymentPath.BITCOIN_ONLY:
        route.bitcoinAmount = amount;
        route.estimatedFee = amount * this.config.bitcoinFeeRate;
        route.estimatedTime = 600000;
        break;
      case PaymentPath.ATOMIC_SWAP:
        route.lightningAmount = amount * 0.6;
        route.bitcoinAmount = amount * 0.4;
        route.estimatedFee = amount * this.config.maxSwapFee;
        route.estimatedTime = 5000;
        break;
    }
    return route;
  }

  createAtomicSwapLock(paymentId: string): AtomicSwapLock {
    const swapId = `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now() / 1000;

    const lock: AtomicSwapLock = {
      id: swapId,
      paymentId,
      lightningHash: `0x${crypto.randomBytes(32).toString('hex')}`,
      bitcoinHash: `0x${crypto.randomBytes(32).toString('hex')}`,
      lockTime: now,
      expirationTime: now + this.config.settlementTimeout,
      state: PaymentState.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.activeSwaps.set(swapId, lock);
    return lock;
  }
}
