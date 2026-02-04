"use client";
import RoleGuard from "@/components/RoleGuard";
import { Role } from "@prisma/client";
import { useState } from "react";

export default function AdminPanel() {
    const [response, setResponse] = useState<string>("");

    const testAdminAction = async () => {
        try {
            const res = await fetch("/api/admin/delete-user", { method: "POST" });
            const data = await res.json();
            setResponse(JSON.stringify(data, null, 2));

            if (!res.ok) {
                alert("Access Denied: " + (data.message || res.statusText));
            } else {
                alert(data.message);
            }
        } catch (e: any) {
            alert("Error: " + e.message);
        }
    };

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">RBAC Control Panel</h1>

            <div className="p-6 border rounded-xl bg-gray-50 dark:bg-gray-900">
                <h2 className="text-xl font-bold mb-4">Dangerous Zone</h2>

                {/* Only Admins see this button */}
                <RoleGuard allowedRoles={[Role.ADMIN]} fallback={<p className="text-red-500">⛔ You are not authorized to view these controls.</p>}>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={testAdminAction}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-fit"
                        >
                            🗑️ Delete User Database
                        </button>
                        {response && <pre className="text-xs bg-black text-white p-2 rounded">{response}</pre>}
                    </div>
                </RoleGuard>
            </div>

            <div className="p-6 border rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <h2 className="text-xl font-bold mb-4">Teacher Zone</h2>
                <RoleGuard allowedRoles={[Role.ADMIN, Role.TEACHER]} fallback={<p className="text-gray-500">Teacher access only.</p>}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">
                        📝 Create New Lesson
                    </button>
                </RoleGuard>
            </div>
        </div>
    );
}
