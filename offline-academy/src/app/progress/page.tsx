"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, ProgressBar, Tabs } from "@/components/ui";
import { useEffect } from "react";

export default function ProgressPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const courseProgress = [
    { name: "Mathematics", progress: 65, lessons: 24 },
    { name: "Science", progress: 78, lessons: 28 },
    { name: "English", progress: 42, lessons: 15 },
    { name: "History", progress: 55, lessons: 20 },
    { name: "Computer Science", progress: 30, lessons: 11 },
  ];

  const weeklyStats = [
    { day: "Mon", lessons: 3, hours: 2.5 },
    { day: "Tue", lessons: 4, hours: 3 },
    { day: "Wed", lessons: 2, hours: 1.5 },
    { day: "Thu", lessons: 5, hours: 3.5 },
    { day: "Fri", lessons: 3, hours: 2 },
    { day: "Sat", lessons: 6, hours: 4 },
    { day: "Sun", lessons: 2, hours: 1.5 },
  ];

  const overallProgress = (courseProgress.reduce((a, b) => a + b.progress, 0) / courseProgress.length).toFixed(1);
  const totalLessons = courseProgress.reduce((a, b) => a + b.lessons, 0);
  const totalHours = 48.5;
  const achievements = 12;

  const tabsData = [
    {
      label: "By Course",
      value: "course",
      content: (
        <div className="space-y-6">
          {courseProgress.map((course) => (
            <div key={course.name}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{course.name}</h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">{course.lessons} lessons</span>
              </div>
              <ProgressBar
                value={course.progress}
                label={`${course.progress}% Complete`}
                variant={course.progress > 70 ? "success" : course.progress > 40 ? "warning" : "primary"}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "Weekly Activity",
      value: "weekly",
      content: (
        <div>
          <div className="space-y-4">
            {weeklyStats.map((stat) => (
              <div key={stat.day} className="flex items-center gap-4">
                <div className="w-12 text-center">
                  <p className="font-semibold text-gray-900 dark:text-white">{stat.day}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-end gap-2 h-16">
                    <div className="flex-1 bg-indigo-500 rounded-t-lg" style={{ height: `${stat.lessons * 15}px` }}></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{stat.lessons} lessons</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{stat.hours}h</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: "Achievements",
      value: "achievements",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🥇", name: "Math Wizard" },
            { icon: "🔬", name: "Science Expert" },
            { icon: "📖", name: "Reader" },
            { icon: "🚀", name: "Fast Learner" },
            { icon: "📈", name: "Consistent" },
            { icon: "🏆", name: "Top Student" },
            { icon: "⭐", name: "Star Student" },
            { icon: "🎓", name: "Scholar" },
          ].map((achievement, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 text-center hover:shadow-lg transition"
            >
              <p className="text-3xl mb-2">{achievement.icon}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{achievement.name}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Progress</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your learning journey and achievements
              </p>
            </div>

            {/* Overall Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Overall Progress</p>
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {overallProgress}%
                    </p>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-4 dark:bg-gray-700">
                      <div
                        className="h-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                        style={{ width: `${overallProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Lessons Completed</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {totalLessons}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                      Across all courses
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Learning Hours</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {totalHours}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                      Total time invested
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Achievements</p>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                      {achievements}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                      Badges earned
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs tabs={tabsData} />
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Recent Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { icon: "🏅", title: "50% Progress in Mathematics", date: "2 days ago" },
                    { icon: "⭐", title: "Completed Chapter 5 Quiz with 95%", date: "5 days ago" },
                    { icon: "🔥", title: "7 Day Learning Streak", date: "1 week ago" },
                    { icon: "🎯", title: "Completed Science Course", date: "2 weeks ago" },
                  ].map((milestone, idx) => (
                    <div key={idx} className="flex gap-4 pb-4 border-b dark:border-gray-700 last:border-b-0">
                      <span className="text-2xl">{milestone.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{milestone.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
