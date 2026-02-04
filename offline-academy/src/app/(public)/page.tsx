"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
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
      icon: "📡",
      title: "Works Offline",
      description: "Full access to learning content without internet connection",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Content cached locally for instant access on any device",
    },
    {
      icon: "💾",
      title: "Minimal Data Usage",
      description: "Text-based lessons and optimized images save bandwidth",
    },
    {
      icon: "🔄",
      title: "Smart Sync",
      description: "Progress syncs automatically when connection returns",
    },
    {
      icon: "📱",
      title: "Works on Old Devices",
      description: "Optimized for low-end smartphones and tablets",
    },
    {
      icon: "🎓",
      title: "Rich Content",
      description: "Comprehensive curriculum for all grade levels",
    },
  ];

  const stats = [
    { number: "50K+", label: "Students" },
    { number: "200+", label: "Lessons" },
    { number: "15+", label: "Subjects" },
    { number: "99.9%", label: "Uptime" },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-slate-200/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 mouse-follow">
        {/* Mouse Follow Glow */}
        <div 
          className="mouse-follow-glow opacity-30" 
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)'
          }}
        ></div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Hero Content */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-sm font-medium">
                ✨ Learn Anywhere, Anytime
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-gray-900 dark:text-white">
                Education <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500">Without Limits</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md leading-relaxed font-light">
                Quality education accessible offline. Designed for students in rural areas with limited internet access.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              {isAuthenticated ? (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/signup")}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => router.push("/login")}
                    className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat, idx) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.number}</p>
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 shadow-xl aspect-square flex items-center justify-center group hover-lift cursor-pointer">
              <div className="text-center text-white space-y-4">
                <div className="text-7xl animate-float">📚</div>
                <p className="text-2xl font-semibold">Knowledge Hub</p>
                <p className="text-gray-300 text-sm font-light">Full Access • Offline Ready</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center text-3xl animate-float" style={{ animationDelay: '0.5s' }}>
              ⭐
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Why Choose OfflineAcad?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
              Purpose-built for students in underserved regions with thoughtful features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="group p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-900 transition-all duration-300 animate-fade-in-up hover-lift" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Three simple steps to offline learning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Download", desc: "Download content when connected to internet", icon: "⬇️" },
              { step: "02", title: "Learn Offline", desc: "Access all materials anywhere without internet", icon: "📖" },
              { step: "03", title: "Sync Progress", desc: "Progress syncs automatically when reconnected", icon: "🔄" },
            ].map((item, index) => (
              <div key={item.step} className="relative group animate-fade-in-up hover-lift" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 text-2xl flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Step {item.step}</p>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-light max-w-xs">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden lg:block absolute top-8 left-full w-8 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 animate-fade-in-up">
          <div className="relative rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-12 md:p-16 text-center overflow-hidden shadow-lg">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Ready to Start Learning?</h2>
              <p className="text-gray-300 text-lg font-light">
                Join thousands of students accessing quality education offline.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={() => router.push("/signup")}
                  className="px-8 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="px-8 py-3 border border-gray-600 text-white rounded-lg font-medium hover:bg-white/5 transition-all duration-300"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-lg font-bold text-sm">O</div>
                <span className="font-bold text-gray-900 dark:text-white">OfflineAcad</span>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light">
                Empowering students in remote areas with accessible education.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Features</Link></li>
                <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Pricing</Link></li>
                <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Support</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">About</Link></li>
                <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Blog</Link></li>
                <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy</Link></li>
                <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Terms</Link></li>
                <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400 font-light">
            <p>&copy; 2026 OfflineAcad. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy Policy</Link>
              <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
