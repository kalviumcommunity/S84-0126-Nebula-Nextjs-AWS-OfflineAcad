import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
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

        // Fetch enrollments with course details and progress
        const enrollments = await prisma.courseEnrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        lessons: {
                            where: { isPublished: true },
                            include: {
                                progress: {
                                    where: { userId }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Calculate progress for each course
        const courseProgress = enrollments.map(enrollment => {
            const totalLessons = enrollment.course.lessons.length;
            if (totalLessons === 0) {
                return {
                    name: enrollment.course.title,
                    progress: 0,
                    lessons: 0
                };
            }

            // Count completed lessons
            const completedLessons = enrollment.course.lessons.filter(lesson =>
                lesson.progress.length > 0 && lesson.progress[0].completed
            ).length;

            const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

            return {
                name: enrollment.course.title,
                progress: progressPercentage,
                lessons: totalLessons
            };
        });

        // Calculate overall progress
        const overallProgress = courseProgress.length > 0
            ? (courseProgress.reduce((sum, course) => sum + course.progress, 0) / courseProgress.length).toFixed(1)
            : "0.0";

        // Calculate total completed lessons
        const totalCompletedLessons = await prisma.userProgress.count({
            where: {
                userId,
                completed: true
            }
        });

        return NextResponse.json({
            courseProgress,
            overallProgress,
            totalCompletedLessons
        });
    } catch (error: any) {
        console.error("Error fetching progress data:", error);
        return NextResponse.json(
            { error: "Failed to fetch progress data" },
            { status: 500 }
        );
    }
}
