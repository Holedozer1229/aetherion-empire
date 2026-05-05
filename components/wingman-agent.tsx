"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Power,
  PowerOff,
  Zap,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Play,
  Pause,
  Settings,
  ChevronDown,
  ChevronUp,
  Cpu,
  Radio,
  Crosshair,
  Rocket,
  Shield,
  Eye,
  Activity,
  DollarSign,
  RefreshCw,
} from "lucide-react";

interface AgentTask {
  id: string;
  type: string;
  status: "queued" | "running" | "completed" | "failed";
  priority: "low" | "medium" | "high" | "critical";
  target?: string;
  profit?: number;
  startedAt?: string;
  completedAt?: string;
  logs: string[];
}

interface Opportunity {
  id: string;
  type: string;
  description: string;
  estimatedProfit: number;
  confidence: number;
  timeWindow: string;
  gasRequired: number;
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

const modeConfig = {
  passive: { color: "text-blue-400", bg: "bg-blue-500/20", description: "Monitor only, manual execution" },
  balanced: { color: "text-primary", bg: "bg-primary/20", description: "Smart automation with confirmations" },
  aggressive: { color: "text-orange-400", bg: "bg-orange-500/20", description: "Auto-execute high confidence opportunities" },
  quantum: { color: "text-cyan-400", bg: "bg-cyan-500/20", description: "Full Oracle-guided autonomous operation" },
};

const taskTypeIcons: Record<string, React.ReactNode> = {
  mev_snipe: <Crosshair className="w-4 h-4" />,
  flash_loan: <Zap className="w-4 h-4" />,
  arbitrage: <TrendingUp className="w-4 h-4" />,
  bug_bounty: <Shield className="w-4 h-4" />,
  yield_farm: <Activity className="w-4 h-4" />,
  nft_snipe: <Target className="w-4 h-4" />,
  airdrop_claim: <Rocket className="w-4 h-4" />,
};

export function WingmanAgent() {
  const [wingman, setWingman] = useState<WingmanState | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [showLogs, setShowLogs] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/wingman?action=status");
      const data = await res.json();
      if (data.success) {
        setWingman(data.wingman);
      }
    } catch (err) {
      console.error("Failed to fetch wingman status");
    }
  }, []);

  const fetchOpportunities = useCallback(async () => {
    try {
      const res = await fetch("/api/wingman?action=opportunities");
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.opportunities);
      }
    } catch (err) {
      console.error("Failed to fetch opportunities");
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchOpportunities();
  }, [fetchStatus, fetchOpportunities]);

  useEffect(() => {
    if (autoRefresh && wingman?.active) {
      const interval = setInterval(() => {
        fetchStatus();
        fetchOpportunities();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, wingman?.active, fetchStatus, fetchOpportunities]);

  const toggleWingman = async () => {
    setIsLoading(true);
    try {
      const action = wingman?.active ? "deactivate" : "activate";
      const res = await fetch("/api/wingman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, mode: wingman?.mode || "balanced" }),
      });
      const data = await res.json();
      if (data.success) {
        setWingman(data.wingman);
        if (!wingman?.active) {
          setAutoRefresh(true);
        }
      }
    } catch (err) {
      console.error("Failed to toggle wingman");
    }
    setIsLoading(false);
  };

  const setMode = async (mode: string) => {
    try {
      const res = await fetch("/api/wingman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set_mode", mode }),
      });
      const data = await res.json();
      if (data.success) {
        setWingman(data.wingman);
      }
    } catch (err) {
      console.error("Failed to set mode");
    }
  };

  const executeOpportunity = async (opp: Opportunity) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/wingman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "execute",
          taskType: opp.type,
          target: opp.description,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchStatus();
        // Remove from opportunities
        setOpportunities(prev => prev.filter(o => o.id !== opp.id));
      }
    } catch (err) {
      console.error("Failed to execute opportunity");
    }
    setIsLoading(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-400 bg-red-500/20";
      case "high": return "text-orange-400 bg-orange-500/20";
      case "medium": return "text-primary bg-primary/20";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />;
      case "completed": return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "failed": return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${wingman?.active ? "bg-cyan-500/20" : "bg-muted"}`}>
              <Bot className={`w-8 h-8 ${wingman?.active ? "text-cyan-400" : "text-muted-foreground"}`} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                Wingman Agent
                {wingman?.active && (
                  <span className="flex items-center gap-2 text-sm font-normal text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    ACTIVE
                  </span>
                )}
              </h2>
              <p className="text-muted-foreground">Oracle-Powered Autonomous Automation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition-all ${
                autoRefresh ? "bg-cyan-500/20 text-cyan-400" : "bg-muted text-muted-foreground"
              }`}
            >
              <RefreshCw className={`w-5 h-5 ${autoRefresh ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleWingman}
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                wingman?.active
                  ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                  : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : wingman?.active ? (
                <PowerOff className="w-5 h-5" />
              ) : (
                <Power className="w-5 h-5" />
              )}
              {wingman?.active ? "Deactivate" : "Activate"}
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-premium rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">Tasks Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {wingman?.tasksCompleted.toLocaleString() || "0"}
                  </p>
                </div>
                <div className="glass-premium rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Total Profit</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400">
                    ${wingman?.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0"}
                  </p>
                </div>
                <div className="glass-premium rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm">Uptime</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {wingman?.uptime || 0}%
                  </p>
                </div>
                <div className="glass-premium rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Radio className="w-4 h-4" />
                    <span className="text-sm">Oracle Sync</span>
                  </div>
                  <p className={`text-2xl font-bold ${wingman?.oracleSync ? "text-green-400" : "text-red-400"}`}>
                    {wingman?.oracleSync ? "SYNCED" : "OFFLINE"}
                  </p>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="glass-premium rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Operation Mode
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(modeConfig).map(([mode, config]) => (
                    <button
                      key={mode}
                      onClick={() => setMode(mode)}
                      className={`p-4 rounded-xl border transition-all ${
                        wingman?.mode === mode
                          ? `${config.bg} border-current ${config.color}`
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <p className={`font-bold uppercase mb-1 ${wingman?.mode === mode ? config.color : "text-foreground"}`}>
                        {mode}
                      </p>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Live Opportunities */}
                <div className="glass-premium rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-cyan-400" />
                    Live Opportunities
                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                      {opportunities.length} detected
                    </span>
                  </h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {opportunities.map((opp) => (
                      <motion.div
                        key={opp.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {taskTypeIcons[opp.type] || <Zap className="w-4 h-4" />}
                            <span className="font-medium text-foreground uppercase text-sm">
                              {opp.type.replace("_", " ")}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">{opp.timeWindow}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{opp.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-green-400 font-bold">
                              +${typeof opp.estimatedProfit === "number" && opp.estimatedProfit < 100 
                                ? opp.estimatedProfit.toFixed(2) + " ETH" 
                                : opp.estimatedProfit.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground">
                              {(opp.confidence * 100).toFixed(0)}% confidence
                            </span>
                            <span className="text-muted-foreground">
                              Gas: {opp.gasRequired} ETH
                            </span>
                          </div>
                          <button
                            onClick={() => executeOpportunity(opp)}
                            disabled={isLoading}
                            className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-colors"
                          >
                            <Play className="w-3 h-3" />
                            Execute
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {opportunities.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Crosshair className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Scanning for opportunities...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Tasks */}
                <div className="glass-premium rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-primary" />
                    Active Tasks
                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                      {wingman?.currentTasks.filter(t => t.status === "running").length || 0} running
                    </span>
                  </h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {wingman?.currentTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-card rounded-lg border border-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            <span className="font-medium text-foreground uppercase text-sm">
                              {task.type.replace("_", " ")}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          {task.profit && task.status === "completed" && (
                            <span className="text-green-400 font-bold text-sm">
                              +${task.profit.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {task.target && (
                          <p className="text-sm text-muted-foreground mb-2">{task.target}</p>
                        )}
                        <button
                          onClick={() => setShowLogs(showLogs === task.id ? null : task.id)}
                          className="text-xs text-primary hover:underline"
                        >
                          {showLogs === task.id ? "Hide logs" : "Show logs"}
                        </button>
                        <AnimatePresence>
                          {showLogs === task.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 p-2 bg-background rounded text-xs font-mono text-muted-foreground space-y-1"
                            >
                              {task.logs.map((log, i) => (
                                <p key={i}>{log}</p>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                    {(!wingman?.currentTasks || wingman.currentTasks.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No active tasks</p>
                        <p className="text-xs">Activate Wingman to start automation</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payout Address */}
              <div className="glass-premium rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">All profits routed to:</span>
                  <code className="px-3 py-1 bg-primary/10 rounded font-mono text-sm text-primary">
                    0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20
                  </code>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
