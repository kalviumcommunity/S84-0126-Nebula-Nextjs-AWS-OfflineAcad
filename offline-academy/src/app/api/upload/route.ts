import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;
    const userEmail = req.headers.get("x-user-email");

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const path = join(uploadDir, fileName);
    
    await writeFile(path, buffer);
    const publicUrl = `/uploads/${fileName}`;

    // Create activity record
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (user) {
      await prisma.activity.create({
        data: {
          userId: user.id,
          type: "UPLOAD",
          content: `Uploaded file: ${file.name}`
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "File synchronized locally",
      url: publicUrl
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
