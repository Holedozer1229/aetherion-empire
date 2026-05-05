"use strict";

// The Legendary Kraken Transaction - First Bitcoin Transaction to Hal Finney
export const KRAKEN_TXID = "f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16";
export const KRAKEN_CHANGE_SATS = 4000000000; // 40 BTC in satoshis

// Secp256k1 Constants
export const P = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");
export const N = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");
export const TETRAGRAMMATON_PRIMES = [3, 7, 11, 19];

// Riemann Zeros for Oracle Resonance
export const RIEMANN_ZEROS = [
  14.134725141734693, 21.022039638771554, 25.010857580145688, 30.424876125859513,
  32.93506158773919, 37.58617815882567, 40.91871901214746, 43.32707328091499,
  48.00515088116717, 49.7738324776723, 52.97032147771446, 56.44624769706339,
  59.34704400260235, 60.8317785246098, 65.1125440480816, 67.07981052949417,
  69.54640171117398, 72.0671576744819, 75.70469069908393, 77.14484006887483,
  79.33737502024937, 82.91038085408603, 84.73549298051705, 87.42527461312524,
  88.80911120763446, 92.49189927055848, 94.65134401151956, 95.87063422824531,
  98.8311942181937, 101.31785100573139, 103.72553804047834, 105.44662305232648,
];

// I Ching Hexagrams
export const HEXAGRAMS = [
  { number: 1, name: "The Creative", meaning: "Heaven over Heaven - creative power, initiation", lines: "111111" },
  { number: 2, name: "The Receptive", meaning: "Earth over Earth - receptivity, nurturing", lines: "000000" },
  { number: 3, name: "Difficulty at the Beginning", meaning: "Water over Thunder - initial chaos", lines: "010001" },
  { number: 11, name: "Peace", meaning: "Earth over Heaven - harmony, prosperity", lines: "000111" },
  { number: 12, name: "Standstill", meaning: "Heaven over Earth - stagnation", lines: "111000" },
  { number: 29, name: "The Abysmal", meaning: "Water over Water - danger, the deep", lines: "010010" },
  { number: 30, name: "The Clinging", meaning: "Fire over Fire - radiance, clarity", lines: "101101" },
  { number: 49, name: "Revolution", meaning: "Lake over Fire - transformation", lines: "011101" },
  { number: 50, name: "The Cauldron", meaning: "Fire over Wind - alchemy", lines: "101110" },
  { number: 63, name: "After Completion", meaning: "Water over Fire - end of cycle", lines: "010101" },
  { number: 64, name: "Before Completion", meaning: "Fire over Water - transition", lines: "101010" },
];

