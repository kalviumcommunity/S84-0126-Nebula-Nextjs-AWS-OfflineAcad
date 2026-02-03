"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import LogoutModal from "@/components/LogoutModal";
import { Button } from "@/components/ui/Button";

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useUI();
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show header on landing page (it has its own)
  if (pathname === "/") return null;

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    toast.loading("Signing out...", {
      style: {
        background: "#08090d",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "1rem",
        fontSize: "12px",
        fontWeight: "bold",
      },
    });

    setTimeout(() => {
      toast.dismiss();
      toast.success("Successfully signed out", {
        icon: "👋",
        style: {
          background: "#08090d",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "1rem",
          fontSize: "12px",
          fontWeight: "bold",
        },
      });
      logout();
      router.push("/login");
    }, 800);
  };

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "py-4" : "py-6"}`}>
      <div className="container mx-auto px-6">
        <div className={`flex items-center justify-between px-8 py-4 transition-all duration-300 border border-white/5 rounded-2xl ${scrolled ? "bg-black/80 backdrop-blur-lg shadow-xl" : "bg-black/40 backdrop-blur-md"}`}>
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
              OA
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tighter text-white">Offline Academy</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400 mt-0.5">Learn Everywhere</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Courses", href: "/courses" },
              { label: "Progress", href: "/progress" },
              { label: "Downloads", href: "/downloads" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-xs font-black uppercase tracking-widest transition-colors hover:text-white ${pathname === item.href ? "text-white" : "text-slate-500"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
             {/* Offline Ready Indicator */}
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Offline Ready</span>
             </div>

            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              title="Toggle Theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Logged In</span>
                  <span className="text-xs font-bold text-white tracking-tight">{user?.name || "Student"}</span>
                </div>
                <Button onClick={handleLogoutClick} variant="danger" size="sm" className="h-9 px-5 text-[10px] font-black uppercase tracking-widest">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Button onClick={() => router.push("/signup")} variant="primary" size="sm" className="h-9 px-5 text-[10px] font-black uppercase tracking-widest">
                  Join Free
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </header>
  );
}
