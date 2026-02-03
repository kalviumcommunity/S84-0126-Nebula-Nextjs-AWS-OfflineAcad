
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { handleError } from "@/lib/errorHandler";

export async function GET(req: Request) {
  try {
    const userEmail = req.headers.get("x-user-email");
    
    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        progress: {
          include: {
            lesson: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Process progress by subject
    const subjects = [...new Set(user.progress.map(p => (p.lesson as any).subject))];
    if (subjects.length === 0) subjects.push("General");

    const courseProgress = subjects.map(subject => {
      const subjectProgress = user.progress.filter(p => (p.lesson as any).subject === subject);
      const totalInSubject = subjectProgress.length;
      const completedInSubject = subjectProgress.filter(p => p.completed).length;
      const progressValue = totalInSubject > 0 ? Math.round((completedInSubject / totalInSubject) * 100) : 0;

      const icons: Record<string, string> = {
        "Mathematics": "📐",
        "Science": "🔬",
        "English": "📖",
        "History": "🏛️",
        "General": "📚"
      };

      return {
        name: subject,
        progress: progressValue,
        lessons: completedInSubject,
        icon: icons[subject] || "📚"
      };
    });

    // Mock weekly stats (could be fetched from activity logs if needed)
    const weeklyStats = [
      { day: "Mon", lessons: 3, hours: 2.5 },
      { day: "Tue", lessons: 4, hours: 3 },
      { day: "Wed", lessons: 2, hours: 1.5 },
      { day: "Thu", lessons: 5, hours: 3.5 },
      { day: "Fri", lessons: 3, hours: 2 },
      { day: "Sat", lessons: 6, hours: 4 },
      { day: "Sun", lessons: 2, hours: 1.5 },
    ];

    const totalLessonsFinished = user.progress.filter(p => p.completed).length;
    const overallProgress = courseProgress.length > 0 
      ? (courseProgress.reduce((a, b) => a + b.progress, 0) / courseProgress.length).toFixed(1)
      : "0.0";

    return NextResponse.json({
      success: true,
      stats: {
        overallProgress: `${overallProgress}%`,
        totalLessons: totalLessonsFinished,
        studyTime: "48.5h", // Mock
        badges: "12" // Mock
      },
      courseProgress,
      weeklyStats
    });

  } catch (error) {
    return handleError(error, "GET /api/progress");
  }
}
