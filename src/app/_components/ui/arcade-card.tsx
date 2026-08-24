import React from "react";

interface ArcadeCardProps {
  children: React.ReactNode;
  title?: string;
  badge?: string;
  variant?: "default" | "cyan" | "purple" | "amber" | "green";
  className?: string;
  glow?: boolean;
}

export function ArcadeCard({
  children,
  title,
  badge,
  variant = "default",
  className = "",
  glow = false,
}: ArcadeCardProps) {
  const borderColors = {
    default: "border-slate-800/80 bg-slate-950/70",
    cyan: "border-cyan-500/40 bg-slate-950/80 hover:border-cyan-400/80",
    purple: "border-purple-500/40 bg-slate-950/80 hover:border-purple-400/80",
    amber: "border-amber-500/40 bg-slate-950/80 hover:border-amber-400/80",
    green: "border-emerald-500/40 bg-slate-950/80 hover:border-emerald-400/80",
  };

  const glowStyles = glow ? "shadow-[0_0_25px_rgba(0,240,255,0.15)]" : "";

  return (
    <div
      className={`relative rounded-lg border backdrop-blur-md p-5 transition-all duration-200 group ${borderColors[variant]} ${glowStyles} ${className}`}
    >
      {/* Sci-Fi Tech Corner Brackets */}
      <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/80 -translate-x-[1px] -translate-y-[1px] rounded-tl-sm pointer-events-none" />
      <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/80 translate-x-[1px] -translate-y-[1px] rounded-tr-sm pointer-events-none" />
      <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400/80 -translate-x-[1px] translate-y-[1px] rounded-bl-sm pointer-events-none" />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400/80 translate-x-[1px] translate-y-[1px] rounded-br-sm pointer-events-none" />

      {(title || badge) && (
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
          {title && (
            <h3 className="font-mono text-sm uppercase tracking-wider font-bold text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {title}
            </h3>
          )}
          {badge && (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border border-cyan-500/40 bg-cyan-500/10 text-cyan-300">
              {badge}
            </span>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
