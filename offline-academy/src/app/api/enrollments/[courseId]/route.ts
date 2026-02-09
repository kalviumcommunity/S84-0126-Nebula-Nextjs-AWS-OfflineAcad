import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server";
import { prisma } from "@/lib/db/prisma";

// GET /api/enrollments/[courseId] - Check enrollment status for a specific course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId } = await params;

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: payload.userId,
          courseId: courseId
        }
      }
    });

    return NextResponse.json({
      isEnrolled: !!enrollment,
      enrollment: enrollment || null
    });
  } catch (error: any) {
    console.error("Error checking enrollment:", error);
    return NextResponse.json(
      { error: "Failed to check enrollment status" },
      { status: 500 }
    );
  }
}

// DELETE /api/enrollments/[courseId] - Unenroll from a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId } = await params;

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: payload.userId,
          courseId: courseId
        }
      }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 404 }
      );
    }

    await prisma.courseEnrollment.delete({
      where: {
        userId_courseId: {
          userId: payload.userId,
          courseId: courseId
        }
      }
    });

    return NextResponse.json(
      { message: "Successfully unenrolled from course" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error unenrolling:", error);
    return NextResponse.json(
      { error: "Failed to unenroll from course" },
      { status: 500 }
    );
  }
}
