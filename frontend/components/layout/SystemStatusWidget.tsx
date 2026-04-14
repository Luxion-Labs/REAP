"use client";

import React from "react";
import { Activity, Globe, Wifi, Cpu } from "lucide-react";

export function SystemStatusWidget() {
  return (
    <div className="flex items-center gap-6 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1">
          <div className="h-5 w-5 rounded-full border border-slate-900 bg-indigo-500 flex items-center justify-center p-1">
            <Globe className="h-3 w-3 text-white" />
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Midnight Testnet</span>
      </div>

      <div className="h-4 w-[1px] bg-white/10" />

      <div className="flex items-center gap-2">
        <Wifi className="h-3 w-3 text-emerald-500" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Node Sync: 100%</span>
      </div>

      <div className="h-4 w-[1px] bg-white/10" />

      <div className="flex items-center gap-2">
        <Cpu className="h-3 w-3 text-indigo-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">ZK-Runtime: Ready</span>
      </div>

      <div className="h-4 w-[1px] bg-white/10" />

      <div className="flex items-center gap-2">
        <Activity className="h-3 w-3 text-amber-500 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Epoch 42</span>
      </div>
    </div>
  );
}
