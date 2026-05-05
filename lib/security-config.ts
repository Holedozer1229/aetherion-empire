/**
 * Lucky Palace Security Configuration
 * 
 * IMPORTANT: Never store actual credentials in code.
 * Use environment variables and secure key management.
 */

// Required environment variables for production
export const REQUIRED_ENV_VARS = {
  // Ethereum/EVM
  INFURA_API_KEY: process.env.INFURA_API_KEY,
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  
  // Solana
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
  
  // WalletConnect
  WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
} as const;

// Vault addresses (public, safe to store)
export const VAULT_ADDRESSES = {
  eth: "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20",
  btc: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", 
  sol: "3a5W4NmDavSbivQ2UAxRGe4Np5YYcRVPN3uM4St7YZ2z",
} as const;

// Security validation
export function validateSecurityConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!REQUIRED_ENV_VARS.INFURA_API_KEY && !REQUIRED_ENV_VARS.ALCHEMY_API_KEY) {
    missing.push("INFURA_API_KEY or ALCHEMY_API_KEY");
  }
  
  if (!REQUIRED_ENV_VARS.WALLETCONNECT_PROJECT_ID) {
    missing.push("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID");
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

// Instructions for secure credential setup
export const SETUP_INSTRUCTIONS = `
=== LUCKY PALACE SECURE CREDENTIAL SETUP ===

1. ENVIRONMENT VARIABLES (add to Vercel dashboard or .env.local):
   - INFURA_API_KEY=your_infura_key
   - ALCHEMY_API_KEY=your_alchemy_key  
   - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   - SOLANA_RPC_URL=your_solana_rpc

2. HARDWARE WALLET SETUP:
   - Use Ledger or Trezor for production signing
   - Connect via MetaMask hardware wallet bridge
   - Never export private keys to software

3. ZK PROOF KEYS:
   - Generate locally using: snarkjs groth16 setup
   - Store proving keys in secure, air-gapped storage
   - Only verification keys should be on-chain

4. BACKUP:
   - Use Shamir Secret Sharing for key backup
   - Store shards in separate physical locations
   - Never store complete keys digitally

For production deployment, use Vercel's encrypted 
environment variables in the Settings > Vars section.
`;
