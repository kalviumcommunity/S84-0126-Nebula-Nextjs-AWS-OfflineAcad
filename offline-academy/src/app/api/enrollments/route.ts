import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server";
import { prisma } from "@/lib/db/prisma";

// GET /api/enrollments - Get user's enrollments
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        userId: payload.userId
      },
      include: {
        course: {
          include: {
            _count: {
              select: {
                lessons: true
              }
            }
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      }
    });

    return NextResponse.json(enrollments);
  } catch (error: any) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

// POST /api/enrollments - Enroll in a course
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    if (!course.isPublished) {
      return NextResponse.json(
        { error: "Course is not available for enrollment" },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: payload.userId,
          courseId: courseId
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 409 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId: payload.userId,
        courseId: courseId,
        progress: 0
      },
      include: {
        course: true
      }
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error: any) {
    console.error("Error creating enrollment:", error);
    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: 500 }
    );
  }
}
