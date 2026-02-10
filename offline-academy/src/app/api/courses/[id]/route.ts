import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import redis from "@/lib/redis";
import { verifyAuth } from "@/lib/auth-server";

// GET single course by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cacheKey = `courses:detail:${id}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.info(`Cache hit: ${cacheKey}`);
        return NextResponse.json(JSON.parse(cached));
      }
    } catch (redisError) {
      console.warn("Redis cache read failed for course detail", redisError);
    }

    console.info(`Cache miss: ${cacheKey}`);

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    try {
      await redis.set(cacheKey, JSON.stringify(course), "EX", 60);
    } catch (redisError) {
      console.warn("Redis cache write failed for course detail", redisError);
    }

    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch course", details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update course (Admin only)
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
    const body = await request.json();
    const { title, description, subject, level, image, isPublished } = body;

    // Build update data object with only provided fields
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (subject !== undefined) updateData.subject = subject;
    if (level !== undefined) updateData.level = level;
    if (image !== undefined) updateData.image = image;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const course = await prisma.course.update({
      where: { id },
      data: updateData,
    });

    try {
      await redis.del(
        `courses:detail:${id}`,
        "courses:list:published:all",
        "courses:list:published:true",
        "courses:list:published:false"
      );
    } catch (redisError) {
      console.warn("Redis cache invalidation failed for course update", redisError);
    }

    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update course", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE course (Admin only)
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
    await prisma.course.delete({
      where: { id },
    });

    try {
      await redis.del(
        `courses:detail:${id}`,
        "courses:list:published:all",
        "courses:list:published:true",
        "courses:list:published:false"
      );
    } catch (redisError) {
      console.warn("Redis cache invalidation failed for course delete", redisError);
    }

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete course", details: error.message },
      { status: 500 }
    );
  }
}
