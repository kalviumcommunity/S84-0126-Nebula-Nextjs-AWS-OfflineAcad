"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import LogoutModal from "@/components/LogoutModal";

export default function DashboardPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setIsLoggingOut(true);

    toast.loading("Logging out...");

    setTimeout(() => {
      toast.dismiss();
      toast.success("Logged out successfully");

      logout();
      setIsLoggingOut(false);
      router.push("/login");
    }, 1000);
  };

  const stats = [
    { label: "Courses Enrolled", value: "12", icon: "📚", color: "from-blue-500 to-indigo-600" },
    { label: "Hours Learned", value: "48.5", icon: "⏱️", color: "from-purple-500 to-pink-600" },
    {
      label: "Lessons Completed",
      value: "156",
      icon: "✅",
      color: "from-green-500 to-emerald-600",
    },
    { label: "Upcoming Tests", value: "3", icon: "📝", color: "from-orange-500 to-red-600" },
  ];

  const courses = [
    {
      id: 1,
      title: "Mathematics Fundamentals",
      progress: 65,
      lessons: "24/36",
      subject: "Mathematics",
    },
    {
      id: 2,
      title: "English Language Arts",
      progress: 42,
      lessons: "15/36",
      subject: "Language Arts",
    },
    { id: 3, title: "Science Basics", progress: 78, lessons: "28/36", subject: "Science" },
    {
      id: 4,
      title: "History & Geography",
      progress: 55,
      lessons: "20/36",
      subject: "Social Studies",
    },
  ];

  const recentActivity = [
    { type: "lesson", title: "Completed: Quadratic Equations", time: "2 hours ago" },
    { type: "test", title: "Scored 85% on Chapter 5 Quiz", time: "1 day ago" },
    { type: "lesson", title: "Started: British Literature", time: "2 days ago" },
    { type: "achievement", title: "Earned: Math Champion Badge", time: "3 days ago" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user}!</h1>
              <p className="text-gray-600 mb-4">
                Here&apos;s your learning dashboard. Keep up the great work!
              </p>

              <Button variant="outline" onClick={handleLogoutClick}>
                Logout
              </Button>

              {isLoggingOut && (
                <div role="status" aria-live="polite" className="mt-2 text-sm text-gray-500">
                  Logging out...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, idx) => (
                <Card key={idx}>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div
                      className={`text-3xl p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-gray-600">
                      {course.subject} • {course.lessons}
                    </p>
                    <div className="w-full bg-gray-200 h-2 rounded mt-2">
                      <div
                        className="bg-indigo-600 h-2 rounded"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
}
