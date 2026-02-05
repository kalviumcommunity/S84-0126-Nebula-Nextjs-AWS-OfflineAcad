import { GET } from "@/app/api/me/route";

jest.mock("@/lib/auth-server", () => ({
  verifyAuth: jest.fn(),
}));

jest.mock("@/lib/db/prisma", () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    userProgress: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    courseEnrollment: { findMany: jest.fn() },
  },
}));

const { verifyAuth } = jest.requireMock("@/lib/auth-server") as {
  verifyAuth: jest.Mock;
};
const { prisma } = jest.requireMock("@/lib/db/prisma") as {
  prisma: any;
};

describe("GET /api/me", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    verifyAuth.mockResolvedValueOnce(null);

    const res = await GET({} as any);
    expect(res.status).toBe(401);
  });

  it("returns user + stats + enrollments + recentProgress", async () => {
    verifyAuth.mockResolvedValueOnce({
      id: "user-1",
      email: "u@example.com",
      role: "STUDENT",
      name: "User",
    });

    prisma.user.findUnique.mockResolvedValueOnce({
      id: "user-1",
      email: "u@example.com",
      name: "User",
      role: "STUDENT",
      xp: 20,
      _count: { progress: 2, enrollments: 1 },
    });

    // completedCount
    prisma.userProgress.count
      .mockResolvedValueOnce(1) // overall completed
      .mockResolvedValueOnce(1); // per-course completed

    prisma.courseEnrollment.findMany.mockResolvedValueOnce([
      {
        id: "enroll-1",
        courseId: "course-1",
        userId: "user-1",
        enrolledAt: new Date(),
        progress: 0,
        course: {
          id: "course-1",
          title: "Math",
          subject: "Mathematics",
          image: null,
          _count: { lessons: 2 },
        },
      },
    ]);

    prisma.userProgress.findMany.mockResolvedValueOnce([
      {
        id: "prog-1",
        userId: "user-1",
        lessonId: "lesson-1",
        completed: true,
        lastWatched: new Date(),
        lesson: {
          id: "lesson-1",
          title: "Intro",
          duration: 10,
          course: { id: "course-1", title: "Math", subject: "Mathematics" },
        },
      },
    ]);

    const res = await GET({} as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.email).toBe("u@example.com");
    expect(body.stats.coursesEnrolled).toBe(1);
    expect(body.enrollments[0].course.title).toBe("Math");
    expect(body.recentProgress[0].title).toBe("Intro");
  });
});

