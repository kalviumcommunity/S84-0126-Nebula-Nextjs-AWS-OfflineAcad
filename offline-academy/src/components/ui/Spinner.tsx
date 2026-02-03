"use client";

export const Spinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-2",
    lg: "w-16 h-16 border-[3px]",
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full border-white/10 animate-[spin_3s_linear_infinite]`} />
      <div className={`${sizeClasses[size]} rounded-full border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin absolute inset-0 shadow-[0_0_15px_rgba(99,102,241,0.5)]`} />
    </div>
  );
};

export const SkeletonLoader = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative overflow-hidden group">
          <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 h-24">
            <div className="space-y-3">
              <div className="h-2 w-1/3 bg-white/10 rounded-full" />
              <div className="h-2 w-full bg-white/5 rounded-full" />
            </div>
            {/* Shimmer overlay */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      ))}
    </div>
  );
};
