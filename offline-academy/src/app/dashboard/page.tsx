"use client";
import FileUpload from "@/components/FileUpload";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: { label: string; value: string; color: string }[];
    recentLessons: any[];
    activities: string[];
  } | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const profile = JSON.parse(localStorage.getItem("offline_user_profile") || "{}");
      const token = JSON.parse(localStorage.getItem("offline_token") || '""');

      const res = await fetch("/api/dashboard", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-user-email": profile.email || ""
        }
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      // Transform API stats to match UI components
      const apiStats = [
        { label: "Total Courses", value: json.stats.totalCourses, color: "text-indigo-400" },
        { label: "Lessons Completed", value: json.stats.completedLessons, color: "text-emerald-400" },
        { label: "Current XP", value: json.stats.xp, color: "text-amber-400" },
        { label: "Study Streak", value: json.stats.streak, color: "text-rose-400" },
      ];

      setData({
        stats: apiStats,
        recentLessons: json.recentLessons,
        activities: json.activities
      });
    } catch (error: any) {
      console.error("Dashboard Fetch Error:", error);
      // toast.error("Live sync interrupted. Using cached data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchDashboardData();
    }
  }, [authLoading, isAuthenticated, fetchDashboardData]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b10]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 relative">
      <div className="mesh-bg" />
      
      <div className="container mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase font-black tracking-tighter">Welcome back, {user?.name || "Student"}!</h1>
            <p className="text-slate-400 font-medium max-w-md">Continue your learning journey even without an active internet connection.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" size="sm" className="h-11 px-8">Local Archive</Button>
            <Button size="sm" onClick={fetchDashboardData} className="h-11 px-8">Refresh Data</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {(data?.stats || []).map((stat) => (
            <Card key={stat.label} variant="glass" className="p-8 bg-black/40 border-white/10 group hover:border-indigo-500/20 transition-all">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-3">{stat.label}</p>
              <p className={`text-4xl font-black ${stat.color} tracking-tight group-hover:scale-105 transition-transform origin-left`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-white tracking-tight uppercase font-black tracking-tighter">Current Studies</h2>
                <Button variant="ghost" size="sm" className="text-indigo-400 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors">Course Library</Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {(data?.recentLessons || []).map((lesson) => (
                  <Card key={lesson.id} variant="default" className="hover-lift group border-white/10 bg-black/40 p-8 shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-black text-indigo-400 tracking-widest">{lesson.subject}</span>
                        <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight">{lesson.title}</h3>
                      </div>
                      <Badge variant={lesson.status === "Completed" ? "success" : "glass"} className="px-4 py-1">
                        {lesson.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-indigo-600 transition-all duration-1000`} 
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Mastery</span>
                        <span className="text-[10px] text-white font-black">{lesson.progress}%</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            <section className="space-y-8">
              <h2 className="text-3xl font-black text-white tracking-tight uppercase font-black tracking-tighter">Sync Materials</h2>
              <Card variant="glass" className="p-10 border-indigo-600/20 bg-indigo-600/5 shadow-2xl">
                <FileUpload />
                <p className="text-[10px] text-slate-500 mt-6 text-center font-black uppercase tracking-widest leading-relaxed">Local assets are secured in your study library for offline study.</p>
              </Card>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4">Live Activity Log</h3>
              <div className="space-y-4">
                {(data?.activities || []).map((log, i) => (
                  <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-indigo-600/10 hover:border-indigo-600/20 transition-all duration-300">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                    <span className="text-xs text-slate-400 font-bold group-hover:text-white transition-colors">{log}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
