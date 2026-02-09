import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server";
import { prisma } from "@/lib/db/prisma";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
        const { id: lessonId } = await params;

        // Check if lesson exists
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId }
        });

        if (!lesson) {
            return NextResponse.json(
                { error: "Lesson not found" },
                { status: 404 }
            );
        }

        // Check if already completed to determine if we should award XP
        const existingProgress = await prisma.userProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId
                }
            }
        });

        const wasAlreadyCompleted = existingProgress?.completed || false;

        // Create or update user progress
        const progress = await prisma.userProgress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId
                }
            },
            update: {
                completed: true
            },
            create: {
                userId,
                lessonId,
                completed: true
            }
        });

        // Award XP if this is the first time completing the lesson
        let xpAwarded = 0;
        if (!wasAlreadyCompleted) {
            // Award XP based on lesson duration (1 XP per minute)
            xpAwarded = lesson.duration;
            
            await prisma.user.update({
                where: { id: userId },
                data: {
                    xp: {
                        increment: xpAwarded
                    }
                }
            });
        }

        return NextResponse.json({
            success: true,
            progress,
            xpAwarded,
            message: xpAwarded > 0 ? `Congratulations! You earned ${xpAwarded} XP!` : "Lesson marked as complete"
        });
    } catch (error: any) {
        console.error("Error marking lesson as complete:", error);
        return NextResponse.json(
            { error: "Failed to mark lesson as complete" },
            { status: 500 }
        );
    }
}

// Mark lesson as incomplete
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
        const { id: lessonId } = await params;

        // Update user progress to mark as incomplete
        const progress = await prisma.userProgress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId
                }
            },
            update: {
                completed: false
            },
            create: {
                userId,
                lessonId,
                completed: false
            }
        });

        return NextResponse.json({
            success: true,
            progress
        });
    } catch (error: any) {
        console.error("Error marking lesson as incomplete:", error);
        return NextResponse.json(
            { error: "Failed to mark lesson as incomplete" },
            { status: 500 }
        );
    }
}
