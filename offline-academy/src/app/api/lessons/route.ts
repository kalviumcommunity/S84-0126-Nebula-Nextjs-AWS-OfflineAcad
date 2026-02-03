
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { handleError } from "@/lib/errorHandler";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const userEmail = req.headers.get("x-user-email");

    const where: any = subject ? { subject } : {};

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        progress: {
          where: {
            user: {
              email: userEmail || ""
            }
          }
        }
      }
    });

    const formattedLessons = lessons.map(lesson => {
      const userProgress = lesson.progress[0];
      const status = userProgress?.completed 
        ? "completed" 
        : (userProgress ? "in-progress" : "not-started");

      const subjectIcons: Record<string, string> = {
        "Mathematics": "📐",
        "Science": "🔬",
        "English": "📖",
        "History": "🏛️",
        "General": "📚"
      };

      return {
        id: lesson.id,
        title: lesson.title,
        course: (lesson as any).subject,
        duration: `${lesson.duration} min`,
        status,
        icon: subjectIcons[(lesson as any).subject] || "📚",
        difficulty: lesson.duration > 60 ? "Advanced" : (lesson.duration > 40 ? "Core" : "Foundation")
      };
    });

    return NextResponse.json({
      success: true,
      lessons: formattedLessons
    });

  } catch (error) {
    return handleError(error, "GET /api/lessons");
  }
}
