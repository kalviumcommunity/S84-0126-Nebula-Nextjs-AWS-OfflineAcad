"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showLabel?: boolean;
  variant?: "primary" | "success" | "warning" | "danger";
}

export const ProgressBar = ({
  value,
  max = 100,
  label,
  showLabel = true,
  variant = "primary",
}: ProgressBarProps) => {
  const percentage = (value / max) * 100;

  const variantClasses = {
    primary: "bg-indigo-600",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
  };

  return (
    <div className="w-full space-y-2">
      {(label || showLabel) && (
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">{label || "Progress"}</p>
          <p className="text-[10px] font-black text-white">{Math.round(percentage)}%</p>
        </div>
      )}
      <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${variantClasses[variant]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};
