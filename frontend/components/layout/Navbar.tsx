"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, Store, ShieldCheck, FileText, Settings, Wallet, ArrowRightLeft } from "lucide-react";
import { useWallet } from "../providers/wallet-provider";
import { SystemStatusWidget } from "./SystemStatusWidget";

export function Navbar() {
  const pathname = usePathname();
  const { state, connectWallet } = useWallet();
  const { isConnected, coinPublicKey } = state;

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Properties", href: "/properties", icon: Building2 },
    { name: "Marketplace", href: "/marketplace", icon: Store },
    { name: "Tokens", href: "/tokens", icon: ArrowRightLeft },
    { name: "Escrow", href: "/escrow", icon: ShieldCheck },
  ];

  if (pathname === "/" || pathname === "/demo") return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-white/10 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all">
                <Building2 className="text-white h-4 w-4" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                REAP
              </span>
            </Link>

            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-500/10 text-indigo-500"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex">
              <SystemStatusWidget />
            </div>

            <div className="flex items-center gap-4">
              {isConnected ? (
                <div className="flex items-center gap-3 bg-secondary/50 border border-border px-4 py-2 rounded-full backdrop-blur-md">
                  <Wallet className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-medium font-mono text-muted-foreground">
                    {coinPublicKey?.slice(0, 6)}...{coinPublicKey?.slice(-4)}
                  </span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                </div>
              ) : (
                <button
                  onClick={() => connectWallet()}
                  className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Lace
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
