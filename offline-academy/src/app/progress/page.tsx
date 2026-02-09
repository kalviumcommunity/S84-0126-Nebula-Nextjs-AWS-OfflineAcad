"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, ProgressBar } from "@/components/ui";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface ProgressData {
  courseProgress: Array<{
    name: string;
    progress: number;
    lessons: number;
  }>;
  overallProgress: string;
  totalCompletedLessons: number;
}

export default function ProgressPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchProgressData();
    }
  }, [isAuthenticated, router]);

  const fetchProgressData = async () => {
    try {
      const response = await fetch("/api/progress");
      if (!response.ok) throw new Error("Failed to fetch progress data");
      const data = await response.json();
      setProgressData(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load progress data");
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Progress</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your learning journey and achievements
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Overall Stats */}
            {!loading && progressData && (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Overall Progress</p>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                          {progressData.overallProgress}%
                        </p>
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-4 dark:bg-gray-700">
                          <div
                            className="h-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                            style={{ width: `${progressData.overallProgress}%` }}
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
                          {progressData.totalCompletedLessons}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                          Across all courses
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Course Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {progressData.courseProgress.length > 0 ? (
                      <div className="space-y-6">
                        {progressData.courseProgress.map((course) => (
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
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No Courses Enrolled
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Enroll in courses to start tracking your progress!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Empty State */}
            {!loading && !progressData && (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Progress Data
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start learning to see your progress here!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
