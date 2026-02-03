"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, Button, Badge } from "@/components/ui";
import { useEffect, useState } from "react";

export default function LessonsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/lessons");
        const json = await res.json();
        if (json.success) {
          setLessons(json.lessons);
        }
      } catch (error) {
        console.error("Failed to load lessons", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const statusConfig = {
    completed: { badge: "Completed", color: "success", button: "Review", icon: "✅" },
    "in-progress": { badge: "In Progress", color: "warning", button: "Resume", icon: "⌛" },
    "not-started": { badge: "Not Started", color: "danger", button: "Start", icon: "⭕" },
  };

  return (
    <div className="flex bg-[#0a0b10] min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col relative">
        <div className="mesh-bg" />
        <Header />

        <main className="flex-1 overflow-y-auto pt-32 pb-20 px-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
              <div className="space-y-2">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase font-black tracking-tighter">Study Center</h1>
                <p className="text-slate-400 font-medium max-w-md">Access and manage your localized educational modules for offline learning.</p>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-24 w-full rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                ))}
              </div>
            ) : (
              <Card variant="premium" className="overflow-hidden border-white/10 bg-black/40 shadow-2xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="px-8 py-6 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Module Title</th>
                        <th className="px-8 py-6 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Subject</th>
                        <th className="px-8 py-6 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Time</th>
                        <th className="px-8 py-6 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Status</th>
                        <th className="px-8 py-6 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {lessons.length > 0 ? lessons.map((lesson: any) => {
                        const config = statusConfig[lesson.status as keyof typeof statusConfig];
                        return (
                          <tr key={lesson.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-6">
                                <span className="text-3xl group-hover:scale-110 transition-transform duration-500">{lesson.icon}</span>
                                <div className="space-y-1">
                                  <p className="text-[14px] font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{lesson.title}</p>
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{lesson.difficulty} Level</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-xs text-slate-400 font-bold tracking-wide uppercase">{lesson.course}</span>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-xs text-slate-500 font-black">{lesson.duration}</span>
                            </td>
                            <td className="px-8 py-6">
                              <Badge variant={config.color as any}>{config.badge}</Badge>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <Button variant="secondary" size="sm" className="text-[10px] font-black uppercase tracking-widest px-8 h-10">
                                {config.button}
                              </Button>
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan={5} className="py-20 text-center">
                            <p className="text-slate-500 font-black uppercase tracking-widest uppercase">No lessons available at this time</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Orchestration Stats */}
            {!isLoading && (
              <div className="grid md:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                {[
                  { label: "Completed Modules", count: lessons.filter(l => l.status === "completed").length, icon: "🛡️", color: "text-emerald-400" },
                  { label: "In Progress", count: lessons.filter(l => l.status === "in-progress").length, icon: "⚡", color: "text-amber-400" },
                  { label: "Remaining Lessons", count: lessons.filter(l => l.status === "not-started").length, icon: "📖", color: "text-slate-400" },
                ].map((stat, i) => (
                  <Card key={i} variant="glass" className="p-10 border-white/10 bg-black/40 flex items-center justify-between group hover:border-indigo-500/20 transition-all shadow-xl">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">{stat.label}</p>
                      <p className={`text-4xl font-black ${stat.color} tracking-tight`}>{stat.count}</p>
                    </div>
                    <span className="text-5xl opacity-10 group-hover:opacity-30 transition-opacity">{stat.icon}</span>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
