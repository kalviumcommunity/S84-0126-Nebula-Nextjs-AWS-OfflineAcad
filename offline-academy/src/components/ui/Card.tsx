import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "glass" | "premium";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "premium-card p-6",
    glass: "glass-card p-6 rounded-3xl",
    premium: "premium-card p-6 border-indigo-500/20 bg-gradient-to-br from-slate-900/50 to-indigo-950/30",
  };

  return (
    <div
      ref={ref}
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
});

Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`mb-6 border-b border-white/5 pb-4 ${className}`} {...props} />
));

CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <h3 ref={ref} className={`text-xl font-bold tracking-tight text-white ${className}`} {...props} />
));

CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`text-slate-400 leading-relaxed font-light ${className}`} {...props} />
));

CardContent.displayName = "CardContent";
