"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { useEffect } from "react";

export default function LessonsPage() {
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

  const lessons = [
    {
      id: 1,
      title: "Introduction to Algebra",
      course: "Mathematics",
      duration: "45 min",
      status: "completed",
      icon: "✅",
      difficulty: "Beginner",
    },
    {
      id: 2,
      title: "Quadratic Equations",
      course: "Mathematics",
      duration: "60 min",
      status: "in-progress",
      icon: "▶️",
      difficulty: "Intermediate",
    },
    {
      id: 3,
      title: "The Solar System",
      course: "Science",
      duration: "50 min",
      status: "not-started",
      icon: "🌟",
      difficulty: "Beginner",
    },
    {
      id: 4,
      title: "Cellular Biology",
      course: "Science",
      duration: "55 min",
      status: "completed",
      icon: "✅",
      difficulty: "Intermediate",
    },
    {
      id: 5,
      title: "Shakespeare & Drama",
      course: "English",
      duration: "65 min",
      status: "in-progress",
      icon: "▶️",
      difficulty: "Intermediate",
    },
    {
      id: 6,
      title: "World War II History",
      course: "History",
      duration: "70 min",
      status: "not-started",
      icon: "🌍",
      difficulty: "Advanced",
    },
  ];

  const statusConfig = {
    completed: {
      badge: "Completed",
      color: "success",
      button: "Review",
    },
    "in-progress": {
      badge: "In Progress",
      color: "warning",
      button: "Continue",
    },
    "not-started": {
      badge: "Not Started",
      color: "danger",
      button: "Start",
    },
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Lessons</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Continue your learning journey with our comprehensive lessons
              </p>
            </div>

            {/* Lessons Table/List */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Lesson
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Course
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Duration
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lessons.map((lesson) => {
                        const config = statusConfig[lesson.status as keyof typeof statusConfig];
                        return (
                          <tr
                            key={lesson.id}
                            className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{lesson.icon}</span>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {lesson.title}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {lesson.difficulty}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                              {lesson.course}
                            </td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                              {lesson.duration}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={config.color as any}>
                                {config.badge}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="outline" size="sm">
                                {config.button}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {lessons.filter(l => l.status === "completed").length}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Completed</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                      {lessons.filter(l => l.status === "in-progress").length}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">In Progress</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                      {lessons.filter(l => l.status === "not-started").length}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Not Started</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
