"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: "💾",
      title: "Offline Access",
      description: "Download entire courses and study without any internet connection.",
    },
    {
      icon: "📚",
      title: "Curated Library",
      description: "Access thousands of lessons across Mathematics, Science, and more.",
    },
    {
      icon: "🛡️",
      title: "Safe & Secure",
      description: "Your data is encrypted and kept safe on your local device.",
    },
    {
      icon: "📈",
      title: "Track Progress",
      description: "Monitor your grades and progress even when you're completely offline.",
    },
    {
      icon: "🏢",
      title: "Institutional Ready",
      description: "Designed for schools and academies in low-connectivity regions.",
    },
    {
      icon: "🎓",
      title: "Certifications",
      description: "Earn certificates of completion as you master new skills.",
    },
  ];

  return (
    <main className="relative min-h-screen selection:bg-indigo-500/30">
      <div className="mesh-bg" />
      
      {/* Background Elements */}
      <div 
        className="spotlight transition-all duration-700 ease-out"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-8 glass border-none rounded-3xl mt-6 px-8 backdrop-blur-2xl bg-black/40">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
              OA
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">Offline Academy</span>
          </Link>
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <Button onClick={() => router.push("/dashboard")} variant="primary" size="sm" className="font-black uppercase tracking-widest text-[10px] h-10 px-6">
                Dashboard
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                  Sign In
                </Link>
                <Button onClick={() => router.push("/signup")} variant="primary" size="sm" className="font-black uppercase tracking-widest text-[10px] h-10 px-6">
                  Join Free
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-32 pb-20 text-center max-w-4xl mx-auto space-y-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Education for Everyone, Everywhere
          </div>

          <h1 className="text-7xl md:text-8xl font-black text-white tracking-tight leading-[0.9] animate-fade-in-up">
            Learning <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">Without Boundaries.</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            The world&apos;s most accessible offline learning platform. Empowering students in regions with limited connectivity to achieve their full potential.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button size="lg" className="px-12 h-14 font-black uppercase tracking-widest text-xs" onClick={() => router.push(isAuthenticated ? "/dashboard" : "/signup")}>
              {isAuthenticated ? "My Dashboard" : "Start Learning Now"}
            </Button>
            <Button variant="glass" size="lg" className="px-12 h-14 font-black uppercase tracking-widest text-xs border-white/10 bg-black/40">
              Explore Courses
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-20 border-y border-white/10 mx-auto max-w-5xl animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          {[
            { label: "Students Enrolled", value: "250K+" },
            { label: "Lesson Downloads", value: "1.2M+" },
            { label: "Offline Localities", value: "45" },
            { label: "Course Rating", value: "4.9/5" },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="text-4xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight">{stat.value}</div>
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="py-32 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Card key={feature.title} variant="glass" className="hover-lift group animate-fade-in-up border-white/10 bg-black/40 p-10" style={{ animationDelay: `${0.8 + idx * 0.1}s` }}>
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-4xl mb-8 group-hover:bg-indigo-500/20 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="py-20 pb-40">
          <Card variant="premium" className="relative p-20 text-center overflow-hidden rounded-[3rem] border-white/10 bg-black/60 group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                Empower Your <br /> Future Today.
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto font-medium leading-relaxed">
                Join thousands of students who are breaking the barriers of connectivity to learn anything, anywhere.
              </p>
              <div className="flex justify-center pt-6">
                <Button size="lg" className="px-14 h-16 rounded-full font-black uppercase tracking-widest text-xs" onClick={() => router.push("/signup")}>
                  Create Free Account
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Minimal */}
        <footer className="py-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white font-black text-sm border border-white/10">OA</div>
            <span className="text-slate-400 text-sm font-black uppercase tracking-widest">Offline Academy &copy; 2026</span>
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Courses</Link>
            <Link href="#" className="hover:text-white transition-colors">About Us</Link>
            <Link href="#" className="hover:text-white transition-colors">Support</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
