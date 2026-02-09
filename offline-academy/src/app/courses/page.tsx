"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, ProgressBar } from "@/components/ui";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Course {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  level: string;
  image: string | null;
  _count: {
    lessons: number;
    enrollments: number;
  };
}

interface EnrollmentData {
  courseId: string;
  isEnrolled: boolean;
}

export default function CoursesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [filterEnrolled, setFilterEnrolled] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchCoursesAndEnrollments();
    }
  }, [isAuthenticated, router]);

  const fetchCoursesAndEnrollments = async () => {
    try {
      // Fetch courses and user enrollments in parallel
      const [coursesRes, enrollmentsRes] = await Promise.all([
        fetch("/api/courses?published=true"),
        fetch("/api/enrollments")
      ]);
      
      if (!coursesRes.ok) throw new Error("Failed to fetch courses");
      
      const coursesData = await coursesRes.json();
      setCourses(coursesData);

      // Get enrolled course IDs
      if (enrollmentsRes.ok) {
        const enrollmentsData = await enrollmentsRes.json();
        const enrolledIds = new Set(enrollmentsData.map((e: any) => e.courseId));
        setEnrolledCourseIds(enrolledIds);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  // Get unique subjects for filtering
  const subjects = ["All", ...Array.from(new Set(courses.map((c) => c.subject)))];

  // Apply filters
  let filteredCourses = courses;
  
  // Filter by subject
  if (selectedSubject !== "All") {
    filteredCourses = filteredCourses.filter((c) => c.subject === selectedSubject);
  }
  
  // Filter by enrollment status
  if (filterEnrolled) {
    filteredCourses = filteredCourses.filter((c) => enrolledCourseIds.has(c.id));
  }

  const levelColors: Record<string, string> = {
    BEGINNER: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    INTERMEDIATE: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    ADVANCED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Courses</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore our comprehensive curriculum designed for offline learning
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 space-y-4">
              {/* Subject Filter */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Subject:</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <Button
                      key={subject}
                      variant={selectedSubject === subject ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSubject(subject)}
                    >
                      {subject}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Enrollment Filter */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enrolledFilter"
                  checked={filterEnrolled}
                  onChange={(e) => setFilterEnrolled(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="enrolledFilter" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Show only my enrolled courses ({enrolledCourseIds.size})
                </label>
              </div>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Courses Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Check back later for new courses!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                  const isEnrolled = enrolledCourseIds.has(course.id);
                  
                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-all overflow-hidden relative">
                      {/* Enrolled Badge */}
                      {isEnrolled && (
                        <div className="absolute top-2 right-2 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                          <span>✓</span>
                          <span>Enrolled</span>
                        </div>
                      )}
                      
                      {/* Course Image/Icon */}
                      <div className="h-32 bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-6xl">
                        {course.image || "📚"}
                      </div>

                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {course.subject}
                            </p>
                          </div>
                          <Badge variant={levelColors[course.level]}>{course.level}</Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {course.description || "No description available"}
                        </p>

                        {/* Stats */}
                        <div className="flex gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Lessons:</span>
                            <span className="ml-1 font-semibold">{course._count.lessons}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Students:</span>
                            <span className="ml-1 font-semibold">{course._count.enrollments}</span>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Button 
                          className="w-full mt-4"
                          variant={isEnrolled ? "primary" : "outline"}
                          onClick={() => router.push(`/courses/${course.id}`)}
                        >
                          {isEnrolled ? "Continue Learning" : "View Course"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
