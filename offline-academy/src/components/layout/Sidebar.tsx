"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/courses", label: "Manage Courses", icon: "📚" },
    { href: "/lessons", label: "Study Area", icon: "✏️" },
    { href: "/progress", label: "Learning Stats", icon: "📈" },
    { href: "/downloads", label: "Local Files", icon: "📥" },
    { href: "/settings", label: "Account Info", icon: "⚙️" },
  ];

  return (
    <aside className="w-72 h-screen overflow-y-auto border-r border-white/10 bg-[#05060a]/90 backdrop-blur-3xl px-6 py-32 space-y-12 shrink-0">
      <div className="space-y-4">
        <p className="px-4 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Navigation</p>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? "text-white" : "opacity-70 group-hover:opacity-100"}`}>{item.icon}</span>
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Connectivity Status */}
      <div className="px-4 space-y-4">
        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Sync Status</p>
        <div className="p-6 rounded-3xl bg-indigo-500/5 border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Fully Synced</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Your study materials are available for offline use.</p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="px-4 pt-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Offline Academy</p>
          <p className="text-[8px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Platform v1.2.0</p>
        </div>
      </div>
    </aside>
  );
}
