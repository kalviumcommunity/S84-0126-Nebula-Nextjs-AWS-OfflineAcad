/* eslint-disable no-console */
import { NextResponse } from "next/server";
import { getCurrentUserRole, unauthorized } from "@/lib/auth-server";
import { Role } from "@prisma/client";

export async function POST() {
    // 1. Audit Log (Incoming Request)
    console.log(`[RBAC] Request received for /api/admin/delete-user`);

    // 2. Strict Role Check
    const role = await getCurrentUserRole();

    // Only ADMIN is allowed
    if (role !== Role.ADMIN) {
        console.warn(`[RBAC] Access DENIED for role: ${role || "anonymous"}`);
        return unauthorized();
    }

    // 3. Execution (Simulated)
    console.log(`[RBAC] Access GRANTED for Admin.`);
    return NextResponse.json({
        success: true,
        message: "User deleted successfully (Simulated)"
    });
}
