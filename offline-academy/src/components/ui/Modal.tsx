"use client";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in-up">
      {/* Dynamic Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Premium Modal Container */}
      <div className="relative glass-card border-white/10 shadow-3xl max-w-lg w-full rounded-[2.5rem] overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
            <div className="h-0.5 w-8 bg-indigo-500/50 rounded-full" />
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-4 text-slate-400 font-light leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-8 pt-4 flex gap-4 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
