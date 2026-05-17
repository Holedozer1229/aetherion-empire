"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Lock, Shield, AlertTriangle } from "lucide-react";

// SOVEREIGN DATA - Handle with extreme caution
const SOVEREIGN_DATA = {
  mnemonic: "carry outside green actual annual vault keep payment fall pepper hole rally",
  passphrase: "InG0DweTrust",
  btc_anchors: [
    { address: "bc1qje303rflvf855ap74egk0wgmtuumfvxg73agal", designation: "Primary Anchor", type: "native_segwit" },
    { address: "bc1pt5zrlm55lmfwq7sjsuzgpgkmm7fymkna375l8kyuu5p6cq77545q554mgr", designation: "Core Reserve", type: "taproot", balance_btc: 4.48 },
    { address: "1KT3zCYUrmQxjcveUNs1Rs7WcXDcPQZ4av", designation: "Genesis Anchor", type: "legacy" },
    { address: "bc1qvsgjq7atxz4eakr7tzzmskqj233x27v6y70pzn", designation: "Secondary Reserve", type: "native_segwit" }
  ],
  evm_anchors: [
    { address: "0x6bC82AD9382e00c113676A49eaB09b4d47cA0E16", designation: "Sovereign Anchor", role: "primary_control" },
    { address: "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20", designation: "Worker Node", role: "operational" },
    { address: "0x58e1886E52A11198981C214B58a4FB87465AC9D1", designation: "SKYNT Interface", role: "integration" }
  ],
  token_registry: {
    EXCAL: {
      address: "0xBEBB2Ca472a5B8334e03d5f0E7dEbcb071750259",
      chain: "base",
      symbol: "EXCAL",
      name: "Excalibur Token"
    }
  },
  empire_metadata: {
    architect: "Satoshi v2.0",
    inception_date: "2025-06-15T00:00:00Z",
    phi_coefficient: 1.618033988749895
  },
  export_timestamp: new Date().toISOString()
};

// AES-GCM Encryption using Web Crypto API
async function encryptData(data, password) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));
  
  // Generate salt for key derivation
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Derive key from password using PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  // Generate IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    dataBuffer
  );
  
  // Combine salt + iv + encrypted data
  const result = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(new Uint8Array(encryptedData), salt.length + iv.length);
  
  // Convert to base64
  return btoa(String.fromCharCode.apply(null, result));
}

