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
        <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--background)]">
          <Card className="max-w-md border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-8 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Access Denied
              </h2>
              <p className="text-[var(--secondary)] mb-6">
                Administrative privileges are required to view this dashboard.
              </p>
              <Link href="/admin">
                <Button>Stay on Admin Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="min-h-screen bg-[var(--background)] p-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight flex items-center gap-3">
                <LayoutDashboard className="w-8 h-8 text-[var(--primary)]" />
                Admin Dashboard
              </h1>
              <p className="text-[var(--secondary)] mt-1 ml-11">
                Overview of platform performance and key metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--secondary)] bg-[var(--card-bg)] px-3 py-1 rounded-full border border-[var(--card-border)]">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
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
          <Card className="border-[var(--card-border)] bg-[var(--nav-bg)]">
            <CardHeader className="border-b border-[var(--card-border)] pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--primary)]" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.label} href={action.href} className="w-full">
                    <button
                      className={`${action.color} text-white p-4 rounded-lg w-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 font-medium h-14`}
                    >
                      {action.icon}
                      <span>{action.label}</span>
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
              <CardContent className="pt-6 space-y-3">
                {[
                  { title: "Manage Courses", icon: <BookOpen className="w-4 h-4" />, href: "/admin/courses", desc: "Create, edit, and publish courses" },
                  { title: "Manage Lessons", icon: <FileText className="w-4 h-4" />, href: "/admin/lessons", desc: "Add content to your curriculum" },
                  { title: "User Management", icon: <Users className="w-4 h-4" />, href: "/admin/users", desc: "View students and progress" },
                  { title: "Platform Settings", icon: <Settings className="w-4 h-4" />, href: "/admin/settings", desc: "Configure platform behavior" },
                ].map((tool) => (
                  <Link key={tool.title} href={tool.href} className="block group">
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-[var(--card-border)] hover:border-[var(--primary-hover)] hover:bg-[var(--nav-bg)] transition-all duration-200">
                      <div className="p-2 rounded-md bg-[var(--background)] group-hover:bg-white dark:group-hover:bg-black transition-colors text-[var(--primary)]">
                        {tool.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary-hover)] transition-colors">
                          {tool.title}
                        </h4>
                        <p className="text-xs text-[var(--secondary)]">
                          {tool.desc}
                        </p>
                      </div>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[var(--secondary)]">
                        →
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
