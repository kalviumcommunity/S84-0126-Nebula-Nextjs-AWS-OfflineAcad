import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import redis from "@/lib/redis";
import { verifyAuth } from "@/lib/auth-server";

// GET single lesson by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Try to get the authenticated user (optional for public lesson viewing)
    let userId: string | null = null;
    try {
      const payload = await verifyAuth(request);
      userId = payload?.userId || null;
    } catch {
      // Continue without userId for public access
    }
    
    const cacheKey = `lessons:detail:${id}:user:${userId ?? "public"}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.info(`Cache hit: ${cacheKey}`);
        return NextResponse.json(JSON.parse(cached));
      }
    } catch (redisError) {
      console.warn("Redis cache read failed for lesson detail", redisError);
    }

    console.info(`Cache miss: ${cacheKey}`);

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            subject: true,
            level: true,
          },
        },
        progress: userId ? {
          where: {
            userId: userId
          }
        } : false,
        _count: {
          select: {
            progress: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Transform lesson to include completion status
    const lessonWithProgress = {
      ...lesson,
      userProgress: lesson.progress && lesson.progress.length > 0 ? lesson.progress[0] : null,
      isCompleted: lesson.progress && lesson.progress.length > 0 ? lesson.progress[0].completed : false
    };

    try {
      await redis.set(cacheKey, JSON.stringify(lessonWithProgress), "EX", 60);
    } catch (redisError) {
      console.warn("Redis cache write failed for lesson detail", redisError);
    }

    return NextResponse.json(lessonWithProgress);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch lesson", details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update lesson (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      select: { courseId: true },
    });
    const body = await request.json();
    const { title, description, duration, contentUrl, courseId, order, isPublished } = body;

    // Build update data object with only provided fields
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (duration !== undefined) updateData.duration = parseInt(duration);
    if (contentUrl !== undefined) updateData.contentUrl = contentUrl;
    if (courseId !== undefined) updateData.courseId = courseId;
    if (order !== undefined) updateData.order = order;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const lesson = await prisma.lesson.update({
      where: { id },
      data: updateData,
    });

    const resolvedCourseId = courseId || existingLesson?.courseId || "all";
    try {
      await redis.del(
        `lessons:detail:${id}:user:public`,
        `lessons:list:course:${resolvedCourseId}:published:all:user:public`,
        `lessons:list:course:${resolvedCourseId}:published:true:user:public`,
        `lessons:list:course:${resolvedCourseId}:published:false:user:public`,
        "lessons:list:course:all:published:all:user:public",
        "lessons:list:course:all:published:true:user:public",
        "lessons:list:course:all:published:false:user:public"
      );
    } catch (redisError) {
      console.warn("Redis cache invalidation failed for lesson update", redisError);
    }

    return NextResponse.json(lesson);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update lesson", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE lesson (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      select: { courseId: true },
    });
    await prisma.lesson.delete({
      where: { id },
    });

    const resolvedCourseId = existingLesson?.courseId || "all";
    try {
      await redis.del(
        `lessons:detail:${id}:user:public`,
        `lessons:list:course:${resolvedCourseId}:published:all:user:public`,
        `lessons:list:course:${resolvedCourseId}:published:true:user:public`,
        `lessons:list:course:${resolvedCourseId}:published:false:user:public`,
        "lessons:list:course:all:published:all:user:public",
        "lessons:list:course:all:published:true:user:public",
        "lessons:list:course:all:published:false:user:public"
      );
    } catch (redisError) {
      console.warn("Redis cache invalidation failed for lesson delete", redisError);
    }

    return NextResponse.json({ message: "Lesson deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete lesson", details: error.message },
      { status: 500 }
    );
  }
}
