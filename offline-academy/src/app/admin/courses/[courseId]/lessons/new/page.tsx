"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import PDFUpload from "@/components/upload/PDFUpload";

interface LessonFormData {
    title: string;
    description: string;
    duration: number;
    isPublished: boolean;
}

export default function CreateLessonPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId as string;
    const [contentUrl, setContentUrl] = useState<string | null>(null);
    const [isPublished, setIsPublished] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LessonFormData>();

    const onSubmit = async (data: LessonFormData) => {
        try {
            const response = await fetch("/api/lessons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    courseId,
                    contentUrl,
                    isPublished,
                }),
            });

            if (!response.ok) throw new Error("Failed to create lesson");

            toast.success("Lesson created successfully");
            router.push(`/admin/courses/${courseId}`);
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Lesson</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-2">Lesson Title</label>
                    <input
                        {...register("title", { required: "Title is required" })}
                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        placeholder="Introduction to React"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        {...register("description")}
                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 h-32"
                        placeholder="What will students learn?"
                    />
                </div>

                {/* Duration */}
                <div>
                    <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                    <input
                        type="number"
                        {...register("duration", { required: "Duration is required", min: 1 })}
                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    />
                </div>

                {/* PDF Upload */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Lesson Materials</h3>
                    <PDFUpload
                        onUploadComplete={(url) => setContentUrl(url)}
                        currentUrl={contentUrl}
                    />
                </div>

                {/* Publish Toggle */}
                <div className="border-t pt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700"
                        />
                        <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Publish Lesson
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Make this lesson visible to students immediately
                            </p>
                        </div>
                    </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                        {isSubmitting ? "Creating..." : "Create Lesson"}
                    </button>
                </div>
            </form>
        </div>
    );
}
