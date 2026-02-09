import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return Response.json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = verifyToken(token.value);

    if (!decoded) {
      return Response.json({
        success: false,
        message: "Invalid token",
      });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        // Add other fields you need, but exclude password
      },
    });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    return Response.json({
      success: true,
      user,
    });
  } catch {
    return Response.json({
      success: false,
      message: "Failed to get session",
    });
  }
}
