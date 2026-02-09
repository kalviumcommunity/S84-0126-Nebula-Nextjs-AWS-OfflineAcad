import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`card-premium p-6 ${className}`}
    {...props}
  />
));

Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`mb-6 border-b border-[var(--card-border)] pb-6 ${className}`} {...props} />
));

CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <h3 ref={ref} className={`text-2xl font-black tracking-tight text-[var(--foreground)] ${className}`} {...props} />
));

CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`text-[var(--secondary)] leading-relaxed ${className}`} {...props} />
));

CardContent.displayName = "CardContent";
