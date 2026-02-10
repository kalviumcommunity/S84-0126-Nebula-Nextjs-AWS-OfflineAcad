import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import redis from "@/lib/redis";
import { verifyAuth } from "@/lib/auth-server";

// GET all courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    const cacheKey = `courses:list:published:${published ?? "all"}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.info(`Cache hit: ${cacheKey}`);
        return NextResponse.json(JSON.parse(cached));
      }
    } catch (redisError) {
      console.warn("Redis cache read failed for courses list", redisError);
    }

    console.info(`Cache miss: ${cacheKey}`);

    const courses = await prisma.course.findMany({
      where: published === "true" ? { isPublished: true } : undefined,
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    try {
      await redis.set(cacheKey, JSON.stringify(courses), "EX", 60);
    } catch (redisError) {
      console.warn("Redis cache write failed for courses list", redisError);
    }

    return NextResponse.json(courses);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch courses", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new course (Admin only)
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
    const { title, description, subject, level, image, isPublished } = body;

    if (!title || !subject) {
      return NextResponse.json(
        { error: "Title and subject are required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        subject,
        level: level || "BEGINNER",
        image,
        isPublished: isPublished || false,
      },
    });

    try {
      await redis.del(
        "courses:list:published:all",
        "courses:list:published:true",
        "courses:list:published:false"
      );
    } catch (redisError) {
      console.warn("Redis cache invalidation failed for courses list", redisError);
    }

    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create course", details: error.message },
      { status: 500 }
    );
  }
}
