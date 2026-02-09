import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token) {
            return Response.json({ success: false, message: "Not authenticated" }, { status: 401 });
        }

        const data = verifyToken(token.value);
        if (!data) {
            return Response.json({ success: false, message: "Invalid token" }, { status: 401 });
        }

        const profile = await prisma.profile.findUnique({ where: { userId: data.userId } });
        if (!profile) {
            return Response.json({ success: false, message: "User Dont have Profile" });
        }
        return Response.json({ success: true, message: "done", profile });
    } catch {
        return Response.json({ success: false, message: "internal server error try again later" });
    }
}
