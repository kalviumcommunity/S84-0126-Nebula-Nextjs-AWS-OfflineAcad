import { POST } from "@/app/api/enroll/route";

jest.mock("@/lib/auth-server", () => ({
  verifyAuth: jest.fn(),
}));

jest.mock("@/lib/db/prisma", () => ({
  prisma: {
    course: { findUnique: jest.fn() },
    courseEnrollment: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const { verifyAuth } = jest.requireMock("@/lib/auth-server") as {
  verifyAuth: jest.Mock;
};
const { prisma } = jest.requireMock("@/lib/db/prisma") as {
  prisma: any;
};

describe("POST /api/enroll", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    verifyAuth.mockResolvedValueOnce(null);

    const req = { json: async () => ({ courseId: "course-1" }) } as any;
    const res = await POST(req);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("enrolls the user when course exists", async () => {
    verifyAuth.mockResolvedValueOnce({
      id: "user-1",
      email: "u@example.com",
      role: "STUDENT",
      name: null,
    });
    prisma.course.findUnique.mockResolvedValueOnce({ id: "course-1" });
    prisma.courseEnrollment.findUnique.mockResolvedValueOnce(null);
    prisma.courseEnrollment.create.mockResolvedValueOnce({
      id: "enroll-1",
      userId: "user-1",
      courseId: "course-1",
    });

    const req = { json: async () => ({ courseId: "course-1" }) } as any;
    const res = await POST(req);

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.enrollment.courseId).toBe("course-1");
  });
});

