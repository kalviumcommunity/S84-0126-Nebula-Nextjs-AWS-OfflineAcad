import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Role = "STUDENT" | "ADMIN";

export async function getCurrentUserRole(): Promise<Role | null> {
    // First try NextAuth session (for OAuth users)
    const session = await getServerSession(authOptions);
    if (session?.user?.role) {
        return session.user.role as Role;
    }

    // Fallback to old JWT token method (for password/OTP users)
    const cookieStore = await cookies();
    const token = cookieStore.get("refreshToken")?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    return payload?.role as Role || null;
}

export async function verifyAuth(request: NextRequest): Promise<{ userId: string; email: string; role: Role } | null> {
    // First try NextAuth session (for OAuth users)
    const session = await getServerSession(authOptions);
    if (session?.user) {
        return {
            userId: session.user.id,
            email: session.user.email!,
            role: session.user.role as Role,
        };
    }

    // Fallback to old JWT token method (for password/OTP users)

    const token = request.cookies.get("refreshToken")?.value;
    if (!token) return null;

    try {
        const payload = await verifyToken(token);
        if (!payload) return null;

        return {
            userId: payload.userId as string,
            email: payload.email as string,
            role: payload.role as Role,
        };
    } catch (error) {
        return null; // Invalid token
    }
}

export function unauthorized() {
    return NextResponse.json(
        { success: false, message: "⛔ RBAC: Access Denied. Insufficient Permissions." },
        { status: 403 }
    );
}
