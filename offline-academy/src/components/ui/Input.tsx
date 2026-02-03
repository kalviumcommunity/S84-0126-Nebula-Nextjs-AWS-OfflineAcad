import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => (
    <div className="w-full space-y-2 group">
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 group-focus-within:text-indigo-400 transition-colors">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={`w-full bg-white/5 border border-white/5 px-4 py-3 rounded-xl text-white font-light placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all duration-300 ${
            error ? "border-rose-500/50 bg-rose-500/5" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
        )}
      </div>
      {error && <p className="text-[10px] text-rose-400 font-medium tracking-wide translate-x-1">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
