"use client";

import React from "react";

export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "outline"
  | "secondary";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge = ({
  children,
  variant = "primary",
  className,
}: BadgeProps) => {
  const variants: Record<BadgeVariant, string> = {
    primary:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",

    success:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",

    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",

    danger:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",

    secondary:
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",

    outline:
      "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-transparent",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        variants[variant]
      } ${className ?? ""}`}
    >
      {children}
    </span>
  );
};

/* -------------------------------------------------- */
/* Alert (unchanged)                                  */
/* -------------------------------------------------- */

type AlertType = "info" | "success" | "warning" | "error";

interface AlertProps {
  children: React.ReactNode;
  type?: AlertType;
}

export const Alert = ({ children, type = "info" }: AlertProps) => {
  const types: Record<AlertType, string> = {
    info:
      "bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",

    success:
      "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",

    warning:
      "bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",

    error:
      "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
  };

  return (
    <div className={`p-4 rounded-lg ${types[type]}`}>
      {children}
    </div>
  );
};
