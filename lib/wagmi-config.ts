import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Lucky Palace",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "21fef48091f12692cad574a6f7753643",
  chains: [mainnet, polygon, arbitrum, optimism, base, sepolia],
  ssr: false,
});
