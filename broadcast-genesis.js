// UnicornOS Genesis OP_RETURN Broadcaster
// Corrected for bitcoinjs-lib v6 and ecpair factory

const bip39 = require('bip39');
const { BIP32Factory } = require('bip32');
const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1');
const { default: ECPairFactory } = require('ecpair');
const axios = require('axios');

// Initialize factories with the secp256k1 curve
const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);

// ─── CONFIGURATION ────────────────────────────────────
const MNEMONIC = 'carry outside green actual annual vault keep payment fall pepper hole rally';
const FUNDING_ADDRESS = 'bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal';
const DERIVATION_PATH = "m/84'/0'/0'/0/0";

const GENESIS_PAYLOAD_HEX =
  '54420100ac450420151b29ab5f49' +
  '0000000000000000000000000000000000000000000000' +
  '89A6B7C8FFEECAFEBAFF' +
  '5341544f53484900' +
  '00000000000000000000000000000000000000';

const FEE_RATE_SAT_PER_VBYTE = 3;
const ESPLORA_URL = 'https://blockstream.info/api';

// ─── DERIVE KEY PAIR FROM MNEMONIC ───────────────────
function getKeyPairFromMnemonic(mnemonic, path) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
  const child = root.derivePath(path);
  // child.privateKey is a Buffer; make sure we pass a Buffer to fromPrivateKey
  return ECPair.fromPrivateKey(Buffer.from(child.privateKey), {
    network: bitcoin.networks.bitcoin,
  });
}

// ─── FETCH UTXOS ─────────────────────────────────────
async function fetchUTXOs(address) {
  const url = `${ESPLORA_URL}/address/${address}/utxo`;
  const response = await axios.get(url);
  return response.data.map(utxo => ({
    txid: utxo.txid,
    vout: utxo.vout,
    value: utxo.value,
  }));
}

async function fetchRawTransaction(txid) {
  const url = `${ESPLORA_URL}/tx/${txid}/hex`;
  const response = await axios.get(url);
  return response.data;
}

// ─── BUILD, SIGN, BROADCAST ──────────────────────────
async function broadcastGenesis() {
  console.log(`🔍 Fetching UTXOs for ${FUNDING_ADDRESS}...`);
  const utxos = await fetchUTXOs(FUNDING_ADDRESS);
  if (utxos.length === 0) throw new Error('No UTXOs found. Fund the address first.');

  utxos.sort((a, b) => b.value - a.value);
  const selected = utxos[0];
  console.log(`✅ Selected UTXO: ${selected.txid}:${selected.vout} (${selected.value} sat)`);

  const rawPrevTx = await fetchRawTransaction(selected.txid);
  const keyPair = getKeyPairFromMnemonic(MNEMONIC, DERIVATION_PATH);
  console.log(`🔑 Public key: ${keyPair.publicKey.toString('hex')}`);

  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.bitcoin });
  psbt.addInput({
    hash: selected.txid,
    index: selected.vout,
    nonWitnessUtxo: Buffer.from(rawPrevTx, 'hex'),
  });

  const payloadBuffer = Buffer.from(GENESIS_PAYLOAD_HEX, 'hex');
  const opReturnScript = bitcoin.script.compile([
    bitcoin.opcodes.OP_RETURN,
    payloadBuffer,
  ]);
  psbt.addOutput({ script: opReturnScript, value: 0 });

  const estimatedSize = 10 + 68 + 43 + 31; // ≈152 vbytes
  const fee = estimatedSize * FEE_RATE_SAT_PER_VBYTE;
  console.log(`💰 Estimated fee: ${fee} sat`);

  const changeValue = selected.value - fee;
  if (changeValue < 546) throw new Error(`Insufficient funds after fee. Need at least ${fee + 546} sat.`);

  psbt.addOutput({ address: FUNDING_ADDRESS, value: changeValue });
  psbt.signInput(0, keyPair);
  psbt.finalizeAllInputs();

  const txHex = psbt.extractTransaction().toHex();
  console.log(`📜 Transaction hex length: ${txHex.length} chars`);

  console.log('📡 Broadcasting...');
  const response = await axios.post(`${ESPLORA_URL}/tx`, txHex, {
    headers: { 'Content-Type': 'text/plain' },
  });
  const txid = response.data;
  console.log(`\n✅ GENESIS INSCRIBED! TXID: ${txid}`);
  console.log(`🔗 View: https://mempool.space/tx/${txid}`);
  return txid;
}

broadcastGenesis().catch(console.error);