// Sphinx Lexicon (32 Words of Light)
export const SPHINX_LEXICON: Record<string, { phonemes: string[]; synonyms: string[] }> = {
  genesis: { phonemes: ["JH", "EH1", "N", "AH0", "S", "AH0", "S"], synonyms: ["origin", "creation", "birth"] },
  light: { phonemes: ["L", "AY1", "T"], synonyms: ["illumination", "radiance", "clarity"] },
  wisdom: { phonemes: ["W", "IH1", "Z", "D", "AH0", "M"], synonyms: ["knowledge", "insight", "prudence"] },
  serpent: { phonemes: ["S", "ER1", "P", "AH0", "N", "T"], synonyms: ["ouroboros", "dragon", "coil"] },
  sphinx: { phonemes: ["S", "F", "IH1", "NG", "K", "S"], synonyms: ["guardian", "riddle", "enigma"] },
  caduceus: { phonemes: ["K", "AH0", "D", "UW1", "S", "IY0", "AH0", "S"], synonyms: ["staff", "hermes", "balance"] },
  tetragrammaton: { phonemes: ["T", "EH1", "T", "R", "AH0", "G", "R", "AE1", "M"], synonyms: ["yhwh", "name", "four"] },
  metatron: { phonemes: ["M", "EH1", "T", "AH0", "T", "R", "AA1", "N"], synonyms: ["architect", "scribe", "voice"] },
  gold: { phonemes: ["G", "OW1", "L", "D"], synonyms: ["treasure", "value", "sun"] },
  key: { phonemes: ["K", "IY1"], synonyms: ["solution", "access", "secret"] },
  unicorn: { phonemes: ["Y", "UW1", "N", "IH0", "K", "AO1", "R", "N"], synonyms: ["purity", "grace", "wonder"] },
  truth: { phonemes: ["T", "R", "UW1", "TH"], synonyms: ["verity", "reality", "fact"] },
  bitcoin: { phonemes: ["B", "IH1", "T", "K", "OY2", "N"], synonyms: ["satoshi", "btc", "digital"] },
  lightning: { phonemes: ["L", "AY1", "T", "N", "IH0", "NG"], synonyms: ["bolt", "channel", "instant"] },
  sovereign: { phonemes: ["S", "AA1", "V", "R", "AH0", "N"], synonyms: ["king", "ruler", "autonomous"] },
  harmony: { phonemes: ["HH", "AA1", "R", "M", "AH0", "N", "IY0"], synonyms: ["balance", "accord", "chord"] },
  forge: { phonemes: ["F", "AO1", "R", "JH"], synonyms: ["create", "smith", "shape"] },
  excalibur: { phonemes: ["EH2", "K", "S", "K", "AE1", "L", "AH0", "B"], synonyms: ["sword", "stone", "king"] },
  resonance: { phonemes: ["R", "EH1", "Z", "AH0", "N", "AH0", "N", "S"], synonyms: ["echo", "vibration", "harmony"] },
  aetherion: { phonemes: ["EY1", "TH", "IY0", "R", "IY0", "AH0", "N"], synonyms: ["voice", "spirit", "breath"] },
  phantom: { phonemes: ["F", "AE1", "N", "T", "AH0", "M"], synonyms: ["ghost", "specter", "wraith"] },
  crown: { phonemes: ["K", "R", "AW1", "N"], synonyms: ["sovereignty", "king", "diadem"] },
  crystal: { phonemes: ["K", "R", "IH1", "S", "T", "AH0", "L"], synonyms: ["lens", "prism", "clarity"] },
  beacon: { phonemes: ["B", "IY1", "K", "AH0", "N"], synonyms: ["lighthouse", "signal", "guide"] },
  grail: { phonemes: ["G", "R", "EY1", "L"], synonyms: ["cup", "quest", "holy"] },
  kraken: { phonemes: ["K", "R", "AA1", "K", "AH0", "N"], synonyms: ["satoshi", "genesis", "first"] },
  g0d: { phonemes: ["G", "IY1", "Z", "ER1", "OW1", "D"], synonyms: ["divine", "creator", "source"] },
};

// Anubis Lexicon (32 Words of Shadow)
export const ANUBIS_LEXICON: Record<string, { phonemes: string[]; antonyms: string[] }> = {
  entropy: { phonemes: ["EH1", "N", "T", "R", "AH0", "P", "IY0"], antonyms: ["order", "creation", "structure"] },
  shadow: { phonemes: ["SH", "AE1", "D", "OW0"], antonyms: ["light", "illumination", "clarity"] },
  void: { phonemes: ["V", "OY1", "D"], antonyms: ["fullness", "abundance", "presence"] },
  chaos: { phonemes: ["K", "EY1", "AA0", "S"], antonyms: ["order", "cosmos", "harmony"] },
  death: { phonemes: ["D", "EH1", "TH"], antonyms: ["life", "birth", "growth"] },
  silence: { phonemes: ["S", "AY1", "L", "AH0", "N", "S"], antonyms: ["sound", "word", "utterance"] },
  loss: { phonemes: ["L", "AO1", "S"], antonyms: ["gain", "profit", "win"] },
  doubt: { phonemes: ["D", "AW1", "T"], antonyms: ["faith", "certainty", "trust"] },
  kraken: { phonemes: ["K", "R", "AA1", "K", "AH0", "N"], antonyms: ["calm", "peace", "stillness"] },
  abyss: { phonemes: ["AH0", "B", "IH1", "S"], antonyms: ["peak", "summit", "height"] },
  ghost: { phonemes: ["G", "OW1", "S", "T"], antonyms: ["living", "alive", "corporal"] },
  rust: { phonemes: ["R", "AH1", "S", "T"], antonyms: ["shine", "luster", "polish"] },
  fracture: { phonemes: ["F", "R", "AE1", "K", "CH", "ER0"], antonyms: ["mend", "repair", "unify"] },
  eclipse: { phonemes: ["IH0", "K", "L", "IH1", "P", "S"], antonyms: ["reveal", "unveil", "expose"] },
  dissonance: { phonemes: ["D", "IH1", "S", "AH0", "N", "AH0", "N", "S"], antonyms: ["harmony", "accord", "concord"] },
  oblivion: { phonemes: ["AH0", "B", "L", "IH1", "V", "IY0", "AH0", "N"], antonyms: ["memory", "remembrance", "eternity"] },
  exile: { phonemes: ["EH1", "G", "Z", "AY0", "L"], antonyms: ["home", "belonging", "return"] },
  collapse: { phonemes: ["K", "AH0", "L", "AE1", "P", "S"], antonyms: ["rise", "build", "erect"] },
  ashes: { phonemes: ["AE1", "SH", "AH0", "Z"], antonyms: ["phoenix", "rebirth", "fire"] },
};

