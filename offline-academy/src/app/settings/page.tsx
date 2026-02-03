"use client";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, Button, Input, Badge, ProgressBar } from "@/components/ui";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import LogoutModal from "@/components/LogoutModal";

export default function SettingsPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useUI();
  const router = useRouter();
  const [email, setEmail] = useState("student@offline-academy.com");
  const [offlineMode, setOfflineMode] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const confirmLogout = () => {
    setShowLogoutModal(false);
    const loadingToast = toast.loading("Terminating session...", {
      style: { background: "#0f1117", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }
    });

    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("Node detached. Session terminated.", { icon: "🛸" });
      logout();
      router.push("/");
    }, 1500);
  };

  return (
    <div className="flex bg-[#0a0b10] min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col relative">
        <div className="mesh-bg" />
        <Header />

        <main className="flex-1 overflow-y-auto pt-32 pb-20 px-8 relative z-10">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-2 animate-fade-in-up">
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase font-black tracking-tighter">Account Settings</h1>
              <p className="text-slate-400 font-medium max-w-md">Manage your profile, preferences, and offline storage settings for the Offline Academy.</p>
            </div>

            {/* Profile Section */}
            <Card variant="premium" className="p-10 border-white/10 bg-black/40 shadow-2xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="space-y-8">
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-4xl text-white font-black shadow-2xl shadow-indigo-500/20 group-hover:scale-105 transition-all">
                      {user?.name?.charAt(0).toUpperCase() || "S"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white tracking-tight">{user?.name || "Student"}</h2>
                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">Verified Learner Profile</p>
                    <div className="pt-3">
                       <Badge variant="success">Account Active</Badge>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="ml-auto text-[10px] font-black uppercase tracking-widest h-10 px-6">Change Avatar</Button>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  <Input label="Full Display Name" defaultValue={user?.name || ""} disabled className="bg-white/5 border-white/5" />
                  <Input 
                    label="Email Address" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/5"
                  />
                  <Input label="Student ID" defaultValue="OA-2024-0012" disabled className="bg-white/5 border-white/5" />
                  <Input label="Current Level" defaultValue="Intermediate Learner" disabled className="bg-white/5 border-white/5" />
                </div>
                <div className="flex justify-end pt-4">
                  <Button size="sm" className="px-10 h-12 text-[10px] font-black uppercase tracking-widest">Save Changes</Button>
                </div>
              </div>
            </Card>

            {/* Ops Grid */}
            <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              {/* Display Config */}
              <Card variant="glass" className="p-8 border-white/10 bg-black/40 space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white tracking-tight uppercase">Interface</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Personalize your experience</p>
                </div>
                
                <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Appearance</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Theme: {theme}</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={toggleTheme} className="text-[10px] font-black uppercase h-9 px-6">Switch Theme</Button>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Default Language</label>
                  <select className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500/50 appearance-none font-bold">
                    <option>English (International)</option>
                    <option>Hindi (Localized)</option>
                    <option>Auto-Detect</option>
                  </select>
                </div>
              </Card>

              {/* Security & Offline */}
              <Card variant="glass" className="p-8 border-white/10 bg-black/40 space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white tracking-tight uppercase font-black tracking-tighter">Offline Storage</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Manage your local study materials</p>
                </div>

                <div className="flex items-center justify-between p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Background Sync</p>
                    <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">Status: {offlineMode ? "Active" : "Disabled"}</p>
                  </div>
                  <button 
                    onClick={() => setOfflineMode(!offlineMode)}
                    className={`w-12 h-6 rounded-full transition-all duration-500 relative ${offlineMode ? "bg-indigo-600" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${offlineMode ? "left-7 shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "left-1"}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Local Memory Used</p>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">2.4 GB / 10 GB</p>
                  </div>
                  <ProgressBar value={24} variant="primary" />
                  <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-400 transition-colors h-11">Clear Local Cache</Button>
                </div>
              </Card>
            </div>

            {/* Termination Zone */}
            <div className="pt-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="p-10 rounded-[2.5rem] bg-rose-500/[0.03] border border-rose-500/10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-xl font-black text-rose-500 tracking-tight uppercase">Account Management</h3>
                  <p className="text-xs text-rose-300/40 font-bold max-w-sm">Warning: These actions will sign you out and may remove locally stored study progress.</p>
                </div>
                <div className="flex gap-4">
                  <Button variant="secondary" className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 h-12 px-8 text-[10px] font-black uppercase tracking-widest" onClick={() => setShowLogoutModal(true)}>Sign Out</Button>
                  <Button variant="danger" className="h-12 px-8 text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-rose-500/20">Delete Account</Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
}
