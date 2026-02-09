"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { toast } from "react-hot-toast";
import DeleteModal from "@/components/DeleteModal";
import {
  BookOpen,
  Plus,
  Settings,
  Edit,
  CheckCircle,
  XCircle,
  Trash2,
  BookMarked,
  Users
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  level: string;
  image: string | null;
  isPublished: boolean;
  _count: {
    lessons: number;
    enrollments: number;
  };
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; courseId: string; title: string }>({
    isOpen: false,
    courseId: "",
    title: "",
  });
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/courses/${deleteModal.courseId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete course");

      toast.success("Course deleted successfully");
      setDeleteModal({ isOpen: false, courseId: "", title: "" });
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const togglePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (!res.ok) throw new Error("Failed to update course");

      toast.success(`Course ${!currentStatus ? "published" : "unpublished"}`);
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const levelColors: Record<string, string> = {
    BEGINNER: "success",
    INTERMEDIATE: "warning",
    ADVANCED: "danger",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <Settings className="w-12 h-12 animate-spin text-[var(--primary)] mx-auto mb-4" />
          <p className="text-[var(--secondary)]">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2 tracking-tight flex items-center gap-3">
              <BookMarked className="w-8 h-8 text-[var(--primary)]" />
              Manage Courses
            </h1>
            <p className="text-[var(--secondary)] ml-11">
              Create, edit, and manage all your courses
            </p>
          </div>
          <Link href="/admin/courses/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Create New Course</span>
            </Button>
          </Link>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <Card className="border-[var(--card-border)] bg-[var(--card-bg)]">
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-16 h-16 bg-[var(--nav-bg)] rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                No Courses Yet
              </h3>
              <p className="text-[var(--secondary)] mb-6">
                Get started by creating your first course
              </p>
              <Link href="/admin/courses/new">
                <Button>Create Course</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-all border-[var(--card-border)] overflow-hidden group">
                <div className="h-32 bg-[var(--nav-bg)] flex items-center justify-center border-b border-[var(--card-border)] relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--background)] opacity-50"></div>
                  {course.image ? (
                    <span className="text-6xl filter drop-shadow-md">{course.image}</span>
                  ) : (
                    <BookOpen className="w-16 h-16 text-[var(--primary)] opacity-20" />
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg line-clamp-1" title={course.title}>{course.title}</CardTitle>
                    <Badge variant={levelColors[course.level] as any}>
                      {course.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--secondary)] font-medium">
                    {course.subject}
                  </p>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-[var(--secondary)] mb-4 line-clamp-2 min-h-[40px]">
                    {course.description || "No description provided."}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-4 mb-4 text-sm py-2 border-t border-b border-[var(--card-border)] bg-[var(--background)]/50 -mx-6 px-6">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                      <span className="font-semibold text-[var(--foreground)]">{course._count.lessons}</span>
                      <span className="text-[var(--secondary)]">Lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[var(--primary)]" />
                      <span className="font-semibold text-[var(--foreground)]">{course._count.enrollments}</span>
                      <span className="text-[var(--secondary)]">Enrolled</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between gap-4 mt-4">
                    <Badge variant={course.isPublished ? "success" : "warning"}>
                      <div className="flex items-center gap-1">
                        {course.isPublished ? <CheckCircle className="w-3 h-3" /> : <Settings className="w-3 h-3" />}
                        {course.isPublished ? "Published" : "Draft"}
                      </div>
                    </Badge>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/admin/courses/${course.id}`}>
                        <Button variant="outline" size="sm" className="h-8 px-2" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        title={course.isPublished ? "Unpublish" : "Publish"}
                        onClick={() => togglePublish(course.id, course.isPublished)}
                      >
                        {course.isPublished ? <XCircle className="w-4 h-4 text-orange-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="h-8 px-2"
                        title="Delete"
                        onClick={() =>
                          setDeleteModal({ isOpen: true, courseId: course.id, title: course.title })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Course"
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone and will delete all associated lessons.`}
        onClose={() => setDeleteModal({ isOpen: false, courseId: "", title: "" })}
        onConfirm={handleDelete}
      />
    </div>
  );
}
