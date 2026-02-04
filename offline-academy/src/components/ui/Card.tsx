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
  <div ref={ref} className={`mb-6 border-b border-gray-100 dark:border-gray-800 pb-6 ${className}`} {...props} />
));

CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <h3 ref={ref} className={`text-2xl font-black tracking-tight text-gray-900 dark:text-white ${className}`} {...props} />
));

CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`text-gray-600 dark:text-gray-400 leading-relaxed ${className}`} {...props} />
));

CardContent.displayName = "CardContent";
