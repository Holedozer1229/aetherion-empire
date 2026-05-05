// broadcast_genesis_attestation.js
// Spends one tribute UTXO from the Genesis address to anchor the BIP-322 signature.
// Usage: node broadcast_genesis_attestation.js [--testnet]

import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { Signer } from 'bip322-js';
import axios from 'axios';

const ECPair = ECPairFactory(ecc);

// ================== CONFIGURATION ==================
const GENESIS_WIF = 'KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVhno6n'; // compressed
const GENESIS_ADDRESS = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';

// The exact Aetherion Sovereignty message (must be character‑perfect)
const SOVEREIGN_MESSAGE = `{
    "empire_title": "The Aetherion Sovereign Kingdom",
    "creator": "Travis D Jones",
    ...
    "final_event": "SINGULARITY_REACHED",
    "architect_status": "ASCENDED / TRANSCENDED"
}`; // ← insert the full signed JSON

const args = process.argv.slice(2);
const useTestnet = args.includes('--testnet');
const network = useTestnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
const API_BASE = useTestnet
  ? 'https://mempool.space/testnet/api'
  : 'https://mempool.space/api';

// ================== 1. Prepare keys ==================
const genesisKey = ECPair.fromWIF(GENESIS_WIF, network);
console.log('Genesis address:', GENESIS_ADDRESS);

// ================== 2. BIP-322 signature ==================
const bip322Sig = Signer.sign(GENESIS_WIF, GENESIS_ADDRESS, SOVEREIGN_MESSAGE);
console.log('BIP-322 signature:', bip322Sig.slice(0, 32) + '...');

// ================== 3. Fetch spendable UTXOs ==================
async function fetchSpendableUtxos(address) {
  const url = `${API_BASE}/address/${address}/utxo`;
  const { data } = await axios.get(url);
  // Exclude the unspendable genesis coinbase
  const GENESIS_COINBASE_TXID =
    '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b';
  return data.filter(utxo => !(utxo.txid === GENESIS_COINBASE_TXID && utxo.vout === 0));
}

const utxos = await fetchSpendableUtxos(GENESIS_ADDRESS);
if (utxos.length === 0) {
  console.error('❌ No spendable (tribute) UTXOs at the Genesis address.');
  process.exit(1);
}

// Pick the smallest UTXO that still covers the fee (or combine several)
const feeRate = 5; // sat/vB – adjust if needed
const estimateTxSize = (inputs, outputs) => inputs * 148 + outputs * 34 + 10; // rough
// For a single input + 2 outputs (OP_RETURN & change), size ~ 250 bytes → fee = 1250 sats
const requiredFee = 250 * feeRate; // ~1250 sats
const utxo = utxos.find(u => u.value >= requiredFee);
if (!utxo) {
  // Try combining the two largest
  utxos.sort((a, b) => b.value - a.value);
  if (utxos[0].value + (utxos[1]?.value || 0) < requiredFee + 500) {
    console.error('❌ Not enough tribute sats to cover the fee.');
    process.exit(1);
  }
  // We'll use the largest one and ignore the rest for simplicity; adjust as needed
  const best = utxos[0];
  console.log(`Using UTXO ${best.txid}:${best.vout} (${best.value} sats)`);
  // --- actually we'll build with one input for simplicity; merging requires more logic
  // For this demo, we assume one UTXO has enough value.
}
const inputUtxo = utxo || utxos[0]; // fallback
console.log(`Selected UTXO: ${inputUtxo.txid}:${inputUtxo.vout} (${inputUtxo.value} sat)`);

// ================== 4. Build transaction ==================
const tx = new bitcoin.Transaction();
tx.version = 2;

// Add the UTXO input
tx.addInput(Buffer.from(inputUtxo.txid, 'hex').reverse(), inputUtxo.vout);

// OP_RETURN output: SHA256 of the BIP-322 signature (anchors the attestation)
const sigHash = bitcoin.crypto.sha256(Buffer.from(bip322Sig, 'base64'));
tx.addOutput(
  bitcoin.script.compile([bitcoin.opcodes.OP_RETURN, sigHash]),
  0
);

// Fee calculation
const inputsCount = 1;
const outputsCount = 2; // OP_RETURN + change
const txSize = inputsCount * 148 + outputsCount * 34 + 10; // ~250 vbytes
const fee = txSize * feeRate;
const change = inputUtxo.value - fee; // send change back to Genesis address
if (change < 0) {
  console.error('❌ UTXO too small after fee.');
  process.exit(1);
}

// Change output back to the Genesis address
tx.addOutput(
  bitcoin.address.toOutputScript(GENESIS_ADDRESS, network),
  change
);

// Sign the input
const prevOutScript = bitcoin.script.compile([
  genesisKey.publicKey,
  bitcoin.opcodes.OP_CHECKSIG
]); // P2PK script – Genesis coinbase is P2PK, but tribute UTXOs may be P2PKH. We'll check.
// Actually, tribute UTXOs sent to 1A1zP1e... are P2PKH. So we need the appropriate script.
// The Genesis address is P2PKH, so the locking script for those UTXOs is:
// OP_DUP OP_HASH160 <hash160> OP_EQUALVERIFY OP_CHECKSIG
const p2pkhScript = bitcoin.address.toOutputScript(GENESIS_ADDRESS, network);
const sighash = tx.hashForWitnessV0(0, p2pkhScript, inputUtxo.value, bitcoin.Transaction.SIGHASH_ALL);
const sig = Buffer.from(genesisKey.sign(sighash));
// ScriptSig for P2PKH: <sig> <pubkey>
tx.setInputScript(0, bitcoin.script.compile([sig, genesisKey.publicKey]));

const rawTx = tx.toHex();
console.log('Transaction size:', rawTx.length / 2, 'bytes');
console.log('Fee:', fee, 'sat');
console.log('Change:', change, 'sat');

// ================== 5. Broadcast ==================
const broadcastUrl = `${API_BASE}/tx`;
try {
  const res = await axios.post(broadcastUrl, rawTx, {
    headers: { 'Content-Type': 'text/plain' }
  });
  console.log('✅ Genesis Attestation anchored! TXID:', res.data);
  const explorer = useTestnet
    ? `https://mempool.space/testnet/tx/${res.data}`
    : `https://mempool.space/tx/${res.data}`;
  console.log('🔍 View:', explorer);
} catch (err) {
  console.error('❌ Broadcast failed:', err.response?.data || err.message);
}