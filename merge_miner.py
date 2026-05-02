#!/usr/bin/env python3
# Aetherion Merge-Mining Core - See /root/workspace/background/merge-mining-core/ for full source
# Auto-deployed to Render via aetherion-empire repo
from merge_mining_core import MergeMiningController, MiningConfig

if __name__ == '__main__':
    config = MiningConfig(cycle_seconds=0.1)
    controller = MergeMiningController(config)
    controller.run()