"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  order: number;
  isPublished: boolean;
  contentUrl: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  level: string;
  image: string | null;
  lessons: Lesson[];
  _count: {
    enrollments: number;
  };
}

export default function CourseDetailPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchCourseAndEnrollment();
  }, [isAuthenticated, router, courseId]);

  const fetchCourseAndEnrollment = async () => {
    try {
      setLoading(true);
      
      // Fetch course and enrollment status in parallel
      const [courseResponse, enrollmentResponse] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/enrollments/${courseId}`)
      ]);
      
      if (!courseResponse.ok) {
        throw new Error("Failed to fetch course");
      }

      const courseData = await courseResponse.json();
      setCourse(courseData);

      if (enrollmentResponse.ok) {
        const enrollmentData = await enrollmentResponse.json();
        setIsEnrolled(enrollmentData.isEnrolled);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load course");
      console.error("Error fetching course:", err);
      router.push("/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to enroll");
      }

      setIsEnrolled(true);
      toast.success("Successfully enrolled in course! 🎉");
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll in course");
      console.error("Enrollment error:", error);
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!confirm("Are you sure you want to unenroll from this course?")) {
      return;
    }

    try {
      setEnrolling(true);
      const response = await fetch(`/api/enrollments/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to unenroll");
      }

      setIsEnrolled(false);
      toast.success("Successfully unenrolled from course");
    } catch (error: any) {
      toast.error(error.message || "Failed to unenroll from course");
      console.error("Unenrollment error:", error);
    } finally {
      setEnrolling(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  // Filter to show only published lessons for students
  const publishedLessons = course.lessons.filter(lesson => lesson.isPublished);

  const levelColors: Record<string, string> = {
    BEGINNER: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    INTERMEDIATE: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    ADVANCED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Course Header */}
            <div className="mb-8">
              <Link href="/courses" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-2 mb-4">
                <span>←</span> Back to Courses
              </Link>

              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                  {course.image || "📚"}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {course.title}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {course.description || "No description available"}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {course.subject}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelColors[course.level]}`}>
                          {course.level}
                        </span>
                      </div>
                    </div>
                    
                    {/* Enrollment Button */}
                    <div className="flex-shrink-0">
                      {isEnrolled ? (
                        <div className="flex flex-col gap-2">
                          <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg font-medium flex items-center gap-2">
                            <span>✓</span>
                            <span>Enrolled</span>
                          </div>
                          <Button
                            onClick={handleUnenroll}
                            disabled={enrolling}
                            variant="outline"
                            className="text-sm"
                          >
                            {enrolling ? "Processing..." : "Unenroll"}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={handleEnroll}
                          disabled={enrolling}
                          size="lg"
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          {enrolling ? "Enrolling..." : "Enroll Now"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {publishedLessons.length}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Available Lessons</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {publishedLessons.reduce((sum, l) => sum + l.duration, 0)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Total Minutes</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {course._count.enrollments}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Students Enrolled</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lessons List */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Course Lessons
              </h2>

              {publishedLessons.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Lessons Available Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      The instructor is still preparing the course content. Check back soon!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {publishedLessons.map((lesson, index) => (
                    <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold text-lg flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                                {lesson.title}
                              </h3>
                              {lesson.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {lesson.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  ⏱️ {lesson.duration} minutes
                                </span>
                                {lesson.contentUrl && (
                                  <span className="text-green-600 flex items-center gap-1">
                                    <span className="text-xs">📎</span> Material Available
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              if (lesson.contentUrl) {
                                window.open(lesson.contentUrl, '_blank');
                              } else {
                                toast.error("Lesson content not available yet");
                              }
                            }}
                            className="flex-shrink-0"
                          >
                            Start Lesson
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
