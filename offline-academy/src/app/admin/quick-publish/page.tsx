"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, Button } from "@/components/ui";
import { toast } from "react-hot-toast";

interface Course {
  id: string;
  title: string;
  isPublished: boolean;
  _count: {
    lessons: number;
  };
}

export default function QuickPublishPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const publishCourse = async (courseId: string, title: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: true }),
      });

      if (!res.ok) throw new Error("Failed to publish course");

      toast.success(`"${title}" is now published!`);
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="p-8 bg-gray-950 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Quick Publish Courses</h1>
      
      <div className="mb-4 p-4 bg-yellow-900/50 text-yellow-200 rounded-lg">
        <p>⚠️ <strong>Important:</strong> Students can only see courses that are published!</p>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id} className="bg-gray-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white">{course.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {course._count.lessons} lessons
                  </p>
                  <div className="mt-2">
                    {course.isPublished ? (
                      <span className="text-sm px-3 py-1 rounded bg-green-900 text-green-200">
                        ✅ Published - Students can see this
                      </span>
                    ) : (
                      <span className="text-sm px-3 py-1 rounded bg-red-900 text-red-200">
                        ❌ Not Published - Students cannot see this
                      </span>
                    )}
                  </div>
                </div>
                {!course.isPublished && (
                  <Button
                    onClick={() => publishCourse(course.id, course.title)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Publish Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
