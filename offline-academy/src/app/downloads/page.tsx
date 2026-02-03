"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, Button, ProgressBar, Badge } from "@/components/ui";
import { useEffect, useState } from "react";

export default function DownloadsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [downloads, setDownloads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchDownloads = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/downloads");
        const json = await res.json();
        if (json.success) {
          setDownloads(json.downloads);
        }
      } catch (error) {
        console.error("Failed to load downloads", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDownloads();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex bg-[#0a0b10] min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col relative">
        <div className="mesh-bg" />
        <Header />

        <main className="flex-1 overflow-y-auto pt-32 pb-20 px-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="space-y-2 animate-fade-in-up">
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase font-black tracking-tighter">Local Files</h1>
              <p className="text-slate-400 font-medium max-w-md">Manage your downloaded courses and materials for offline study anytime.</p>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-32 w-full rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                {downloads.length > 0 ? downloads.map((item: any) => (
                  <Card key={item.id} variant="glass" className="p-8 border-white/10 bg-black/40 group hover:border-indigo-500/20 transition-all shadow-xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">
                        {item.icon}
                      </div>
                      <div className="flex-1 space-y-1 text-center md:text-left">
                        <h3 className="text-lg font-black text-white tracking-tight uppercase">{item.title}</h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-6">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.type}</span>
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{item.size}</span>
                        </div>
                      </div>

                      <div className="w-full md:w-64 space-y-4">
                        {item.status === "Downloading" ? (
                          <div className="space-y-2">
                             <ProgressBar value={item.progress || 0} variant="primary" label="Downloading Assets" />
                          </div>
                        ) : (
                          <div className="flex justify-center md:justify-end items-center gap-8">
                             <Badge variant="success">Saved Offline</Badge>
                             <button className="text-rose-500 text-[10px] font-black uppercase tracking-widest hover:text-rose-400 transition-colors">Delete File</button>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                         <Button variant="primary" className="h-12 w-12 p-0 flex items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">▶️</Button>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <div className="py-20 text-center space-y-6">
                    <div className="text-6xl opacity-30">📥</div>
                    <p className="text-slate-500 font-black uppercase tracking-widest">No local files found</p>
                  </div>
                )}
              </div>
            )}

            <Card variant="premium" className="p-16 border-white/10 bg-black/40 text-center space-y-8 animate-fade-in-up shadow-2xl" style={{ animationDelay: "0.2s" }}>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-indigo-600/10 border border-indigo-600/20 text-5xl mb-4">
                  📚
                </div>
                <h3 className="text-4xl font-black text-white tracking-tighter uppercase font-black tracking-tighter">Access More Modules</h3>
                <p className="text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">Browse the course catalog to download new subjects and study guides for offline use.</p>
                <div className="flex justify-center pt-4">
                  <Button variant="primary" onClick={() => router.push('/courses')} className="h-14 px-12 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20">Browse Course Catalog</Button>
                </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
