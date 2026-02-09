"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import FileUpload from "@/components/FileUpload";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, ProgressBar } from "@/components/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface DashboardStats {
  coursesEnrolled: number;
  completedLessons: number;
  recentLessons: Array<{
    id: string;
    title: string;
    subject: string;
    progress: number;
    status: string;
    courseId: string;
  }>;
}

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchDashboardStats();
    }
  }, [isAuthenticated, router]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const data = await response.json();
      setStats(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load dashboard data");
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }


  const subjectIcons: Record<string, string> = {
    "Computer Science": "⚛️",
    "Mathematics": "📐",
    "Science": "🔬",
    "English": "✍️",
    "Physics": "⚡",
    "Geography": "🌍",
    "History": "📜",
    "default": "📚"
  };

  const quickStats = [
    { label: "Courses Enrolled", value: stats?.coursesEnrolled?.toString() || "0", icon: "📚", color: "indigo" },
    { label: "Completed Lessons", value: stats?.completedLessons?.toString() || "0", icon: "✅", color: "green" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {user?.name || "Student"}! 👋
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ready to continue your learning journey?
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      All systems online
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {loading ? (
                <>
                  {[1, 2].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                          </div>
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                quickStats.map((stat) => (
                  <Card key={stat.label} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                          <p className={`text-3xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                            {stat.value}
                          </p>
                        </div>
                        <div className="text-4xl opacity-50">{stat.icon}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Lessons - Takes 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Continue Learning */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Continue Learning</CardTitle>
                      <Link href="/courses">
                        <Button variant="outline" size="sm">View All Courses</Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4 rounded-lg border dark:border-gray-700 animate-pulse">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : stats?.recentLessons && stats.recentLessons.length > 0 ? (
                      <div className="space-y-4">
                        {stats.recentLessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="p-4 rounded-lg border dark:border-gray-700 hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800"
                          >
                            <div className="flex items-start gap-4">
                              <div className="text-3xl">{subjectIcons[lesson.subject] || subjectIcons.default}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                      {lesson.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {lesson.subject}
                                    </p>
                                  </div>
                                  <Badge variant={lesson.status === "completed" ? "success" : "warning"}>
                                    {lesson.status === "completed" ? "Completed" : "In Progress"}
                                  </Badge>
                                </div>
                                <ProgressBar value={lesson.progress} />
                                <div className="flex items-center justify-between mt-3">
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {lesson.progress}% complete
                                  </span>
                                  <Link href={`/courses/${lesson.courseId}`}>
                                    <Button size="sm">
                                      {lesson.status === "completed" ? "Review" : "Continue"}
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No Lessons Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Enroll in a course to start learning!
                        </p>
                        <Link href="/courses">
                          <Button>Browse Courses</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* File Upload Module */}
                <Card>
                  <CardHeader>
                    <CardTitle>📁 Upload Learning Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FileUpload />
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar - Takes 1 column */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>⚡ Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/courses">
                      <Button className="w-full justify-start" variant="outline">
                        📚 Browse Courses
                      </Button>
                    </Link>
                    <Link href="/progress">
                      <Button className="w-full justify-start" variant="outline">
                        📈 View Progress
                      </Button>
                    </Link>
                    <Link href="/lessons">
                      <Button className="w-full justify-start" variant="outline">
                        ✏️ My Lessons
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button className="w-full justify-start" variant="outline">
                        ⚙️ Settings
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

