"use client";

import { useState, useEffect } from "react";
import RoleGuard from "@/components/RoleGuard";
import { Role } from "@prisma/client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  TrendingUp,
  PlusCircle,
  FileText,
  Settings,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserPlus
} from "lucide-react";
import { getAdminDashboardStats } from "@/app/actions/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    courses: 0,
    lessons: 0,
    users: 0,
    enrollments: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getAdminDashboardStats();
        if (data) {
          setStats(data.stats);

          const formattedActivity = data.recentActivity.map((act: any) => ({
            ...act,
            time: new Date(act.time).toLocaleDateString() + ' ' + new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon: act.type === 'course' ? <BookOpen className="w-5 h-5 text-blue-500" /> : <UserPlus className="w-5 h-5 text-green-500" />
          }));
          setRecentActivity(formattedActivity);
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const adminStats = [
    { label: "Total Courses", value: stats.courses, icon: <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />, color: "bg-indigo-50 dark:bg-indigo-900/20", link: "/admin/courses" },
    { label: "Total Lessons", value: stats.lessons, icon: <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />, color: "bg-emerald-50 dark:bg-emerald-900/20", link: "/admin/lessons" },
    { label: "Active Students", value: stats.users, icon: <Users className="w-6 h-6 text-violet-600 dark:text-violet-400" />, color: "bg-violet-50 dark:bg-violet-900/20", link: "/admin/users" },
    { label: "Enrollments", value: stats.enrollments, icon: <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />, color: "bg-amber-50 dark:bg-amber-900/20", link: "/admin/enrollments" },
  ];

  const quickActions = [
    { label: "Create Course", href: "/admin/courses/new", icon: <PlusCircle className="w-5 h-5" />, color: "bg-indigo-600 hover:bg-indigo-700" },
    { label: "Add Lesson", href: "/admin/lessons/new", icon: <FileText className="w-5 h-5" />, color: "bg-emerald-600 hover:bg-emerald-700" },
    { label: "Manage Users", href: "/admin/users", icon: <Users className="w-5 h-5" />, color: "bg-violet-600 hover:bg-violet-700" },
    { label: "View Reports", href: "/admin/reports", icon: <Activity className="w-5 h-5" />, color: "bg-amber-600 hover:bg-amber-700" },
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
              <Link href="/dashboard">
                <Button>Return to Dashboard</Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminStats.map((stat) => (
              <Link key={stat.label} href={stat.link} className="block group">
                <Card className="hover:shadow-md transition-all duration-300 border-[var(--card-border)] relative overflow-hidden h-full">
                  <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500`}>
                    {stat.icon}
                  </div>
                  <CardContent className="pt-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.color} bg-opacity-50`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--secondary)] mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-[var(--foreground)]">
                        {loading ? (
                          <span className="animate-pulse bg-gray-200 dark:bg-gray-800 h-8 w-16 block rounded"></span>
                        ) : (
                          stat.value.toLocaleString()
                        )}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="h-full border-[var(--card-border)]">
              <CardHeader className="border-b border-[var(--card-border)] pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[var(--primary)]" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {loading ? (
                    // Skeleton loading
                    [1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))
                  ) : recentActivity.length > 0 ? (
                    recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex gap-4 relative">
                        {/* Timeline line connecting items */}
                        {idx !== recentActivity.length - 1 && (
                          <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-[var(--card-border)] z-0"></div>
                        )}

                        <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-[var(--nav-bg)] border border-[var(--card-border)] flex items-center justify-center shadow-sm">
                          {activity.icon}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            {typeof activity.message === 'string' && activity.message.includes(':')
                              ? <><span className="font-semibold text-[var(--primary)]">{activity.message.split(':')[0]}</span>: {activity.message.split(':')[1]}</>
                              : activity.message}
                          </p>
                          <p className="text-xs text-[var(--secondary)] mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-[var(--secondary)]">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>No recent activity recorded.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Platform Health / Management Links */}
            <Card className="h-full border-[var(--card-border)]">
              <CardHeader className="border-b border-[var(--card-border)] pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[var(--primary)]" />
                  Management Tools
                </CardTitle>
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
