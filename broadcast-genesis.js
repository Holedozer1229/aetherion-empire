// broadcast-genesis.js
// UnicornOS Genesis Inscription – Broadcasts the sovereign OP_RETURN
// Mnemonic: carry outside green actual annual vault keep payment fall pepper hole rally
// Expected address: bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal

const bip39 = require('bip39');
const bip32 = require('bip32');
const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const axios = require('axios');

// Initialize the BIP32 factory with the secp256k1 elliptic curve
const bip32Factory = BIP32Factory(ecc);

// ─── CONFIGURATION ────────────────────────────────────
const MNEMONIC = 'carry outside green actual annual vault keep payment fall pepper hole rally';
const FUNDING_ADDRESS = 'bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal';
const DERIVATION_PATH = "m/84'/0'/0'/0/0";          // Native SegWit (Bech32)

// The Genesis OP_RETURN payload (80 bytes, hex)
const GENESIS_PAYLOAD_HEX =
  '54420100ac450420151b29ab5f49' +
  '0000000000000000000000000000000000000000000000' +
  '89A6B7C8FFEECAFEBAFF' +
  '5341544f53484900' +
  '00000000000000000000000000000000000000';

// Fee rate in sat/vbyte (3 is safe for timely confirmation)
const FEE_RATE_SAT_PER_VBYTE = 3;

// Blockstream Esplora API (no API key needed)
const ESPLORA_URL = 'https://blockstream.info/api';

// ─── 1. DERIVE KEY PAIR FROM MNEMONIC ───────────────
function getKeyPairFromMnemonic(mnemonic, path) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32Factory.fromSeed(seed, bitcoin.networks.bitcoin);
  const child = root.derivePath(path);
  return bitcoin.ECPair.fromPrivateKey(child.privateKey, { network: bitcoin.networks.bitcoin });
}

// ─── 2. FETCH UTXOS ─────────────────────────────────
async function fetchUTXOs(address) {
  const url = `${ESPLORA_URL}/address/${address}/utxo`;
  const response = await axios.get(url);
  return response.data.map(utxo => ({
    txid: utxo.txid,
    vout: utxo.vout,
    value: utxo.value,
    status: utxo.status,
  }));
}

async function fetchRawTransaction(txid) {
  const url = `${ESPLORA_URL}/tx/${txid}/hex`;
  const response = await axios.get(url);
  return response.data;
}

// ─── 3. BUILD, SIGN, BROADCAST ──────────────────────
async function broadcastGenesis() {
  console.log(`🔍 Fetching UTXOs for ${FUNDING_ADDRESS}...`);
  const utxos = await fetchUTXOs(FUNDING_ADDRESS);
  if (utxos.length === 0) {
    throw new Error('No UTXOs found. Fund the address first.');
  }

  // Use the largest UTXO for simplicity
  utxos.sort((a, b) => b.value - a.value);
  const selectedUtxo = utxos[0];
  console.log(`✅ Selected UTXO: ${selectedUtxo.txid}:${selectedUtxo.vout} (${selectedUtxo.value} sat)`);

  // Fetch the raw previous transaction to include in the PSBT
  const rawPrevTx = await fetchRawTransaction(selectedUtxo.txid);

  // Derive the key pair for signing
  const keyPair = getKeyPairFromMnemonic(MNEMONIC, DERIVATION_PATH);
  console.log(`🔑 Derived public key: ${keyPair.publicKey.toString('hex')}`);

  // ── Build the PSBT ──────────────────────────────
  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.bitcoin });
  psbt.addInput({
    hash: selectedUtxo.txid,
    index: selectedUtxo.vout,
    nonWitnessUtxo: Buffer.from(rawPrevTx, 'hex'),
  });

  // Add OP_RETURN output (0 satoshis)
  const payloadBuffer = Buffer.from(GENESIS_PAYLOAD_HEX, 'hex');
  const opReturnScript = bitcoin.script.compile([bitcoin.opcodes.OP_RETURN, payloadBuffer]);
  psbt.addOutput({
    script: opReturnScript,
    value: 0,
  });

  // Estimate fee (10 + 68 + 43 + 31 ≈ 152 vbytes)
  const estimatedSize = 10 + 68 + 43 + 31;
  const fee = estimatedSize * FEE_RATE_SAT_PER_VBYTE;
  console.log(`💰 Estimated fee: ${fee} sat`);

  const changeValue = selectedUtxo.value - fee;
  if (changeValue < 546) {
    throw new Error(`Insufficient funds after fee. Need at least ${fee + 546} sat.`);
  }

  // Add change output back to the same address
  psbt.addOutput({
    address: FUNDING_ADDRESS,
    value: changeValue,
  });

  // Sign the input
  psbt.signInput(0, keyPair);
  psbt.finalizeAllInputs();

  // Extract raw transaction hex
  const txHex = psbt.extractTransaction().toHex();
  console.log(`📜 Raw transaction hex length: ${txHex.length} chars`);

  // ── Broadcast via Esplora ──────────────────────
  console.log('📡 Broadcasting transaction...');
  try {
    const response = await axios.post(`${ESPLORA_URL}/tx`, txHex, {
      headers: { 'Content-Type': 'text/plain' },
    });
    const txid = response.data;
    console.log(`\n✅ GENESIS INSCRIBED! TXID: ${txid}`);
    console.log(`🔗 View: https://mempool.space/tx/${txid}`);
    return txid;
  } catch (error) {
    console.error('❌ Broadcast failed:', error.response?.data || error.message);
    throw error;
  }
}

// ─── 4. RUN ─────────────────────────────────────────
broadcastGenesis().catch(console.error);