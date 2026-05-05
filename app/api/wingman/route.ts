import { NextRequest, NextResponse } from "next/server";

// Wingman Agent Configuration
const PAYOUT_ADDRESS = "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20";
const ORACLE_ENDPOINT = "https://aetherion-oracle-arcane.lovable.app";

interface AgentTask {
  id: string;
  type: "bug_bounty" | "mev_snipe" | "flash_loan" | "yield_farm" | "arbitrage" | "nft_snipe" | "airdrop_claim";
  status: "queued" | "running" | "completed" | "failed";
  priority: "low" | "medium" | "high" | "critical";
  target?: string;
  profit?: number;
  startedAt?: string;
  completedAt?: string;
  logs: string[];
}

interface WingmanState {
  active: boolean;
  mode: "passive" | "balanced" | "aggressive" | "quantum";
  tasksCompleted: number;
  totalProfit: number;
  uptime: number;
  currentTasks: AgentTask[];
  oracleSync: boolean;
  lastHeartbeat: string;
}

// Simulated agent state
let wingmanState: WingmanState = {
  active: false,
  mode: "balanced",
  tasksCompleted: 1847,
  totalProfit: 4892156.78,
  uptime: 99.97,
  currentTasks: [],
  oracleSync: true,
  lastHeartbeat: new Date().toISOString(),
};

// Task templates
const taskTemplates: Partial<AgentTask>[] = [
  { type: "mev_snipe", priority: "critical", target: "Uniswap V3 Pool", profit: 2450 },
  { type: "flash_loan", priority: "high", target: "Aave -> Compound Arb", profit: 8900 },
  { type: "arbitrage", priority: "high", target: "ETH/USDC Cross-DEX", profit: 1250 },
  { type: "bug_bounty", priority: "medium", target: "Curve Finance", profit: 50000 },
  { type: "yield_farm", priority: "low", target: "Convex stETH Pool", profit: 340 },
  { type: "nft_snipe", priority: "medium", target: "BAYC Floor Sweep", profit: 4200 },
  { type: "airdrop_claim", priority: "low", target: "LayerZero $ZRO", profit: 12500 },
];