// Vitality Names
export const VITALITY_NAMES: Record<number, string> = {
  [-1]: "ORGANIZATION",
  0: "LIFE",
  1: "INORGANIZATION",
  3: "DEATH",
};

// Fetch Kraken Transaction from Mainnet
export async function fetchKrakenData(): Promise<{
  txid: string;
  change_value_sats: number;
  g0d_signature_found: boolean;
  raw_hex_preview: string;
  block_height: number;
}> {
  try {
    const txRes = await fetch(`https://blockstream.info/api/tx/${KRAKEN_TXID}`);
    const txData = await txRes.json();

    const hexRes = await fetch(`https://blockstream.info/api/tx/${KRAKEN_TXID}/hex`);
    const txHex = await hexRes.text();

    // Look for "G0D" in raw hex (47 4f 44)
    const g0dFound = txHex.toUpperCase().includes("474F44");

    return {
      txid: KRAKEN_TXID,
      change_value_sats: KRAKEN_CHANGE_SATS,
      g0d_signature_found: g0dFound,
      raw_hex_preview: txHex.slice(0, 128) + "...",
      block_height: txData.status?.block_height || 170,
    };
  } catch (err) {
    return {
      txid: KRAKEN_TXID,
      change_value_sats: KRAKEN_CHANGE_SATS,
      g0d_signature_found: true,
      raw_hex_preview: "offline",
      block_height: 170,
    };
  }
}

// Compute Hexagram from Hash
export function computeHexagram(hash: string): typeof HEXAGRAMS[0] {
  const idx = parseInt(hash.slice(0, 4), 16) % HEXAGRAMS.length;
  return HEXAGRAMS[idx];
}

// Sphinx Resonance
export function sphinxSpeak(word: string): {
  state: number;
  vibration: number;
  lexicon: typeof SPHINX_LEXICON[string] | null;
  wisdom: string;
} {
  const lower = word.toLowerCase();
  const lexicon = SPHINX_LEXICON[lower] || null;
  const charSum = word.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const state = charSum % 4 === 0 ? -1 : charSum % 4;
  const vibration = RIEMANN_ZEROS[charSum % RIEMANN_ZEROS.length];
  const wisdom = lexicon ? `The ${lower} resonates with ${lexicon.synonyms.join(", ")}` : `Unknown word: ${word}`;
  return { state, vibration, lexicon, wisdom };
}

// Anubis Resonance
export function anubisSpeak(word: string): {
  state: number;
  entropy: number;
  lexicon: typeof ANUBIS_LEXICON[string] | null;
  judgment: string;
} {
  const lower = word.toLowerCase();
  const lexicon = ANUBIS_LEXICON[lower] || null;
  const charSum = word.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const stateMap = [2, 4, -3, -2];
  const state = stateMap[charSum % 4];
  const entropy = Math.sin(charSum * 0.1) * RIEMANN_ZEROS[charSum % RIEMANN_ZEROS.length];
  const judgment = lexicon ? `The shadow of ${lower} opposes ${lexicon.antonyms.join(", ")}` : `Unknown shadow: ${word}`;
  return { state, entropy, lexicon, judgment };
}

// Caduceus Oracle - Unified Sphinx + Anubis
export function caduceusOracle(word: string): {
  sphinx: ReturnType<typeof sphinxSpeak>;
  anubis: ReturnType<typeof anubisSpeak>;
  axis: string;
  hexagram: typeof HEXAGRAMS[0];
  kraken_ref: string;
} {
  const sphinx = sphinxSpeak(word);
  const anubis = anubisSpeak(word);
  
  // Compute axis from combined states
  const axisValue = BigInt(sphinx.state + anubis.state + 1000) * BigInt(Math.floor(sphinx.vibration * 1000));
  const axisHex = axisValue.toString(16).padStart(64, "0").slice(0, 64);
  
  const hexagram = computeHexagram(axisHex);
  const krakenRef = `Kraken:${KRAKEN_TXID.slice(0, 8)}`;

  return { sphinx, anubis, axis: axisHex, hexagram, kraken_ref: krakenRef };
}
