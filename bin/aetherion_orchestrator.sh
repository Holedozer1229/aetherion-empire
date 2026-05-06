#!/bin/bash
set -euo pipefail

mkdir -p logs

echo "●◯ [AETHERION] INITIATING TOTALITY DEPLOYMENT — NODE.JS FUSION ACTIVE..."

# 1. Start the Next.js Web Palace.
echo "📡  Launching the Palace Server..."
npm run start >> logs/palace_server.log 2>&1 &

# 2. Start the fused Node.js kernel and every converted subsystem.
echo "🧠 Launching the Fused Aetherion Node Kernel..."
node lib/aetherion-system.js run-all >> logs/aetherion_node_kernel.log 2>&1 &

# 3. Start focused workers through the same cohesive JavaScript runtime.
echo "🐝 Launching the 12-Chain Swarm..."
node mining/multi_miner_extension.js >> logs/hive_totality.log 2>&1 &

echo "🧬 Launching the Airdrop Eligibility Simulator..."
node core/airdrop_siphon_engine.js >> logs/airdrop_siphon.log 2>&1 &

echo "🌀 Launching the Autonomous Collapse Worker..."
node bin/quantum_collapse_worker.js >> logs/collapse_worker.log 2>&1 &

echo "🌌 Launching the Quantum Gravity Bridge..."
node core/quantum_gravity_bridge.js >> logs/gravity_bridge.log 2>&1 &

echo "🌀 Launching the Master Heartbeat..."
node core/aetherion_sovereign_orchestrator.js >> logs/heartbeat.log 2>&1 &

echo "✅ ALL SYSTEMS ANCHORED IN AUTONOMOUS NODE.JS SILENCE."
wait