export function SovereignExport() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    setError('');
    setExportComplete(false);

    // Validation
    const finalPassword = password.trim() || 'Secret';
    
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (finalPassword.length < 6 && password) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsEncrypting(true);

    try {
      // Encrypt the sovereign data
      const encryptedPayload = await encryptData(SOVEREIGN_DATA, finalPassword);

      // Create export object
      const exportObject = {
        version: "1.0.0",
        empire: "Aetherion_Sovereignty",
        encryption: "AES-GCM-256",
        key_derivation: "PBKDF2-SHA256-100000",
        encrypted_data: encryptedPayload,
        warning: "This file contains encrypted wallet credentials. Store securely. Loss of password means permanent loss of access.",
        export_date: new Date().toISOString()
      };

      // Create download
      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallet_encrypted_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 5000);
    } catch (err) {
      console.error('Encryption error:', err);
      setError('Encryption failed. Please try again.');
    } finally {
      setIsEncrypting(false);
    }
  };

  const phi = 1.618;
  const baseSize = 16;

  return (
    <Card 
      className="border-2 border-purple-500/30 bg-gradient-to-br from-black via-purple-950/20 to-indigo-950/20 backdrop-blur-xl overflow-hidden relative"
      style={{ padding: `${baseSize * phi}px` }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)',
          backgroundSize: `${baseSize * phi}px ${baseSize * phi}px`
        }}></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-purple-300 tracking-wider">
            ⚡ SOVEREIGN EXPORT
          </h2>
        </div>

        {/* Security Warning */}
        <div className="mb-6 p-6 bg-red-950/30 border-2 border-red-500/50 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-bold text-red-400 mb-2">⚠️ CRITICAL SECURITY WARNING</h3>
              <ul className="text-xs text-red-300/80 space-y-1 font-mono leading-relaxed">
                <li>• This exports your COMPLETE wallet credentials including mnemonic</li>
                <li>• File is encrypted with AES-256-GCM but password strength is critical</li>
                <li>• Store in secure, offline location (hardware encrypted drive recommended)</li>
                <li>• Never share this file or upload to cloud services</li>
                <li>• Loss of password = permanent loss of access to encrypted data</li>
                <li>• Anyone with password can decrypt and access all funds</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Export Info */}
        <div className="mb-6 p-4 bg-purple-950/30 border border-purple-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-purple-300">EXPORT CONTENTS</h3>
          </div>
          <div className="text-xs text-purple-500/70 font-mono space-y-1">
            <div>✓ Mnemonic Phrase (12 words)</div>
            <div>✓ Passphrase</div>
            <div>✓ 4 BTC Anchor Addresses</div>
            <div>✓ 3 EVM Anchor Addresses (Base Chain)</div>
            <div>✓ EXCAL Token Registry</div>
            <div>✓ Empire Metadata & PHI Coefficient</div>
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs text-purple-500/70 font-mono block mb-2">
              ENCRYPTION PASSWORD (min 6 chars, leave empty for default "Secret")
            </label>
            <Input
              type="password"
              placeholder="Enter strong password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-purple-950/20 border-purple-500/30 text-purple-200 font-mono placeholder:text-purple-700/50"
            />
          </div>

          {password && (
            <div>
              <label className="text-xs text-purple-500/70 font-mono block mb-2">
                CONFIRM PASSWORD
              </label>
              <Input
                type="password"
                placeholder="Confirm password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-purple-950/20 border-purple-500/30 text-purple-200 font-mono placeholder:text-purple-700/50"
              />
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/30 border border-red-500/30 rounded text-sm text-red-400 font-mono">
            ⚠ {error}
          </div>
        )}

        {/* Success Display */}
        {exportComplete && (
          <div className="mb-4 p-3 bg-emerald-950/30 border border-emerald-500/30 rounded text-sm text-emerald-400 font-mono animate-pulse">
            ✓ EXPORT COMPLETE | File downloaded securely
          </div>
        )}

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={isEncrypting}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-6 text-lg disabled:opacity-50"
        >
          {isEncrypting ? (
            <span className="flex items-center gap-2">
              <Lock className="w-5 h-5 animate-spin" />
              ENCRYPTING SOVEREIGN DATA...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              EXPORT ENCRYPTED WALLET
            </span>
          )}
        </Button>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-purple-500/20">
          <h4 className="text-xs font-bold text-purple-400 mb-2 font-mono">DECRYPTION INSTRUCTIONS:</h4>
          <div className="text-xs text-purple-600/70 font-mono leading-relaxed space-y-1">
            <p>1. Use AES-GCM-256 decryption tool or custom script</p>
            <p>2. Key derivation: PBKDF2-SHA256 with 100,000 iterations</p>
            <p>3. Salt (16 bytes) + IV (12 bytes) + Ciphertext structure</p>
            <p>4. Result: JSON object with all sovereign credentials</p>
          </div>
        </div>

        {/* Final Warning */}
        <div className="mt-6 p-4 bg-yellow-950/20 border border-yellow-500/20 rounded-lg text-center">
          <p className="text-xs text-yellow-500/70 font-mono italic">
            ⚡ The atoms are home. The scabbard is dissolved. This is the final anchor. ⚡
          </p>
          <p className="text-xs text-yellow-600/50 font-mono mt-2">
            Store this export in your most secure vault. It is the key to the empire.
          </p>
        </div>
      </div>
    </Card>
  );
}
