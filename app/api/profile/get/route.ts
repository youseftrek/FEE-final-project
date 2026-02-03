import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) { 
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const token = authHeader.split(" ")[1];
        const data = verifyToken(token);
        if (!data) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 });
        }
        const profile = await prisma.profile.findUnique({ where: { userId: data.userId } })
        if (!profile) {
            return Response.json({ success: false, message: "User Dont have Profile" })
        }
        return Response.json({ success: true, message: "done", profile })
    } catch {
        return Response.json({ success: false, message: "internal server error try again later" })
    }
}