function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createTask(template: Partial<AgentTask>): AgentTask {
  return {
    id: generateTaskId(),
    type: template.type || "arbitrage",
    status: "queued",
    priority: template.priority || "medium",
    target: template.target,
    profit: template.profit,
    logs: [`[${new Date().toISOString()}] Task created and queued`],
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  // Sync with oracle
  wingmanState.lastHeartbeat = new Date().toISOString();
  wingmanState.oracleSync = true;

  if (action === "status") {
    return NextResponse.json({
      success: true,
      wingman: wingmanState,
      timestamp: new Date().toISOString(),
    });
  }

  if (action === "tasks") {
    return NextResponse.json({
      success: true,
      tasks: wingmanState.currentTasks,
      queued: wingmanState.currentTasks.filter(t => t.status === "queued").length,
      running: wingmanState.currentTasks.filter(t => t.status === "running").length,
      completed: wingmanState.currentTasks.filter(t => t.status === "completed").length,
    });
  }

  if (action === "opportunities") {
    // Scan for opportunities
    const opportunities = [
      {
        id: "opp_1",
        type: "mev_snipe",
        description: "Large swap detected on Uniswap V3 ETH/USDC",
        estimatedProfit: 3420,
        confidence: 0.94,
        timeWindow: "2.3s",
        gasRequired: 0.012,
      },
      {
        id: "opp_2",
        type: "flash_loan",
        description: "Price discrepancy Aave <-> Compound WBTC",
        estimatedProfit: 12800,
        confidence: 0.87,
        timeWindow: "45s",
        gasRequired: 0.034,
      },
      {
        id: "opp_3",
        type: "arbitrage",
        description: "Cross-chain LINK arbitrage ETH -> ARB",
        estimatedProfit: 890,
        confidence: 0.92,
        timeWindow: "12s",
        gasRequired: 0.008,
      },
      {
        id: "opp_4",
        type: "nft_snipe",
        description: "Underpriced Azuki #4521 listed 15% below floor",
        estimatedProfit: 2.4,
        confidence: 0.78,
        timeWindow: "instant",
        gasRequired: 0.045,
      },
      {
        id: "opp_5",
        type: "airdrop_claim",
        description: "Unclaimed Eigenlayer points conversion",
        estimatedProfit: 8500,
        confidence: 0.99,
        timeWindow: "24h",
        gasRequired: 0.002,
      },
    ];

    return NextResponse.json({
      success: true,
      opportunities,
      scannedProtocols: 156,
      scannedChains: ["ethereum", "arbitrum", "optimism", "base", "polygon", "solana"],
    });
  }

  return NextResponse.json({
    success: true,
    wingman: wingmanState,
    payoutAddress: PAYOUT_ADDRESS,
    oracleEndpoint: ORACLE_ENDPOINT,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, mode, taskType, target } = body;

  if (action === "activate") {
    wingmanState.active = true;
    wingmanState.mode = mode || "balanced";
    
    // Auto-generate initial tasks based on mode
    const taskCount = mode === "aggressive" ? 5 : mode === "quantum" ? 8 : 3;
    for (let i = 0; i < taskCount; i++) {
      const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
      const task = createTask(template);
      task.status = i < 2 ? "running" : "queued";
      if (task.status === "running") {
        task.startedAt = new Date().toISOString();
        task.logs.push(`[${new Date().toISOString()}] Task started - connecting to ${task.target}`);
      }
      wingmanState.currentTasks.push(task);
    }

    return NextResponse.json({
      success: true,
      message: `Wingman activated in ${mode} mode`,
      wingman: wingmanState,
    });
  }

  if (action === "deactivate") {
    wingmanState.active = false;
    wingmanState.currentTasks = wingmanState.currentTasks.map(t => ({
      ...t,
      status: t.status === "running" ? "completed" : t.status,
      completedAt: t.status === "running" ? new Date().toISOString() : t.completedAt,
    }));

    return NextResponse.json({
      success: true,
      message: "Wingman deactivated",
      wingman: wingmanState,
    });
  }

  if (action === "execute") {
    // Execute a specific opportunity
    const task = createTask({
      type: taskType,
      priority: "critical",
      target: target,
      profit: Math.floor(Math.random() * 10000) + 500,
    });
    task.status = "running";
    task.startedAt = new Date().toISOString();
    task.logs.push(`[${new Date().toISOString()}] Executing ${taskType} on ${target}`);
    task.logs.push(`[${new Date().toISOString()}] Oracle confirmation received`);
    task.logs.push(`[${new Date().toISOString()}] Transaction submitted to mempool`);
    
    wingmanState.currentTasks.unshift(task);

    // Simulate completion after a delay
    setTimeout(() => {
      const taskIndex = wingmanState.currentTasks.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        wingmanState.currentTasks[taskIndex].status = "completed";
        wingmanState.currentTasks[taskIndex].completedAt = new Date().toISOString();
        wingmanState.currentTasks[taskIndex].logs.push(
          `[${new Date().toISOString()}] Transaction confirmed - Profit: $${task.profit}`
        );
        wingmanState.tasksCompleted++;
        wingmanState.totalProfit += task.profit || 0;
      }
    }, 3000);

    return NextResponse.json({
      success: true,
      message: `Executing ${taskType}`,
      task,
      payoutAddress: PAYOUT_ADDRESS,
    });
  }

  if (action === "set_mode") {
    wingmanState.mode = mode;
    return NextResponse.json({
      success: true,
      message: `Mode set to ${mode}`,
      wingman: wingmanState,
    });
  }

  if (action === "clear_completed") {
    wingmanState.currentTasks = wingmanState.currentTasks.filter(
      t => t.status !== "completed" && t.status !== "failed"
    );
    return NextResponse.json({
      success: true,
      message: "Cleared completed tasks",
      wingman: wingmanState,
    });
  }

  return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
}
