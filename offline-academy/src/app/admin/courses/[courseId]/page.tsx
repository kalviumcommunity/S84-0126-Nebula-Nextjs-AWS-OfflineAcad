"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { toast } from "react-hot-toast";

interface Lesson {
    id: string;
    title: string;
    description: string;
    duration: number;
    order: number;
    isPublished: boolean;
    contentUrl: string | null;
}

interface Course {
    id: string;
    title: string;
    description: string | null;
    lessons: Lesson[];
    _count: {
        enrollments: number;
    };
}

export default function CourseEditorPage() {
    const params = useParams();
    const courseId = params.courseId as string;
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingLessonId, setUpdatingLessonId] = useState<string | null>(null);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/courses/${courseId}`);
            if (!res.ok) throw new Error("Failed to fetch course details");
            const data = await res.json();
            setCourse(data);
        } catch (error: any) {
            toast.error(error.message);
            router.push("/admin/courses");
        } finally {
            setLoading(false);
        }
    };

    const togglePublishLesson = async (lessonId: string, currentStatus: boolean) => {
        try {
            setUpdatingLessonId(lessonId);
            const res = await fetch(`/api/lessons/${lessonId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !currentStatus }),
            });

            if (!res.ok) throw new Error("Failed to update lesson");

            toast.success(`Lesson ${!currentStatus ? 'published' : 'unpublished'} successfully`);
            
            // Refresh course data
            await fetchCourse();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUpdatingLessonId(null);
        }
    };

    useEffect(() => {
        fetchCourse();        if (courseId) {
            fetchCourse();
        }
    }, [courseId, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin text-4xl">⚙️</div>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/admin/courses" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">
                            ← Back to Courses
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {course.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage course content and lessons
                        </p>
                    </div>
                    <Link href={`/admin/courses/${courseId}/lessons/new`}>
                        <Button className="flex items-center gap-2">
                            <span>➕</span> Add New Lesson
                        </Button>
                    </Link>
                </div>

                {/* Lessons List */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Lessons ({course.lessons.length})
                    </h2>

                    {course.lessons.length === 0 ? (
                        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700 bg-transparent shadow-none">
                            <CardContent className="py-12 text-center">
                                <div className="text-4xl mb-4">📝</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No lessons yet
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Start adding content to your course
                                </p>
                                <Link href={`/admin/courses/${courseId}/lessons/new`}>
                                    <Button variant="outline">Create First Lesson</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {course.lessons.map((lesson, index) => (
                                <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {lesson.title}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                    <span>⏱️ {lesson.duration}m</span>
                                                    {lesson.contentUrl && (
                                                        <span className="text-green-600 flex items-center gap-1">
                                                            <span className="text-xs">📎</span> PDF Attached
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge variant={lesson.isPublished ? "success" : "warning"}>
                                                {lesson.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => togglePublishLesson(lesson.id, lesson.isPublished)}
                                                disabled={updatingLessonId === lesson.id}
                                            >
                                                {updatingLessonId === lesson.id 
                                                    ? "Updating..." 
                                                    : lesson.isPublished ? "Unpublish" : "Publish"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
