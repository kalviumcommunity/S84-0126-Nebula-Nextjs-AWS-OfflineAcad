"use client";

export const Badge = ({ children, variant = "primary", className = "" }: { children: React.ReactNode; variant?: "primary" | "success" | "warning" | "danger" | "glass"; className?: string }) => {
  const variants = {
    primary: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    glass: "bg-white/5 text-slate-400 border border-white/10 backdrop-blur-md",
  };

  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Alert = ({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "success" | "warning" | "error" }) => {
  const types = {
    info: "bg-indigo-500/5 border border-indigo-500/20 text-indigo-400",
    success: "bg-emerald-500/5 border border-emerald-500/20 text-emerald-400",
    warning: "bg-amber-500/5 border border-amber-500/20 text-amber-400",
    error: "bg-rose-500/5 border border-rose-500/20 text-rose-400",
  };

  const icons = {
    info: "💡",
    success: "🛡️",
    warning: "⚠️",
    error: "🚫",
  };

  return (
    <div className={`p-6 rounded-[2rem] flex gap-4 items-center ${types[type]} backdrop-blur-xl animate-fade-in-up`}>
      <span className="text-xl">{icons[type]}</span>
      <div className="text-sm font-light tracking-wide">{children}</div>
    </div>
  );
};
