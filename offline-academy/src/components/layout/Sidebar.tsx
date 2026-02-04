"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { 
      href: "/dashboard", 
      label: "Dashboard",
      icon: "📊"
    },
    { 
      href: "/courses", 
      label: "Courses",
      icon: "📚"
    },
    { 
      href: "/lessons", 
      label: "Lessons",
      icon: "✏️"
    },
    { 
      href: "/progress", 
      label: "My Progress",
      icon: "📈"
    },
    { 
      href: "/downloads", 
      label: "Downloads",
      icon: "📥"
    },
    { 
      href: "/settings", 
      label: "Settings",
      icon: "⚙️"
    },
  ];

  return (
    <aside className="w-64 h-screen sticky top-16 bg-gray-900 text-white overflow-y-auto border-r border-gray-800 shadow-lg">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Offline Status */}
      <div className="p-4 border-t border-gray-800">
        <div className="rounded-lg bg-gray-800 p-4 space-y-3">
          <h3 className="font-semibold text-sm">Offline Status</h3>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>You are online</span>
          </div>
          <p className="text-xs text-gray-400">
            Content cached and ready to use offline.
          </p>
        </div>
      </div>
    </aside>
  );
}