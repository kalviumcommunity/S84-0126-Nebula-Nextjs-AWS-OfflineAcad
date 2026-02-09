import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    // Fetch student dashboard statistics
    const [enrollments, completedLessons] = await Promise.all([
      // Get all enrollments with course details
      prisma.courseEnrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              _count: {
                select: { lessons: true }
              }
            }
          }
        }
      }),

      // Get completed lessons count
      prisma.userProgress.count({
        where: {
          userId,
          completed: true
        }
      })
    ]);

    // Calculate stats
    const coursesEnrolled = enrollments.length;

    // Get recent lessons from enrolled courses
    const recentLessons = await prisma.lesson.findMany({
      where: {
        course: {
          enrollments: {
            some: { userId }
          }
        },
        isPublished: true
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            subject: true
          }
        },
        progress: {
          where: { userId },
          select: {
            completed: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 4
    });

    // Format recent lessons with progress
    const formattedRecentLessons = recentLessons
      .filter(lesson => lesson.course !== null) // Filter out lessons without courses
      .map(lesson => {
        const userProgress = lesson.progress[0];
        const isCompleted = userProgress?.completed || false;
        const progress = isCompleted ? 100 : 0;
        const status = isCompleted ? 'completed' : 'not-started';

        return {
          id: lesson.id,
          title: lesson.title,
          subject: lesson.course!.subject, // Safe to use ! because we filtered nulls above
          progress,
          status,
          courseId: lesson.course!.id
        };
      });

    return NextResponse.json({
      coursesEnrolled,
      completedLessons,
      recentLessons: formattedRecentLessons
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}

