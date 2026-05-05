"use client";

import Link from "next/link";
import { Crown, Github, Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gold-gradient">LUCKY PALACE</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              Advanced quantum-enhanced DeFi mining protocol with zero-knowledge proof verification. 
              Building the future of decentralized finance.
            </p>
            <p className="text-lg font-bold text-primary tracking-widest">IN CODE WE TRUST</p>
          </div>

          {/* Protocol */}
          <div>
            <h4 className="font-semibold mb-4">Protocol</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Mining Operations</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Audit Reports</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Payout History</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Whitepaper</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Smart Contracts</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Security Audits</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2024 Lucky Palace Protocol. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <MessageCircle className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
