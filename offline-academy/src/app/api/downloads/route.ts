
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { handleError } from "@/lib/errorHandler";

export async function GET(req: Request) {
  try {
    const userEmail = req.headers.get("x-user-email");
    
    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user: any = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        activities: {
          where: { type: "UPLOAD" }, // We use UPLOAD as a proxy for "Downloaded Assets" in this demo context
          orderBy: { createdAt: "desc" }
        }
      } as any
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Map uploads/activities to "Downloaded Content"
    const downloads = (user.activities || []).map((act: any) => {
      // act.content usually looks like "UPLOAD: filename"
      const fileName = act.content.split(": ")[1] || "Study Asset";
      const size = "1.2 MB"; // Mock size
      const type = fileName.endsWith(".pdf") ? "Study Guide" : "Video Lesson";
      const icon = fileName.endsWith(".pdf") ? "📄" : "🎬";

      return {
        id: act.id,
        title: fileName,
        size,
        type,
        status: "Downloaded",
        icon,
        progress: 100
      };
    });

    // Add some default mock data if empty
    if (downloads.length === 0) {
      downloads.push(
        { id: "def-1", title: "Algebra Fundamentals", size: "1.2 GB", type: "Video Lesson", status: "Downloaded", icon: "🎬", progress: 100 },
        { id: "def-2", title: "English Grammar Guide", size: "45 MB", type: "Study Guide", status: "Downloaded", icon: "📄", progress: 100 }
      );
    }

    return NextResponse.json({
      success: true,
      downloads
    });

  } catch (error) {
    return handleError(error, "GET /api/downloads");
  }
}
