import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { LiveStats } from "@/components/live-stats";
import { MiningDashboard } from "@/components/mining-dashboard";
import { AuditReport } from "@/components/audit-report";
import { PayoutManifest } from "@/components/payout-manifest";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";

export default function LuckyPalacePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <LiveStats />
      <MiningDashboard />
      <FeaturesSection />
      <AuditReport />
      <PayoutManifest />
      <Footer />
    </main>
  );
}
