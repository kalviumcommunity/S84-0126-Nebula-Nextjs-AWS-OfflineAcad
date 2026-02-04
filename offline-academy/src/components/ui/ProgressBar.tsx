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
    primary: "bg-gradient-to-r from-indigo-500 to-blue-500",
    success: "bg-gradient-to-r from-green-500 to-emerald-500",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500",
    danger: "bg-gradient-to-r from-red-500 to-pink-500",
  };

  return (
    <div>
      {(label || showLabel) && (
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{Math.round(percentage)}%</p>
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
        <div
          className={`h-full rounded-full transition-all duration-300 ${variantClasses[variant]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};
