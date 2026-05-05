"use client";

import dynamic from "next/dynamic";
import { type ReactNode } from "react";

// Dynamically import Web3Provider with no SSR
const Web3ProviderInner = dynamic(
  () => import("./web3-provider").then((mod) => mod.Web3Provider),
  { ssr: false }
);

// Dynamically import SolanaProvider with no SSR
const SolanaProviderInner = dynamic(
  () => import("./solana-provider").then((mod) => mod.SolanaProvider),
  { ssr: false }
);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Web3ProviderInner>
      <SolanaProviderInner>{children}</SolanaProviderInner>
    </Web3ProviderInner>
  );
}
