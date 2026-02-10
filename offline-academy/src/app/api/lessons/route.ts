import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import redis from "@/lib/redis";
import { verifyAuth } from "@/lib/auth-server";

// GET all lessons
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const published = searchParams.get("published");

    // Try to get the authenticated user (optional for public lesson viewing)
    let userId: string | null = null;
    try {
      const payload = await verifyAuth(request);
      userId = payload?.userId || null;
    } catch {
      // Continue without userId for public access
    }

    const cacheKey = `lessons:list:course:${courseId ?? "all"}:published:${published ?? "all"}:user:${userId ?? "public"}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.info(`Cache hit: ${cacheKey}`);
        return NextResponse.json(JSON.parse(cached));
      }
    } catch (redisError) {
      console.warn("Redis cache read failed for lessons list", redisError);
    }

    console.info(`Cache miss: ${cacheKey}`);

    const lessons = await prisma.lesson.findMany({
      where: {
        ...(courseId && { courseId }),
        ...(published === "true" && { isPublished: true }),
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            subject: true,
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
      orderBy: [
        { courseId: "asc" },
        { order: "asc" },
      ],
    });

    // Transform lessons to include completion status
    const lessonsWithProgress = lessons.map(lesson => ({
      ...lesson,
      userProgress: lesson.progress && lesson.progress.length > 0 ? lesson.progress[0] : null,
      isCompleted: lesson.progress && lesson.progress.length > 0 ? lesson.progress[0].completed : false
    }));

    try {
      await redis.set(cacheKey, JSON.stringify(lessonsWithProgress), "EX", 60);
    } catch (redisError) {
      console.warn("Redis cache write failed for lessons list", redisError);
    }

    return NextResponse.json(lessonsWithProgress);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch lessons", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new lesson (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, duration, contentUrl, courseId, order, isPublished } = body;

    if (!title || !duration) {
      return NextResponse.json(
        { error: "Title and duration are required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        duration: parseInt(duration),
        contentUrl,
        courseId,
        order: order || 0,
        isPublished: isPublished || false,
      },
    });

    const courseKey = courseId || "all";
    try {
      await redis.del(
        `lessons:list:course:${courseKey}:published:all:user:public`,
        `lessons:list:course:${courseKey}:published:true:user:public`,
        `lessons:list:course:${courseKey}:published:false:user:public`,
        "lessons:list:course:all:published:all:user:public",
        "lessons:list:course:all:published:true:user:public",
        "lessons:list:course:all:published:false:user:public"
      );
    } catch (redisError) {
      console.warn("Redis cache invalidation failed for lessons list", redisError);
    }

    return NextResponse.json(lesson, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create lesson", details: error.message },
      { status: 500 }
    );
  }
}
