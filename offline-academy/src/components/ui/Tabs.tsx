"use client";
import React, { useState } from "react";

interface TabItem {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
}

export const Tabs = ({ tabs, defaultTab }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value || "");

  return (
    <div className="w-full space-y-8">
      {/* Tab Headers */}
      <div className="inline-flex items-center p-1.5 bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`relative px-6 py-2.5 text-sm font-bold tracking-tight rounded-xl transition-all duration-500 overflow-hidden ${
              activeTab === tab.value
                ? "text-white shadow-2xl"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {activeTab === tab.value && (
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-600 animate-fade-in" />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up">
        {tabs.find((tab) => tab.value === activeTab)?.content}
      </div>
    </div>
  );
};
