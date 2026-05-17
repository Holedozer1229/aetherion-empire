"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Key, AlertCircle, CheckCircle, Copy } from "lucide-react";

export function WalletConnectSetup() {
  const [projectId, setProjectId] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const currentId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'aetherion_sovereignty_v2';
  const isPlaceholder = currentId === 'aetherion_sovereignty_v2' || currentId === 'aetherion_sovereignty_key_v2';

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const envFileContent = `# Add this to your .env file
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=${projectId || 'your-project-id-here'}`;

  const phi = 1.618;
  const baseSize = 16;

  return (
    <Card 
      className="border-2 border-indigo-500/30 bg-gradient-to-br from-black via-indigo-950/20 to-purple-950/20 backdrop-blur-xl overflow-hidden relative"
      style={{ padding: `${baseSize * phi}px` }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
          backgroundSize: `${baseSize * phi}px ${baseSize * phi}px`
        }}></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-indigo-300 tracking-wider">
            ⚡ WALLETCONNECT PROJECT CONFIGURATION
          </h2>
        </div>

        {/* Status Banner */}
        <div className={`mb-6 p-4 rounded-lg border-2 ${
          isPlaceholder 
            ? 'bg-yellow-950/30 border-yellow-500/50' 
            : 'bg-emerald-950/30 border-emerald-500/50'
        }`}>
          <div className="flex items-center gap-3">
            {isPlaceholder ? (
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            )}
            <div className="flex-1">
              <div className={`text-sm font-bold ${
                isPlaceholder ? 'text-yellow-400' : 'text-emerald-400'
              }`}>
                {isPlaceholder ? 'TEMPORARY PLACEHOLDER ACTIVE' : 'CONFIGURED'}
              </div>
              <div className={`text-xs font-mono mt-1 ${
                isPlaceholder ? 'text-yellow-600' : 'text-emerald-600'
              }`}>
                Current ID: {currentId}
              </div>
            </div>
          </div>
        </div>

        {isPlaceholder && (
          <div className="mb-6 p-4 bg-red-950/20 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400 font-mono leading-relaxed">
              ⚠️ You are using a temporary placeholder Project ID. For production use and optimal WalletConnect functionality, 
              you must generate your own Project ID from WalletConnect Cloud.
            </p>
          </div>
        )}

        {/* Instructions Toggle */}
        <div className="mb-6">
          <Button
            onClick={() => setShowInstructions(!showInstructions)}
            variant="outline"
            className="w-full bg-indigo-950/30 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/30"
          >
            {showInstructions ? 'Hide' : 'Show'} Setup Instructions
          </Button>
        </div>

        {showInstructions && (
          <div className="mb-6 space-y-4">
            <div className="p-6 bg-indigo-950/30 border border-indigo-500/20 rounded-lg">
              <h3 className="text-sm font-bold text-indigo-300 mb-4">STEP-BY-STEP INSTRUCTIONS:</h3>
              <ol className="text-sm text-indigo-400 space-y-3 font-mono leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-indigo-500 font-bold">1.</span>
                  <div className="flex-1">
                    <div>Visit WalletConnect Cloud:</div>
                    <a 
                      href="https://cloud.walletconnect.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open cloud.walletconnect.com
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-500 font-bold">2.</span>
                  <span>Create a free account or sign in</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-500 font-bold">3.</span>
                  <span>Click "Create New Project"</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-500 font-bold">4.</span>
                  <div className="flex-1">
                    <div>Enter project details:</div>
                    <ul className="mt-2 ml-4 space-y-1 text-indigo-500">
                      <li>• Name: "Aetherion Empire" (or your choice)</li>
                      <li>• Homepage: Your domain or localhost</li>
                    </ul>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-500 font-bold">5.</span>
                  <span>Copy your Project ID from the dashboard</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-500 font-bold">6.</span>
                  <span>Paste the Project ID below and follow configuration steps</span>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Project ID Input */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-indigo-500/70 font-mono block mb-2">
              WALLETCONNECT PROJECT ID
            </label>
            <Input
              type="text"
              placeholder="Enter your WalletConnect Project ID..."
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="bg-indigo-950/20 border-indigo-500/30 text-indigo-200 font-mono placeholder:text-indigo-700/50"
            />
          </div>

          {projectId && (
            <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-indigo-400">ENV FILE CONFIGURATION:</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(envFileContent)}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <pre className="text-xs text-indigo-300 font-mono bg-black/50 p-3 rounded overflow-x-auto">
                {envFileContent}
              </pre>
              <div className="mt-3 text-xs text-indigo-500 space-y-1">
                <p>1. Copy the configuration above</p>
                <p>2. Add it to your /app/.env file</p>
                <p>3. Restart the development server: <code className="bg-black/50 px-1">sudo supervisorctl restart nextjs</code></p>
                <p>4. Refresh this page to verify</p>
              </div>
            </div>
          )}
        </div>

        {/* Documentation Links */}
        <div className="mt-6 pt-6 border-t border-indigo-500/20">
          <h4 className="text-xs font-bold text-indigo-400 mb-3">ADDITIONAL RESOURCES:</h4>
          <div className="space-y-2">
            <a 
              href="https://docs.walletconnect.com/cloud/relay" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-indigo-500 hover:text-indigo-400 font-mono"
            >
              <ExternalLink className="w-3 h-3" />
              WalletConnect Cloud Documentation
            </a>
            <a 
              href="https://docs.walletconnect.com/appkit/next/core/installation" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-indigo-500 hover:text-indigo-400 font-mono"
            >
              <ExternalLink className="w-3 h-3" />
              Next.js Integration Guide
            </a>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-6 p-4 bg-purple-950/20 border border-purple-500/20 rounded-lg text-center">
          <p className="text-xs text-purple-500/70 font-mono italic">
            ⚡ The 4-Team Autonomous Command continues uninterrupted. This configuration enhances, not blocks, sovereignty. ⚡
          </p>
        </div>
      </div>
    </Card>
  );
}
