import { POST } from "@/app/api/progress/route";

jest.mock("@/lib/auth-server", () => ({
  verifyAuth: jest.fn(),
}));

jest.mock("@/lib/db/prisma", () => ({
  prisma: {
    lesson: { findUnique: jest.fn() },
    userProgress: { findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  },
}));

const { verifyAuth } = jest.requireMock("@/lib/auth-server") as {
  verifyAuth: jest.Mock;
};
const { prisma } = jest.requireMock("@/lib/db/prisma") as {
  prisma: any;
};

describe("POST /api/progress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    verifyAuth.mockResolvedValueOnce(null);
    const req = { json: async () => ({ lessonId: "lesson-1", completed: true }) } as any;
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("marks lesson complete and awards XP first time", async () => {
    verifyAuth.mockResolvedValueOnce({
      id: "user-1",
      email: "u@example.com",
      role: "STUDENT",
      name: null,
    });

    prisma.lesson.findUnique.mockResolvedValueOnce({ id: "lesson-1" });
    prisma.userProgress.findUnique.mockResolvedValueOnce(null);

    prisma.$transaction.mockImplementationOnce(async (cb: any) => {
      const tx = {
        userProgress: {
          upsert: jest.fn().mockResolvedValue({
            id: "prog-1",
            userId: "user-1",
            lessonId: "lesson-1",
            completed: true,
          }),
        },
        user: {
          update: jest.fn().mockResolvedValue({ id: "user-1", xp: 10 }),
        },
      };
      return cb(tx);
    });

    prisma.user.findUnique.mockResolvedValueOnce({ xp: 10 });

    const req = { json: async () => ({ lessonId: "lesson-1", completed: true }) } as any;
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.xpAwarded).toBe(10);
    expect(body.totalXp).toBe(10);
  });
});

