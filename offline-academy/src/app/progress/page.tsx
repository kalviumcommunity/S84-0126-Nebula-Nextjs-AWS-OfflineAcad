"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, ProgressBar, Tabs } from "@/components/ui";
import { useEffect, useState } from "react";

export default function ProgressPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchProgress = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/progress");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to load progress", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="flex bg-[#0a0b10] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col relative">
           <Header />
           <div className="flex-1 flex items-center justify-center">
             <div className="text-indigo-500 animate-spin text-5xl">⏳</div>
           </div>
        </div>
      </div>
    );
  }

  const courseProgress = data?.courseProgress || [];
  const weeklyStats = data?.weeklyStats || [];
  const stats = data?.stats || {};

  const tabsData = [
    {
      label: "Subject Mastery",
      value: "course",
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          {courseProgress.length > 0 ? courseProgress.map((course: any) => (
            <Card key={course.name} variant="glass" className="p-8 border-white/10 bg-black/40 group hover:border-indigo-500/20 transition-all">
              <div className="flex items-center gap-6 mb-8">
                <span className="text-4xl group-hover:scale-110 transition-transform">{course.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{course.name}</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{course.lessons} Modules Completed</p>
                </div>
              </div>
              <ProgressBar
                value={course.progress}
                label="Module Mastery"
                variant={course.progress > 70 ? "success" : "primary"}
              />
            </Card>
          )) : (
            <p className="col-span-full text-center text-slate-500 italic py-10">No progress data available yet. Start a lesson!</p>
          )}
        </div>
      ),
    },
    {
      label: "Weekly Activity",
      value: "weekly",
      content: (
        <Card variant="premium" className="p-10 border-white/10 bg-black/40">
          <div className="flex items-end justify-between h-56 gap-4 px-4">
            {weeklyStats.map((stat: any, i: number) => (
              <div key={stat.day} className="flex-1 flex flex-col items-center gap-6 group">
                <div className="relative w-full flex items-end justify-center">
                  <div 
                    className="w-full max-w-[44px] bg-indigo-600 rounded-xl transition-all duration-500 group-hover:bg-indigo-400" 
                    style={{ height: `${stat.lessons * 24}px` }} 
                  />
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white text-[10px] font-black py-2 px-4 rounded-full shadow-xl">
                    {stat.lessons} Lessons
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.day}</p>
              </div>
            ))}
          </div>
        </Card>
      ),
    },
    {
      label: "Achievements",
      value: "achievements",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: "🥇", name: "Curriculum King" },
            { icon: "🔬", name: "Science Pro" },
            { icon: "📖", name: "Literature Buff" },
            { icon: "🎨", name: "Creative Mind" },
            { icon: "📈", name: "Top Learner" },
            { icon: "🏆", name: "Session Master" },
            { icon: "⭐", name: "Rising Star" },
            { icon: "🎓", name: "Graduate" },
          ].map((achievement, idx) => (
            <Card
              key={idx}
              variant="glass"
              className="p-10 text-center bg-black/40 border-white/10 group transition-all hover:bg-white/5"
            >
              <div className="text-5xl mb-6 group-hover:scale-125 transition-transform duration-500">{achievement.icon}</div>
              <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{achievement.name}</p>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="flex bg-[#0a0b10] min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col relative">
        <div className="mesh-bg" />
        <Header />

        <main className="flex-1 overflow-y-auto pt-32 pb-20 px-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="space-y-2 animate-fade-in-up">
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase font-black tracking-tighter">Learning Progress</h1>
              <p className="text-slate-400 font-medium max-w-md">Track your academic journey and celebrate your milestones across all subjects.</p>
            </div>

            {/* Overall Stats */}
            <div className="grid md:grid-cols-4 gap-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              {[
                { label: "Overall Progress", value: stats.overallProgress, color: "text-indigo-400", sub: "Mastery Level" },
                { label: "Lessons Finished", value: stats.totalLessons, color: "text-emerald-400", sub: "Total Completed" },
                { label: "Study Time", value: stats.studyTime, color: "text-violet-400", sub: "This Month" },
                { label: "Course Badges", value: stats.badges, color: "text-amber-400", sub: "Achievements" },
              ].map((stat, i) => (
                <Card key={i} variant="premium" className="p-8 bg-black/40 border-white/10 shadow-xl">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mb-2">{stat.label}</p>
                  <p className={`text-4xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase mt-4 tracking-widest">{stat.sub}</p>
                </Card>
              ))}
            </div>

            {/* Detailed Analytics */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Tabs tabs={tabsData} />
            </div>

            {/* Milestones */}
            <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-black tracking-tighter">Recent Achievements</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: "🏅", title: "Finished Algebra Chapter 1", date: "2 days ago" },
                  { icon: "⭐", title: "Environmental Science Badge Earned", date: "5 days ago" },
                  { icon: "🔥", title: "7 Day Study Streak!", date: "1 week ago" },
                  { icon: "🎯", title: "Perfect Score in Biology Quiz", date: "2 weeks ago" },
                ].map((milestone, idx) => (
                  <Card key={idx} variant="glass" className="p-8 bg-black/40 border-white/10 flex gap-8 items-center group shadow-xl hover:border-indigo-500/20 transition-all">
                    <span className="text-4xl group-hover:scale-110 transition-transform">{milestone.icon}</span>
                    <div className="flex-1">
                      <p className="text-xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{milestone.title}</p>
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">{milestone.date}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
