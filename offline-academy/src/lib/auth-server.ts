import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

type Role = "STUDENT" | "ADMIN";

export async function getCurrentUserRole(): Promise<Role | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("refreshToken")?.value; // In real app, check Access Token header first

    if (!token) return null;

    const payload = await verifyToken(token);
    return payload?.role as Role || null;
}

export async function verifyAuth(request: NextRequest): Promise<{ userId: string; email: string; role: Role } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("refreshToken")?.value;

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
