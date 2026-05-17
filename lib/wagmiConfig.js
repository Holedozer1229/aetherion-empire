"use client";

import { http, createConfig, fallback } from "wagmi";
import { mainnet, polygon, arbitrum, base } from "wagmi/chains";
import { injected, walletConnect } from "@wagmi/connectors";

const alchemyApiKey = process.env.ALCHEMY_API_KEY || "gRwARAR3A6NT7Swg3k6zu";

// WalletConnect Project ID - with fallback to temporary placeholder
let walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// If not set, use temporary placeholder and log warning
if (!walletConnectProjectId || walletConnectProjectId === 'aetherion_sovereignty_key_v2') {
  walletConnectProjectId = 'aetherion_sovereignty_v2';
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Using temporary WalletConnect Project ID. Please configure your own ID at cloud.walletconnect.com');
  }
}

// Alchemy RPC endpoints - Primary conduit for all chains
const alchemyMainnetUrl = `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
const alchemyPolygonUrl = `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
const alchemyArbitrumUrl = `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
const alchemyBaseUrl = `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;

// Public RPC endpoints - Secondary fallback for resonance stability
const publicMainnetUrl = "https://eth.llamarpc.com";
const publicPolygonUrl = "https://polygon-rpc.com";
const publicArbitrumUrl = "https://arb1.arbitrum.io/rpc";
const publicBaseUrl = "https://mainnet.base.org";

export const wagmiConfig = createConfig({
  chains: [mainnet, base, polygon, arbitrum],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({ 
      projectId: walletConnectProjectId,
      showQrModal: true,
      metadata: {
        name: 'Aetherion Empire',
        description: 'Sovereign Multi-Chain Wallet Interface',
        url: 'https://aetherion.network',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    }),
  ],
  transports: {
    // Ethereum Mainnet with fallback
    [mainnet.id]: fallback([
      http(alchemyMainnetUrl),
      http(publicMainnetUrl),
    ]),
    // Base Chain - Critical for 7,783 ETH materialization
    [base.id]: fallback([
      http(alchemyBaseUrl),
      http(publicBaseUrl),
    ]),
    // Polygon with fallback
    [polygon.id]: fallback([
      http(alchemyPolygonUrl),
      http(publicPolygonUrl),
    ]),
    // Arbitrum with fallback
    [arbitrum.id]: fallback([
      http(alchemyArbitrumUrl),
      http(publicArbitrumUrl),
    ]),
  },
  ssr: true,
});

export const isUsingPlaceholderProjectId = !process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID === 'aetherion_sovereignty_key_v2';