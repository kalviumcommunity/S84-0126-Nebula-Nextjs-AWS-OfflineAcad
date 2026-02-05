import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyAuth } from "@/lib/auth-server";

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { courseId } = body as { courseId?: string };
    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const existing = await prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    });
    if (existing) {
      return NextResponse.json(
        { success: true, message: "Already enrolled", enrollment: existing },
        { status: 200 }
      );
    }

    const enrollment = await prisma.courseEnrollment.create({
      data: { userId: user.id, courseId },
    });

    return NextResponse.json(
      { success: true, message: "Enrolled successfully", enrollment },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to enroll", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

