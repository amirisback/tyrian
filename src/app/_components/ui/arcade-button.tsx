import React from "react";

interface ArcadeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cyan" | "purple" | "amber" | "green" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function ArcadeButton({
  variant = "cyan",
  size = "md",
  children,
  className = "",
  icon,
  onClick,
  ...props
}: ArcadeButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-150 active:translate-y-0.5 select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none rounded-md";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-3",
  };

  const variantStyles = {
    cyan: "bg-cyan-500 text-black border border-cyan-300 hover:bg-cyan-400 hover:shadow-[0_0_18px_rgba(0,240,255,0.6)]",
    purple: "bg-purple-600 text-white border border-purple-400 hover:bg-purple-500 hover:shadow-[0_0_18px_rgba(168,85,247,0.6)]",
    amber: "bg-amber-500 text-black border border-amber-300 hover:bg-amber-400 hover:shadow-[0_0_18px_rgba(245,158,11,0.6)]",
    green: "bg-emerald-500 text-black border border-emerald-300 hover:bg-emerald-400 hover:shadow-[0_0_18px_rgba(16,185,129,0.6)]",
    outline: "bg-transparent text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-300",
    ghost: "bg-transparent text-zinc-300 hover:bg-zinc-800/60 hover:text-white",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
