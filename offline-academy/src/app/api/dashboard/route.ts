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
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const totalCourses = await prisma.lesson.groupBy({
      by: ['subject'],
      _count: true
    });

    const completedLessons = user.progress.filter(p => p.completed).length;

    // Calculate streak (mock for now or based on activity)
    const streak = 5; // Simplified

    return NextResponse.json({
      success: true,
      stats: {
        totalCourses: `${totalCourses.length} Active`,
        completedLessons: completedLessons.toString(),
        xp: user.xp.toLocaleString(),
        streak: `${streak} Days`
      },
      recentLessons: user.progress.slice(0, 4).map(p => ({
        id: p.lesson.id,
        title: p.lesson.title,
        subject: p.lesson.subject,
        progress: p.completed ? 100 : 50, // Mock progress for now
        status: p.completed ? "Completed" : "In Progress"
      })),
      activities: user.activities.map(a => a.content)
    });

  } catch (error) {
    return handleError(error, "GET /api/dashboard");
  }
}
