import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyAuth } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        xp: true,
        _count: { select: { progress: true, enrollments: true } },
      },
    });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const completedCount = await prisma.userProgress.count({
      where: { userId: user.id, completed: true },
    });

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            subject: true,
            image: true,
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
      take: 10,
    });

    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (e: (typeof enrollments)[number]) => {
        const completedInCourse = await prisma.userProgress.count({
          where: { userId: user.id, completed: true, lesson: { courseId: e.courseId } },
        });
        const totalLessons = e.course._count.lessons;
        const progress = totalLessons > 0 ? Math.round((completedInCourse / totalLessons) * 100) : 0;
        return { ...e, progress, completedLessons: completedInCourse, totalLessons };
      })
    );

    const recentProgress = await prisma.userProgress.findMany({
      where: { userId: user.id },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            duration: true,
            course: { select: { id: true, title: true, subject: true } },
          },
        },
      },
      orderBy: { lastWatched: "desc" },
      take: 6,
    });

    return NextResponse.json({
      user: { id: dbUser.id, email: dbUser.email, name: dbUser.name, role: dbUser.role, xp: dbUser.xp },
      stats: {
        coursesEnrolled: dbUser._count.enrollments,
        lessonsCompleted: completedCount,
        totalProgressRecords: dbUser._count.progress,
      },
      enrollments: enrollmentsWithProgress,
      recentProgress: recentProgress.map((p: (typeof recentProgress)[number]) => ({
        ...p.lesson,
        completed: p.completed,
        lastWatched: p.lastWatched,
      })),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch profile", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

