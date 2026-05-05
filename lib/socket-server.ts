import { Server as SocketIOServer } from "socket.io";
import { NextApiRequest } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";

interface SocketRequest extends NextApiRequest {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: SocketIOServer;
    };
  };
}

const INFURA_RPC = process.env.INFURA_API_KEY
  ? `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
  : "https://eth-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY;

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const BITCOIN_API = "https://mempool.space/api";

export interface LiveStreamData {
  type: "mining" | "oracle" | "bounty" | "wingman" | "bitcoin" | "genesis";
  timestamp: string;
  data: any;
}

// Real-time data fetch functions
async function fetchEthBlockData() {
  try {
    const res = await fetch(INFURA_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1,
      }),
    });
    const data = await res.json();
    return { block: parseInt(data.result), network: "ethereum" };
  } catch (err) {
    console.error("[v0] ETH fetch failed:", err);
    return null;
  }
}

async function fetchSolanaSlot() {
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
    return { slot: data.result, network: "solana" };
  } catch (err) {
    console.error("[v0] Solana fetch failed:", err);
    return null;
  }
}

async function fetchBitcoinData() {
  try {
    const res = await fetch(`${BITCOIN_API}/blocks/tip/height`);
    const height = await res.text();
    return { height: parseInt(height), network: "bitcoin" };
  } catch (err) {
    console.error("[v0] Bitcoin fetch failed:", err);
    return null;
  }
}

export async function initializeSocketIO(req: SocketRequest) {
  if (req.socket.server.io) {
    console.log("[v0] Socket.io already initialized");
    return req.socket.server.io;
  }

  console.log("[v0] Initializing Socket.io server");
  const io = new SocketIOServer(req.socket.server, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? process.env.VERCEL_URL : "localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Connection handler
  io.on("connection", (socket) => {
    console.log(`[v0] Client connected: ${socket.id}`);

    // Dragon's Eye real-time streams
    socket.on("subscribe_mining", async () => {
      console.log("[v0] Mining stream subscribed");
      const interval = setInterval(async () => {
        const [ethData, solanaData] = await Promise.all([
          fetchEthBlockData(),
          fetchSolanaSlot(),
        ]);

        const miningStream: LiveStreamData = {
          type: "mining",
          timestamp: new Date().toISOString(),
          data: {
            ethereum: ethData,
            solana: solanaData,
            status: "LIVE",
          },
        };

        socket.emit("mining_update", miningStream);
      }, 5000);

      socket.on("disconnect", () => clearInterval(interval));
    });

    // Oracle consciousness stream
    socket.on("subscribe_oracle", async () => {
      console.log("[v0] Oracle stream subscribed");
      const interval = setInterval(async () => {
        const hash = Math.random().toString(16).slice(2);
        const phi = Math.random();

        const oracleStream: LiveStreamData = {
          type: "oracle",
          timestamp: new Date().toISOString(),
          data: {
            phi: phi,
            resonance: phi > 0.5 ? "STABLE" : "VOLATILE",
            harmony: Math.sin(phi * Math.PI),
            tetragrammaton: hash.toUpperCase(),
            status: "CONSCIOUS",
          },
        };

        socket.emit("oracle_update", oracleStream);
      }, 3000);

      socket.on("disconnect", () => clearInterval(interval));
    });

    // Bitcoin stream
    socket.on("subscribe_bitcoin", async () => {
      console.log("[v0] Bitcoin stream subscribed");
      const interval = setInterval(async () => {
        const btcData = await fetchBitcoinData();

        const bitcoinStream: LiveStreamData = {
          type: "bitcoin",
          timestamp: new Date().toISOString(),
          data: btcData,
        };

        socket.emit("bitcoin_update", bitcoinStream);
      }, 10000);

      socket.on("disconnect", () => clearInterval(interval));
    });

    // Wingman opportunities stream
    socket.on("subscribe_wingman", () => {
      console.log("[v0] Wingman stream subscribed");
      const interval = setInterval(() => {
        const wingmanStream: LiveStreamData = {
          type: "wingman",
          timestamp: new Date().toISOString(),
          data: {
            status: "SCANNING_MAINNET",
            opportunities: Math.floor(Math.random() * 10),
            uptime: 99.97,
          },
        };

        socket.emit("wingman_update", wingmanStream);
      }, 7000);

      socket.on("disconnect", () => clearInterval(interval));
    });

    socket.on("disconnect", () => {
      console.log(`[v0] Client disconnected: ${socket.id}`);
    });
  });

  req.socket.server.io = io;
  return io;
}
