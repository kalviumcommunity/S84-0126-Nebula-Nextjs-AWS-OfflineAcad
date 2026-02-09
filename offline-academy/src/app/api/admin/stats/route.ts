import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { verifyAuth } from "@/lib/auth-server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated and is an admin
    const payload = await verifyAuth(request);
    if (!payload || payload.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    // Fetch real statistics from the database
    const [totalCourses, totalLessons, totalEnrollments, activeStudents] = await Promise.all([
      // Total courses (both published and unpublished)
      prisma.course.count(),
      
      // Total lessons (both published and unpublished)
      prisma.lesson.count(),
      
      // Total enrollments
      prisma.courseEnrollment.count(),
      
      // Active students (users with STUDENT role who have at least one enrollment)
      prisma.user.count({
        where: {
          role: Role.STUDENT,
          enrollments: {
            some: {}
          }
        }
      })
    ]);

    return NextResponse.json({
      totalCourses,
      totalLessons,
      totalEnrollments,
      activeStudents
    });
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
