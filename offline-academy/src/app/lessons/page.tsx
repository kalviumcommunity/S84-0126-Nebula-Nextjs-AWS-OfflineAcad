"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  isPublished: boolean;
  contentUrl: string | null;
  course: {
    id: string;
    title: string;
    subject: string;
  };
  userProgress: {
    id: string;
    completed: boolean;
    progressPercent: number;
    timeSpent: number;
    lastWatched: string;
  } | null;
  isCompleted: boolean;
  _count: {
    progress: number;
  };
}

export default function LessonsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingLesson, setUpdatingLesson] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchLessons();
  }, [isAuthenticated, router]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      // Fetch only published lessons for students
      const response = await fetch("/api/lessons?published=true");
      
      if (!response.ok) {
        throw new Error("Failed to fetch lessons");
      }

      const data = await response.json();
      setLessons(data);
    } catch (err: any) {
      setError(err.message || "Failed to load lessons");
      console.error("Error fetching lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLessonCompletion = async (lessonId: string, currentStatus: boolean) => {
    try {
      setUpdatingLesson(lessonId);
      
      const method = currentStatus ? "DELETE" : "POST";
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update lesson status");
      }

      const result = await response.json();

      // Refresh lessons to get updated progress
      await fetchLessons();
      
      if (currentStatus) {
        toast.success("Lesson marked as incomplete");
      } else {
        toast.success(result.message || "Lesson completed! 🎉");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update lesson status");
      console.error("Error updating lesson:", err);
    } finally {
      setUpdatingLesson(null);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const completedCount = lessons.filter(l => l.isCompleted).length;
  const inProgressCount = lessons.filter(l => l.userProgress && !l.isCompleted).length;
  const notStartedCount = lessons.filter(l => !l.userProgress).length;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Lessons</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Continue your learning journey with our comprehensive lessons
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading lessons...</p>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && !loading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-4xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Error Loading Lessons
                  </h3>
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="mt-4"
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!loading && !error && lessons.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Lessons Available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Check back later for new learning content
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Lessons Table/List */}
            {!loading && !error && lessons.length > 0 && (
              <>
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
                              Subject
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                              Duration
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {lessons.map((lesson, index) => (
                            <tr
                              key={lesson.id}
                              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {lesson.title}
                                    </p>
                                    {lesson.description && (
                                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                        {lesson.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                {lesson.course.title}
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant="outline">
                                  {lesson.course.subject}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                {lesson.duration} min
                              </td>
                              <td className="px-6 py-4 text-center">
                                {lesson.isCompleted ? (
                                  <Badge variant="success">
                                    ✓ Completed
                                  </Badge>
                                ) : lesson.userProgress ? (
                                  <Badge variant="warning">
                                    In Progress
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    Not Started
                                  </Badge>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => router.push(`/lessons/${lesson.id}`)}
                                  >
                                    View Lesson
                                  </Button>
                                  <Button
                                    variant={lesson.isCompleted ? "secondary" : "primary"}
                                    size="sm"
                                    onClick={() => toggleLessonCompletion(lesson.id, lesson.isCompleted)}
                                    disabled={updatingLesson === lesson.id}
                                  >
                                    {updatingLesson === lesson.id 
                                      ? "..." 
                                      : lesson.isCompleted 
                                        ? "Unmark" 
                                        : "Complete"
                                    }
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                          {lessons.length}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Total Lessons</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {completedCount}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Completed</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                          {inProgressCount}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">In Progress</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          {lessons.reduce((sum, l) => sum + l.duration, 0)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Total Minutes</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
