"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface LessonDetail {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  contentUrl: string | null;
  order: number;
  course: {
    id: string;
    title: string;
    subject: string;
    level: string;
  };
  userProgress: {
    id: string;
    completed: boolean;
    progressPercent: number;
    timeSpent: number;
    lastWatched: string;
  } | null;
  isCompleted: boolean;
}

export default function LessonDetailPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (lessonId) {
      fetchLesson();
    }
  }, [isAuthenticated, router, lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lessons/${lessonId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch lesson");
      }

      const data = await response.json();
      setLesson(data);
    } catch (err: any) {
      setError(err.message || "Failed to load lesson");
      console.error("Error fetching lesson:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async () => {
    if (!lesson) return;

    try {
      setUpdatingStatus(true);
      
      const method = lesson.isCompleted ? "DELETE" : "POST";
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

      // Refresh lesson data
      await fetchLesson();
      
      if (lesson.isCompleted) {
        toast.success("Lesson marked as incomplete");
      } else {
        toast.success(result.message || "Congratulations! Lesson completed! 🎉");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update lesson status");
      console.error("Error updating lesson:", err);
    } finally {
      setUpdatingStatus(false);
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/lessons")}
              className="mb-6"
            >
              ← Back to Lessons
            </Button>

            {/* Loading State */}
            {loading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading lesson...</p>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && !loading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-4xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Error Loading Lesson
                  </h3>
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                  <Button 
                    onClick={() => fetchLesson()} 
                    className="mt-4"
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Lesson Content */}
            {!loading && !error && lesson && (
              <>
                {/* Header Card */}
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                          {lesson.isCompleted && (
                            <Badge variant="success">
                              ✓ Completed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>📚 {lesson.course.title}</span>
                          <span>•</span>
                          <span>⏱️ {lesson.duration} minutes</span>
                          <span>•</span>
                          <Badge variant="primary">{lesson.course.subject}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {lesson.description && (
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {lesson.description}
                      </p>
                    )}

                    <div className="flex gap-3">
                      {lesson.contentUrl && (
                        <Button
                          onClick={() => window.open(lesson.contentUrl!, '_blank')}
                          className="flex-1"
                        >
                          🎥 Open Lesson Content
                        </Button>
                      )}
                      <Button
                        variant={lesson.isCompleted ? "secondary" : "primary"}
                        onClick={toggleCompletion}
                        disabled={updatingStatus}
                        className="flex-1"
                      >
                        {updatingStatus 
                          ? "Updating..." 
                          : lesson.isCompleted 
                            ? "Mark as Incomplete" 
                            : "Mark as Complete"
                        }
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Lesson Details Card */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Lesson Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                          Course Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Course:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {lesson.course.title}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Subject:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {lesson.course.subject}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Level:</span>
                            <Badge variant="primary">{lesson.course.level}</Badge>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                          Progress Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            {lesson.isCompleted ? (
                              <Badge variant="success">Completed</Badge>
                            ) : lesson.userProgress ? (
                              <Badge variant="warning">In Progress</Badge>
                            ) : (
                              <Badge variant="primary">Not Started</Badge>
                            )}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {lesson.duration} minutes
                            </span>
                          </div>
                          {lesson.userProgress && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Last Accessed:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {new Date(lesson.userProgress.lastWatched).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Area */}
                {lesson.contentUrl ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Lesson Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        {lesson.contentUrl.includes('youtube.com') || lesson.contentUrl.includes('youtu.be') ? (
                          <iframe
                            src={lesson.contentUrl.replace('watch?v=', 'embed/')}
                            className="w-full h-full"
                            allowFullScreen
                            title={lesson.title}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="text-6xl mb-4">🎥</div>
                              <Button onClick={() => window.open(lesson.contentUrl!, '_blank')}>
                                Open External Content
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Content Coming Soon
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        The lesson content will be available soon. Check back later!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
