import React from "react";

export interface ConnectionStatusProps {
  sseStatus: "connecting" | "connected" | "disconnected";
}

export default function ConnectionStatus({ sseStatus }: ConnectionStatusProps) {
  return (
    <div className="flex items-center">
      {sseStatus === "connected" ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Feed Connected
        </span>
      ) : sseStatus === "connecting" ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          Connecting...
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          Disconnected (Retrying)
        </span>
      )}
    </div>
  );
}
