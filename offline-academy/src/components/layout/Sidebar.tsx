"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  TrendingUp,
  Download,
  Settings,
  Wifi
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      href: "/courses",
      label: "Courses",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      href: "/lessons",
      label: "Lessons",
      icon: <FileText className="w-5 h-5" />
    },
    {
      href: "/progress",
      label: "My Progress",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />
    },
  ];


  return (
    <aside className="w-64 h-screen sticky top-0 bg-[var(--card-bg)] text-[var(--foreground)] overflow-y-auto border-r border-[var(--card-border)] shadow-lg transition-colors duration-300 flex flex-col z-20">
      <nav className="p-4 space-y-2 pt-24 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
                }`}
            >
              <span className={`transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Offline Status */}
      <div className="p-4 border-t border-[var(--card-border)] bg-[var(--background)]">
        <div className="rounded-lg bg-[var(--nav-bg)] border border-[var(--card-border)] p-4 space-y-3">
          <h3 className="font-semibold text-sm text-[var(--foreground)] flex items-center gap-2">
            <Wifi className="w-4 h-4 text-green-500" />
            Connection
          </h3>
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>You are online</span>
          </div>
          <p className="text-xs text-[var(--secondary)] leading-relaxed">
            Content is synced and ready for offline use.
          </p>
        </div>
      </div>
    </aside>
  );
}