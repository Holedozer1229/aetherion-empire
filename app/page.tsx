import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { LiveStats } from "@/components/live-stats";
import { DeFiDashboard } from "@/components/defi-dashboard";
import { AetherionOracle } from "@/components/aetherion-oracle";
import { BugBountyHunter } from "@/components/bug-bounty-hunter";
import { WingmanAgent } from "@/components/wingman-agent";
import { BitcoinDashboard } from "@/components/bitcoin-dashboard";
import { MiningDashboard } from "@/components/mining-dashboard";
import { Achievements } from "@/components/achievements";
import { Leaderboard } from "@/components/leaderboard";
import { SocialProof } from "@/components/social-proof";
import { AuditReport } from "@/components/audit-report";
import { PayoutManifest } from "@/components/payout-manifest";
import { FeaturesSection } from "@/components/features-section";
import { ParticleField } from "@/components/particle-field";
import { Footer } from "@/components/footer";

export default function LuckyPalacePage() {
  return (
    <main className="min-h-screen relative">
      <ParticleField />
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <LiveStats />
        <DeFiDashboard />
        <AetherionOracle />
        <BugBountyHunter />
        <WingmanAgent />
        <BitcoinDashboard />
        <MiningDashboard />
        <Achievements />
        <Leaderboard />
        <SocialProof />
        <FeaturesSection />
        <AuditReport />
        <PayoutManifest />
        <Footer />
      </div>
    </main>
  );
}
