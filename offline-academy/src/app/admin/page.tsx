"use client";
import RoleGuard from "@/components/RoleGuard";
import { Role } from "@prisma/client";
import { useState } from "react";
import { Card, CardContent, Button } from "@/components/ui";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function AdminPanel() {
    const [response, setResponse] = useState<string>("");

    const testAdminAction = async () => {
        try {
            const res = await fetch("/api/admin/delete-user", { method: "POST" });
            const data = await res.json();
            setResponse(JSON.stringify(data, null, 2));
        } catch (e: any) {
            setResponse("Execution Critical Failure: " + e.message);
        }
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
                  <h1 className="text-5xl font-black text-white tracking-tighter uppercase font-black tracking-tighter">Management Console</h1>
                  <p className="text-slate-400 font-medium max-w-md">Administrative control center for platform permissions and database maintenance.</p>
                </div>

                {/* Admin Zone */}
                <Card variant="premium" className="overflow-hidden border-white/10 bg-black/40 shadow-2xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                  <div className="p-10 space-y-8">
                    <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 w-fit">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400">Restricted Administration</span>
                    </div>

                    <RoleGuard allowedRoles={[Role.ADMIN]} fallback={
                      <div className="p-12 rounded-[2.5rem] bg-white/5 border border-white/5 text-center space-y-6">
                        <div className="text-5xl">🔐</div>
                        <p className="text-slate-400 font-medium italic">Administrative clearance required for this sector.</p>
                      </div>
                    }>
                      <div className="space-y-8">
                        <div className="p-8 rounded-[2rem] bg-rose-500/[0.03] border border-rose-500/10 space-y-6">
                          <h3 className="text-lg font-black text-white uppercase tracking-tight">System Reset Protocol</h3>
                          <p className="text-sm text-rose-300/40 font-bold leading-relaxed">Warning: This will reset all student progress and activity logs. This action is permanent and cannot be undone.</p>
                          <Button 
                            variant="danger" 
                            onClick={testAdminAction}
                            className="text-[10px] font-black uppercase tracking-widest h-12 px-10 shadow-xl shadow-rose-500/20"
                          >
                            Execute Reset
                          </Button>
                        </div>
                        {response && (
                          <div className="p-6 rounded-2xl bg-black/60 border border-white/10">
                            <pre className="text-[10px] text-emerald-400 font-mono tracking-tight leading-relaxed overflow-x-auto">{response}</pre>
                          </div>
                        )}
                      </div>
                    </RoleGuard>
                  </div>
                </Card>

                {/* Teacher Zone */}
                <Card variant="glass" className="overflow-hidden border-white/10 bg-black/40 shadow-2xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <div className="p-10 space-y-8">
                    <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Curriculum Management</span>
                    </div>

                    <RoleGuard allowedRoles={[Role.ADMIN, Role.TEACHER]} fallback={
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-6 opacity-50">Standard Student Access Only</p>
                    }>
                      <div className="flex flex-col md:flex-row gap-6">
                        <Button variant="primary" className="h-14 px-10 text-[10px] font-black uppercase tracking-widest">New Module</Button>
                        <Button variant="secondary" className="h-14 px-10 text-[10px] font-black uppercase tracking-widest">Audit Analytics</Button>
                      </div>
                    </RoleGuard>
                  </div>
                </Card>
              </div>
            </main>
          </div>
        </div>
    );
}
