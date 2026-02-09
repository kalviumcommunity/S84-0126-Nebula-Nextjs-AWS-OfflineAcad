"use client";
import { useState, useEffect } from "react";
import RoleGuard from "@/components/RoleGuard";
import { Role } from "@prisma/client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { toast } from "react-hot-toast";

interface AdminStats {
  totalCourses: number;
  totalLessons: number;
  totalEnrollments: number;
  activeStudents: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) throw new Error("Failed to fetch statistics");
      const data = await response.json();
      setStats(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load statistics");
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const adminStats = [
    {
      label: "Total Courses",
      value: stats?.totalCourses?.toString() || "0",
      icon: "📚",
      color: "indigo",
      link: "/admin/courses"
    },
    {
      label: "Total Lessons",
      value: stats?.totalLessons?.toString() || "0",
      icon: "✏️",
      color: "green",
      link: "/admin/lessons"
    },
    {
      label: "Active Students",
      value: stats?.activeStudents?.toString() || "0",
      icon: "👥",
      color: "purple",
      link: "/admin/users"
    },
    {
      label: "Enrollments",
      value: stats?.totalEnrollments?.toString() || "0",
      icon: "📊",
      color: "yellow",
      link: "/admin/enrollments"
    },
  ];

  const quickActions = [
    { label: "Create Course", href: "/admin/courses/new", icon: "➕", color: "bg-indigo-600" },
    { label: "Manage Lessons", href: "/admin/lessons", icon: "✍️", color: "bg-green-600" },
    { label: "Manage Courses", href: "/admin/courses", icon: "👤", color: "bg-purple-600" },
    { label: "View All Users", href: "/admin/users", icon: "📈", color: "bg-yellow-600" },
  ];

  return (
    <RoleGuard
      allowedRoles={[Role.ADMIN]}
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Access Denied
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You need Admin privileges to access this area.
              </p>
              <Link href="/admin">
                <Button>Stay on Admin Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard 🎓
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage courses, lessons, and monitor platform activity
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
              // Loading state
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
                          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              adminStats.map((stat) => (
                <Link key={stat.label} href={stat.link}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </p>
                        </div>
                        <div className="text-4xl opacity-50">{stat.icon}</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>⚡ Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.label} href={action.href}>
                    <button
                      className={`${action.color} text-white p-6 rounded-lg w-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col items-center gap-2`}
                    >
                      <span className="text-3xl">{action.icon}</span>
                      <span className="font-semibold">{action.label}</span>
                    </button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-8">
            {/* Management Links */}
            <Card>
              <CardHeader>
                <CardTitle>🛠️ Management Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/courses">
                  <Button className="w-full justify-start" variant="outline">
                    📚 Manage Courses
                  </Button>
                </Link>
                <Link href="/admin/lessons">
                  <Button className="w-full justify-start" variant="outline">
                    ✏️ Manage Lessons
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button className="w-full justify-start" variant="outline">
                    👥 Manage Users
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button className="w-full justify-start" variant="outline">
                    ⚙️ Platform Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
