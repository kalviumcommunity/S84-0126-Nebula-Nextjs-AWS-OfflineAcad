import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyAuth } from "@/lib/auth-server";

const XP_PER_LESSON = 10;

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { lessonId?: string; completed?: boolean };
    const { lessonId, completed } = body;
    if (!lessonId || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "lessonId and completed (boolean) are required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    const existing = await prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId: user.id, lessonId } },
    });
    const wasAlreadyCompleted = existing?.completed ?? false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
      const progress = await tx.userProgress.upsert({
        where: { userId_lessonId: { userId: user.id, lessonId } },
        update: { completed },
        create: { userId: user.id, lessonId, completed },
      });

      if (completed && !wasAlreadyCompleted) {
        await tx.user.update({
          where: { id: user.id },
          data: { xp: { increment: XP_PER_LESSON } },
        });
      }

      return progress;
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { xp: true },
    });

    return NextResponse.json({
      success: true,
      progress: result,
      xpAwarded: completed && !wasAlreadyCompleted ? XP_PER_LESSON : 0,
      totalXp: updatedUser?.xp ?? 0,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to update progress", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    const where: { userId: string; lesson?: { courseId?: string } } = { userId: user.id };
    if (courseId) where.lesson = { courseId };

    const progressList = await prisma.userProgress.findMany({
      where,
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            duration: true,
            order: true,
            course: { select: { id: true, title: true, subject: true } },
          },
        },
      },
    });

    return NextResponse.json(progressList);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch progress", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

