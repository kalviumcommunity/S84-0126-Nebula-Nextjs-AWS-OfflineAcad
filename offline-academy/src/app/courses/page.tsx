"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, ProgressBar } from "@/components/ui";
import { useEffect } from "react";

export default function CoursesPage() {
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

  const allCourses = [
    {
      id: 1,
      title: "Mathematics Fundamentals",
      subject: "Mathematics",
      progress: 65,
      lessons: "24/36",
      level: "Intermediate",
      image: "📐",
      description: "Master essential math concepts",
    },
    {
      id: 2,
      title: "English Language Arts",
      subject: "Language Arts",
      progress: 42,
      lessons: "15/36",
      level: "Beginner",
      image: "📖",
      description: "Improve reading and writing skills",
    },
    {
      id: 3,
      title: "Science Basics",
      subject: "Science",
      progress: 78,
      lessons: "28/36",
      level: "Intermediate",
      image: "🔬",
      description: "Explore the wonders of science",
    },
    {
      id: 4,
      title: "History & Geography",
      subject: "Social Studies",
      progress: 55,
      lessons: "20/36",
      level: "Intermediate",
      image: "🌍",
      description: "Discover world history and geography",
    },
    {
      id: 5,
      title: "Computer Science Basics",
      subject: "Technology",
      progress: 30,
      lessons: "11/36",
      level: "Beginner",
      image: "💻",
      description: "Learn programming fundamentals",
    },
    {
      id: 6,
      title: "Physics & Chemistry",
      subject: "Science",
      progress: 20,
      lessons: "7/36",
      level: "Advanced",
      image: "⚛️",
      description: "Advanced physical sciences",
    },
  ];

  const levelColors = {
    Beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    Advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Courses</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore our comprehensive curriculum designed for offline learning
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-wrap gap-2">
              <Button variant="primary" size="sm">All</Button>
              <Button variant="outline" size="sm">Mathematics</Button>
              <Button variant="outline" size="sm">Science</Button>
              <Button variant="outline" size="sm">Language</Button>
              <Button variant="outline" size="sm">Technology</Button>
            </div>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-all overflow-hidden">
                  {/* Course Image/Icon */}
                  <div className="h-32 bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-6xl">
                    {course.image}
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {course.subject}
                        </p>
                      </div>
                      <Badge variant="primary">{course.level}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {course.description}
                    </p>

                    {/* Progress */}
                    <div>
                      <ProgressBar
                        value={course.progress}
                        label={`Progress: ${course.progress}%`}
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {course.lessons} lessons completed
                      </p>
                    </div>

                    {/* CTA Button */}
                    <Button className="w-full mt-4">
                      {course.progress === 0 ? "Start Course" : "Continue Learning"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
