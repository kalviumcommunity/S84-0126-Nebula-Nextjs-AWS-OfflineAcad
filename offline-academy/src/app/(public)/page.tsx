"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
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

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          font-family: 'Raleway', sans-serif;
          background: #0a0a0a;
          color: #fafafa;
          overflow-x: hidden;
        }

        .luxury-serif {
          font-family: 'Cormorant Garamond', serif;
        }

        .grain-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.035;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }

        .luxury-button {
          position: relative;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .luxury-button::before {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transition: transform 0.6s ease;
        }

        .luxury-button:hover::before {
          transform: translateX(100%);
        }

        .luxury-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .luxury-card:hover {
          transform: translateY(-8px);
        }
      `}</style>

      <div className="grain-overlay" />

      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-300 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">O</span>
              </div>
              <span className="luxury-serif text-xl font-light hidden sm:block">
                Offline.Acad
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              {["Home", "Courses", "About"].map((item) => (
                <Link
                  key={item}
                  href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                  className={`text-sm tracking-wider transition-colors ${
                    item === "Home"
                      ? "text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-2.5 bg-white text-black text-sm rounded-lg"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-white hover:text-amber-300">
                    Login
                  </Link>
                  <Link href="/signup">
                    <button className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-sm rounded-lg">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-5xl text-center space-y-10">
          <div className="flex items-center justify-center gap-3 animate-fadeInUp delay-100">
            <span className="text-xs tracking-[0.3em] text-neutral-500 uppercase">
              Premium Education Since 2024
            </span>
          </div>

          <h1 className="luxury-serif text-[4.5rem] sm:text-[6rem] lg:text-[8rem] leading-[0.95] animate-fadeInUp delay-200">
            Offline
            <br />
            <span className="italic bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
              Academy
            </span>
          </h1>

          <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed animate-fadeInUp delay-300">
            Curated offline-first learning experiences designed for clarity,
            depth, and long-term mastery.
          </p>

          <div className="flex justify-center gap-5 animate-fadeInUp delay-400">
            {isAuthenticated ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="luxury-button px-12 py-5 bg-white text-black uppercase text-sm tracking-widest rounded-lg"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link href="/login">
                  <button className="luxury-button px-12 py-5 bg-white text-black uppercase text-sm tracking-widest rounded-lg">
                    Begin Journey
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="luxury-button px-12 py-5 border border-white/20 text-white uppercase text-sm tracking-widest rounded-lg">
                    Register Free
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-white/5 text-center">
        <div className="luxury-serif text-xl mb-2">
          Offline <span className="italic">Academy</span>
        </div>
        <div className="text-xs tracking-widest text-neutral-600">
          © 2024 All Rights Reserved
        </div>
      </footer>
    </>
  );
}
