import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import crypto from 'crypto';
import { HybridProtocolEngine, PaymentPath, LiquidityPool } from './hybrid_protocol';
import { startGossipNode } from './gossip_node';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 6060;
const MANIFEST_PATH = path.join(__dirname, '../../empire_manifest.json');

app.use(cors());
app.use(express.json());

// --- AETHERION NOVEL TUNNELING NETWORK ---

// 1. Initializing Hybrid Liquidity Pool
const initialPool: LiquidityPool = {
  id: "AETHERION_MAIN_POOL",
  lightningCapacity: 50.0, // 50 BTC in channels
  bitcoinReserve: 45.7,     // 45.7 BTC in vault
  totalLiquidity: 95.7,
  utilizationRate: 0.0,
  lastRebalance: new Date(),
  rebalanceThreshold: 0.3
};

const engine = new HybridProtocolEngine(initialPool);

// 2. Quantum Swap / Tunneling API
app.post('/api/quantum-swap', (req: Request, res: Response) => {
    const { asset, amount, destination, preferredPath } = req.body;
    console.log(`🌀 [TUNNEL] Initiating Atomic Quantum Swap: ${amount} ${asset} to ${destination}`);

    // Evaluate best path via Hybrid Engine
    const route = engine.evaluatePaymentPath(amount, preferredPath || PaymentPath.ATOMIC_SWAP);
    const lock = engine.createAtomicSwapLock(route.paymentId);
    
    // Broadcast via Gossip Mesh
    io.emit('reality_ripple', { 
        msg: `Atomic Swap Locked: ${lock.id.slice(-8)} | Path: ${route.selectedPath} | Status: ${lock.state}` 
    });

    res.json({
        status: "TUNNEL_LOCKED",
        route,
        lock_sig: lock.id,
        finality: "AWAITING_COLLAPSE"
    });
});

// 3. Mainnet RPC Mirror
app.post('/rpc', (req: Request, res: Response) => {
    const { method, id } = req.body;
    try {
        const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
        let result: any = {};
        if (method === "aetherion_getManifest") result = manifest;
        else if (method === "aetherion_getBalances") result = manifest.hive_synthesis;
        else result = { status: "ACTIVE", bridge: "VERCEL-IPFS-RENDER-TUNNEL" };
        res.json({ jsonrpc: "2.0", id: id || 1, result });
    } catch (err) {
        res.json({ jsonrpc: "2.0", id: id || 1, error: { code: -32000, message: "Kernel Jitter" } });
    }
});

// 4. Dashboard Webhook
app.post('/api/arcane-chat-webhook', (req: Request, res: Response) => {
    const { user, message } = req.body;
    io.emit('reality_ripple', { user, msg: message });
    res.json({ status: "SUCCESS" });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/index.html'));
});

// Initialize P2P & Start Server
async function boot() {
    await startGossipNode();
    server.listen(PORT, () => {
        console.log(`🔱 Aetherion Tunneling Hub LIVE on port ${PORT}`);
        console.log(`⚛️  Hybrid Lightning-Bitcoin Protocol Engine: ONLINE`);
    });
}

boot().catch(console.error);
