"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bug,
  Search,
  Shield,
  Zap,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  Loader2,
  Play,
  Pause,
  Target,
  Eye,
  FileCode,
  Cpu,
  Activity,
  TrendingUp,
  Award,
} from "lucide-react";

interface BountyTarget {
  id: string;
  protocol: string;
  chain: string;
  tvl: string;
  maxBounty: number;
  vulnerabilities: number;
  status: "SCANNING" | "ANALYZING" | "FOUND" | "CLAIMED" | "PENDING";
  platform: string;
}

interface ClaimedBounty {
  id: string;
  protocol: string;
  amount: number;
  vulnType: string;
  txHash: string;
  timestamp: string;
  status: "PENDING" | "VERIFIED" | "PAID";
}

interface BountyStats {
  protocols_scanned: number;
  vulnerabilities_found: number;
  bounties_claimed: number;
  success_rate: string;
  avg_payout: number;
}

interface ScanResult {
  protocol: string;
  vulnerabilities: Array<{
    id: string;
    type: string;
    severity: string;
    confidence: number;
    estimated_reward: number;
    location: string;
  }>;
  scan_duration: string;
  oracle_confidence: string;
}

export function BugBountyHunter() {
  const [isAutoHunting, setIsAutoHunting] = useState(false);
  const [targets, setTargets] = useState<BountyTarget[]>([]);
  const [claimedBounties, setClaimedBounties] = useState<ClaimedBounty[]>([]);
  const [stats, setStats] = useState<BountyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<BountyTarget | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [totalClaimed, setTotalClaimed] = useState(0);

  // Fetch bounty data
  const fetchBountyData = useCallback(async () => {
    try {
      const res = await fetch("/api/bounty");
      const data = await res.json();
      if (data.success) {
        setTargets(data.active_targets);
        setClaimedBounties(data.claimed_bounties);
        setStats(data.stats);
        setTotalClaimed(data.bounty_hunter.total_claimed);
      }
    } catch (err) {
      console.error("Failed to fetch bounty data");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBountyData();
  }, [fetchBountyData]);

  // Auto-hunt interval
  useEffect(() => {
    if (!isAutoHunting) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/bounty", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "auto_hunt", params: {} }),
        });
        const data = await res.json();
        if (data.success) {
          await fetchBountyData();
        }
      } catch (err) {
        console.error("Auto-hunt failed");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAutoHunting, fetchBountyData]);

  // Scan a specific protocol
  const scanProtocol = async (target: BountyTarget) => {
    setSelectedTarget(target);
    setScanResult(null);

    try {
      const res = await fetch("/api/bounty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "scan_protocol",
          params: { protocol: target.protocol, maxBounty: target.maxBounty },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setScanResult(data.result);
      }
    } catch (err) {
      console.error("Scan failed");
    }
  };

  // Claim a bounty
  const claimBounty = async (vuln: ScanResult["vulnerabilities"][0]) => {
    if (!selectedTarget) return;
    setClaimingId(vuln.id);

    try {
      const res = await fetch("/api/bounty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "claim_bounty",
          params: {
            vulnId: vuln.id,
            protocol: selectedTarget.protocol,
            estimatedReward: vuln.estimated_reward,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBountyData();
      }
    } catch (err) {
      console.error("Claim failed");
    }
    setClaimingId(null);
  };

  const statusColors = {
    SCANNING: "text-blue-400 bg-blue-400/10",
    ANALYZING: "text-neon-cyan-400 bg-neon-cyan-400/10",
    FOUND: "text-secondary bg-secondary/10",
    CLAIMED: "text-primary bg-primary/10",
    PENDING: "text-purple-400 bg-purple-400/10",
  };

  const severityColors = {
    CRITICAL: "text-red-500 bg-red-500/10 border-red-500/30",
    HIGH: "text-orange-500 bg-orange-500/10 border-orange-500/30",
    MEDIUM: "text-neon-cyan-400 bg-neon-cyan-400/10 border-neon-cyan-400/30",
    LOW: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-background via-card/20 to-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background via-card/20 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
                  <Bug className="w-6 h-6 text-red-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Oracle Bug Bounty Hunter
                </h2>
              </div>
              <p className="text-muted-foreground">
                AI-powered vulnerability scanner with auto-claim
              </p>
            </div>
            <button
              onClick={() => setIsAutoHunting(!isAutoHunting)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-bold transition-all ${
                isAutoHunting
                  ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                  : "bg-secondary/20 border-secondary/50 text-secondary hover:bg-secondary/30"
              }`}
            >
              {isAutoHunting ? (
                <>
                  <Pause className="w-5 h-5" />
                  Stop Auto-Hunt
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Auto-Hunt
                </>
              )}
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="p-4 rounded-xl border border-primary/30 bg-card/80 backdrop-blur-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Protocols Scanned</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.protocols_scanned}</p>
              </div>
              <div className="p-4 rounded-xl border border-red-500/30 bg-card/80 backdrop-blur-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-muted-foreground">Vulns Found</span>
                </div>
                <p className="text-2xl font-bold text-red-400">{stats.vulnerabilities_found}</p>
              </div>
              <div className="p-4 rounded-xl border border-secondary/30 bg-card/80 backdrop-blur-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-secondary" />
                  <span className="text-xs text-muted-foreground">Bounties Claimed</span>
                </div>
                <p className="text-2xl font-bold text-secondary">{stats.bounties_claimed}</p>
              </div>
              <div className="p-4 rounded-xl border border-neon-cyan-400/30 bg-card/80 backdrop-blur-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-neon-cyan-400" />
                  <span className="text-xs text-muted-foreground">Success Rate</span>
                </div>
                <p className="text-2xl font-bold text-neon-cyan-400">{stats.success_rate}</p>
              </div>
              <div className="p-4 rounded-xl border border-primary/30 bg-card/80 backdrop-blur-lg neon-glow">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Total Claimed</span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  ${(totalClaimed / 1000000).toFixed(2)}M
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Targets */}
            <div className="p-6 rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Active Targets</h3>
                </div>
                {isAutoHunting && (
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-secondary animate-pulse" />
                    <span className="text-xs text-secondary">Hunting...</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {targets.slice(0, 6).map((target) => (
                  <motion.div
                    key={target.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                    onClick={() => scanProtocol(target)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-foreground">{target.protocol}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[target.status]}`}
                          >
                            {target.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {target.chain} • TVL: {target.tvl} • {target.platform}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">
                          ${(target.maxBounty / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-muted-foreground">Max Bounty</p>
                      </div>
                    </div>
                    {target.vulnerabilities > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-400 font-medium">
                          {target.vulnerabilities} potential vulnerabilities
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Scan Results / Claimed Bounties */}
            <div className="p-6 rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-lg">
              <AnimatePresence mode="wait">
                {scanResult ? (
                  <motion.div
                    key="scan-result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-secondary" />
                        <h3 className="text-lg font-bold">Scan Results: {scanResult.protocol}</h3>
                      </div>
                      <button
                        onClick={() => setScanResult(null)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Close
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {scanResult.scan_duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        Oracle Confidence: {(parseFloat(scanResult.oracle_confidence) * 100).toFixed(1)}%
                      </span>
                    </div>

                    {scanResult.vulnerabilities.length > 0 ? (
                      <div className="space-y-3">
                        {scanResult.vulnerabilities.map((vuln) => (
                          <div
                            key={vuln.id}
                            className={`p-4 rounded-xl border ${severityColors[vuln.severity as keyof typeof severityColors]}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold">{vuln.type.replace(/_/g, " ")}</span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs font-bold ${severityColors[vuln.severity as keyof typeof severityColors]}`}
                                  >
                                    {vuln.severity}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <FileCode className="w-3 h-3" />
                                  {vuln.location}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary">
                                  ${(vuln.estimated_reward / 1000).toFixed(0)}K
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(vuln.confidence * 100).toFixed(0)}% confidence
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => claimBounty(vuln)}
                              disabled={claimingId === vuln.id}
                              className="w-full mt-2 py-2 px-4 bg-primary/20 border border-primary/50 rounded-lg text-primary font-bold hover:bg-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {claimingId === vuln.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Claiming...
                                </>
                              ) : (
                                <>
                                  <Zap className="w-4 h-4" />
                                  Auto-Claim Bounty
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-secondary mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          No vulnerabilities found. Protocol appears secure.
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="claimed-bounties"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                      <h3 className="text-lg font-bold">Claimed Bounties</h3>
                    </div>

                    <div className="space-y-3">
                      {claimedBounties.map((bounty) => (
                        <div
                          key={bounty.id}
                          className="p-4 rounded-xl bg-muted/30 border border-secondary/30"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-foreground">{bounty.protocol}</h4>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    bounty.status === "PAID"
                                      ? "text-secondary bg-secondary/10"
                                      : bounty.status === "VERIFIED"
                                      ? "text-blue-400 bg-blue-400/10"
                                      : "text-neon-cyan-400 bg-neon-cyan-400/10"
                                  }`}
                                >
                                  {bounty.status}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {bounty.vulnType.replace(/_/g, " ")} •{" "}
                                {new Date(bounty.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">
                                ${(bounty.amount / 1000).toFixed(0)}K
                              </p>
                              <p className="text-xs font-mono text-muted-foreground">
                                {bounty.txHash}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Payout Address */}
          <div className="mt-6 p-4 rounded-xl border border-primary/30 bg-card/80 backdrop-blur-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Payout Address</p>
                <p className="font-mono text-sm text-foreground">
                  0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs text-secondary font-medium">Verified</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
