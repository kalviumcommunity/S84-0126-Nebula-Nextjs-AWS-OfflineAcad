"use server";

import { prisma } from "@/lib/db/prisma";

export async function getAdminDashboardStats() {
    try {
        const [totalCourses, totalLessons, totalUsers, totalEnrollments] = await Promise.all([
            prisma.course.count(),
            prisma.lesson.count(),
            prisma.user.count({ where: { role: "STUDENT" } }), // Count active students
            prisma.courseEnrollment.count(),
        ]);

        // Fetch recent activity
        // 1. New Courses
        const recentCourses = await prisma.course.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
            select: { title: true, createdAt: true },
        });

        // 2. New Enrollments
        const recentEnrollments = await prisma.courseEnrollment.findMany({
            take: 3,
            orderBy: { enrolledAt: "desc" },
            include: {
                user: { select: { name: true, email: true } },
                course: { select: { title: true } },
            },
        });

        // Combine and sort (simplified for now)
        const activity = [
            ...recentCourses.map((c) => ({
                type: "course",
                message: `New course created: ${c.title}`,
                time: c.createdAt,
            })),
            ...recentEnrollments.map((e) => ({
                type: "enrollment",
                message: `${e.user.name || e.user.email} enrolled in ${e.course.title}`,
                time: e.enrolledAt,
            })),
        ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

        return {
            stats: {
                courses: totalCourses,
                lessons: totalLessons,
                users: totalUsers,
                enrollments: totalEnrollments,
            },
            recentActivity: activity,
        };
    } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        return null;
    }
}
