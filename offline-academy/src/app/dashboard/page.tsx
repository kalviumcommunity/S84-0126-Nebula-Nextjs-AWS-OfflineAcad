"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import FileUpload from "@/components/FileUpload";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, ProgressBar } from "@/components/ui";
import Link from "next/link";
import { useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Trophy,
  Zap,
  Globe,
  PenTool,
  Atom,
  Calculator,
  Code,
  Flame,
  Settings,
  TrendingUp,
  Search,
  Upload
} from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const recentLessons = [
    { id: 1, title: "React Fundamentals", subject: "Computer Science", progress: 100, status: "completed", icon: <Code className="w-6 h-6" /> },
    { id: 2, title: "Advanced Algebra", subject: "Mathematics", progress: 65, status: "in-progress", icon: <Calculator className="w-6 h-6" /> },
    { id: 3, title: "Cellular Biology", subject: "Science", progress: 80, status: "in-progress", icon: <Atom className="w-6 h-6" /> },
    { id: 4, title: "Essay Writing", subject: "English", progress: 45, status: "in-progress", icon: <PenTool className="w-6 h-6" /> },
  ];

  const quickStats = [
    { label: "Courses Enrolled", value: "6", icon: <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />, color: "indigo" },
    { label: "Completed Lessons", value: "42", icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />, color: "green" },
    { label: "Learning Hours", value: "38.5", icon: <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />, color: "purple" },
    { label: "Achievements", value: "12", icon: <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />, color: "yellow" },
  ];

  const upcomingLessons = [
    { id: 1, title: "Introduction to Physics", time: "Today, 3:00 PM", icon: <Zap className="w-5 h-5 text-yellow-500" /> },
    { id: 2, title: "World Geography", time: "Tomorrow, 10:00 AM", icon: <Globe className="w-5 h-5 text-blue-500" /> },
    { id: 3, title: "Spanish Basics", time: "Wed, 2:00 PM", icon: <MessageCircle className="w-5 h-5 text-red-500" /> },
  ];

  // Helper for missed icon
  function MessageCircle(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
    )
  }


  return (
    <div className="flex h-screen bg-[var(--background)] transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2 tracking-tight">
                  Welcome back, {user?.name || "Student"}!
                </h1>
                <p className="text-[var(--secondary)]">
                  Ready to continue your learning journey?
                </p>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 shadow-sm">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse relative z-10"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500 absolute top-0 left-0 animate-ping opacity-75"></div>
                  </div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    All systems online
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat) => (
                <Card key={stat.label} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-[var(--card-border)] group">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[var(--secondary)] mb-1">{stat.label}</p>
                        <p className={`text-3xl font-bold text-[var(--foreground)]`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-[var(--nav-bg)] group-hover:bg-[var(--primary-hover)] transition-colors">
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Lessons - Takes 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Continue Learning */}
                <Card className="border-[var(--card-border)]">
                  <CardHeader className="border-b border-[var(--card-border)] pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                        Continue Learning
                      </CardTitle>
                      <Link href="/lessons">
                        <Button variant="outline" size="sm" className="gap-2">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {recentLessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="p-4 rounded-xl border border-[var(--card-border)] hover:border-[var(--primary)] transition-all duration-300 bg-[var(--card-bg)] hover:shadow-md group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-[var(--background)] text-[var(--primary)] group-hover:text-white group-hover:bg-[var(--primary)] transition-all duration-300">
                              {lesson.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <h3 className="font-semibold text-[var(--foreground)] truncate">
                                    {lesson.title}
                                  </h3>
                                  <p className="text-sm text-[var(--secondary)]">
                                    {lesson.subject}
                                  </p>
                                </div>
                                <Badge variant={lesson.status === "completed" ? "success" : "warning"}>
                                  {lesson.status === "completed" ? "Completed" : "In Progress"}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <ProgressBar value={lesson.progress} />
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-[var(--secondary)]">
                                    {lesson.progress}% complete
                                  </span>
                                  <Button size="sm" className="h-8">
                                    {lesson.status === "completed" ? "Review" : "Continue"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* File Upload Module */}
                <Card className="border-[var(--card-border)]">
                  <CardHeader className="border-b border-[var(--card-border)] pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-[var(--primary)]" />
                      Upload Learning Materials
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <FileUpload />
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar - Takes 1 column */}
              <div className="space-y-6">
                {/* Upcoming Lessons */}
                <Card className="border-[var(--card-border)]">
                  <CardHeader className="border-b border-[var(--card-border)] pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[var(--primary)]" />
                      Upcoming Lessons
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {upcomingLessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="p-3 rounded-lg bg-[var(--nav-bg)] border border-[var(--card-border)] hover:border-[var(--primary)] transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-[var(--background)] shadow-sm">
                              {lesson.icon}
                            </div>
                            <div>
                              <p className="font-medium text-[var(--foreground)] text-sm group-hover:text-[var(--primary)] transition-colors">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-[var(--secondary)] mt-1 font-medium">
                                {lesson.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Streak */}
                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border-orange-100 dark:border-orange-900/30 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Flame className="w-24 h-24 text-orange-500" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-orange-900 dark:text-orange-200 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
                      Learning Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-center py-2">
                      <p className="text-5xl font-extrabold text-orange-500 dark:text-orange-400 mb-2 drop-shadow-sm">7</p>
                      <p className="text-sm text-orange-800 dark:text-orange-200 font-medium uppercase tracking-wide opacity-80">
                        Days in a row
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-300 mt-4 font-medium bg-orange-100 dark:bg-orange-900/40 py-1 px-3 rounded-full inline-block">
                        Keep going! You're doing great! 🎉
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-[var(--card-border)]">
                  <CardHeader className="border-b border-[var(--card-border)] pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[var(--primary)]" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                    <Link href="/courses">
                      <Button className="w-full justify-start gap-2" variant="outline">
                        <Search className="w-4 h-4" /> Browse Courses
                      </Button>
                    </Link>
                    <Link href="/progress">
                      <Button className="w-full justify-start gap-2" variant="outline">
                        <TrendingUp className="w-4 h-4" /> View Progress
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button className="w-full justify-start gap-2" variant="outline">
                        <Settings className="w-4 h-4" /> Settings
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
