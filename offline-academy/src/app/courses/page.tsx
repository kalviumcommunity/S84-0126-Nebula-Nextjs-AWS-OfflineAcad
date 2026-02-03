"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, Button, Badge, ProgressBar } from "@/components/ui";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function CoursesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/courses${activeFilter !== "All" ? `?category=${activeFilter}` : ""}`);
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (error) {
        toast.error("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated, router, activeFilter]);

  if (!isAuthenticated) return null;

  const categories = ["All", "Mathematics", "Science", "English", "History", "General"];

  return (
    <div className="flex bg-[#0a0b10] min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col relative">
        <div className="mesh-bg" />
        <Header />

        <main className="flex-1 overflow-y-auto pt-32 pb-20 px-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
              <div className="space-y-2">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase font-black tracking-tighter">Course Catalog</h1>
                <p className="text-slate-400 font-medium max-w-lg">
                  Browse and access all your educational materials available for offline study.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 p-2 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-xl">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${activeFilter === cat ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-500 hover:text-white"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-[400px] rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                {courses.length > 0 ? courses.map((course) => (
                  <Card key={course.id} variant="default" className="hover-lift group overflow-hidden border-white/10 bg-black/40 shadow-2xl">
                    <div className="h-48 bg-gradient-to-br from-indigo-500/20 to-violet-600/20 flex items-center justify-center text-7xl group-hover:scale-110 transition-all duration-500">
                      {course.image}
                    </div>

                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest font-black tracking-widest">{course.subject}</span>
                          <Badge variant="glass">{course.level}</Badge>
                        </div>
                        <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight uppercase">{course.title}</h3>
                        <p className="text-xs text-slate-500 font-bold leading-relaxed">{course.description}</p>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-white/5">
                        <ProgressBar 
                          value={course.progress} 
                          label="Module Progress"
                        />
                        <div className="flex justify-between items-center bg-black/20 p-5 rounded-2xl border border-white/5">
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{course.lessons} segments</span>
                          <Button variant="primary" size="sm" className="h-10 px-6 font-black text-[10px] uppercase shadow-lg shadow-indigo-600/20" onClick={() => router.push("/lessons")}>View Lessons</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <div className="text-5xl opacity-50">📂</div>
                    <p className="text-slate-500 font-black uppercase tracking-widest">No courses found in this category</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
