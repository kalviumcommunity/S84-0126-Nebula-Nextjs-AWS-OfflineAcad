
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { handleError } from "@/lib/errorHandler";
import { Lesson, UserProgress } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = category && category !== "All" ? { subject: category } : {};

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        progress: true
      }
    });

    // Group lessons by subject to simulate "Courses"
    const subjects = [...new Set(lessons.map((l: any) => l.subject))];
    
    const courses = subjects.map((subject: string, index: number) => {
      const subjectLessons = lessons.filter((l: any) => l.subject === subject);
      const totalLessons = subjectLessons.length;
      const completedLessons = subjectLessons.filter((l: any) => l.progress.some((p: any) => p.completed)).length;
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // Map subject to an icon
      const icons: Record<string, string> = {
        "Mathematics": "📐",
        "Science": "🔬",
        "English": "📖",
        "History": "🏛️",
        "General": "📚"
      };

      return {
        id: index + 1,
        title: `${subject} Mastery`,
        subject: subject,
        progress: progress,
        lessons: `${completedLessons}/${totalLessons}`,
        level: index % 2 === 0 ? "Beginner" : "Intermediate",
        image: icons[subject] || "📚",
        description: `Master the core concepts of ${subject} with our structured modules.`
      };
    });

    return NextResponse.json({
      success: true,
      courses: courses
    });

  } catch (error) {
    return handleError(error, "GET /api/courses");
  }
}
