import { signToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;
    const password = body.password;
    if (!email || !password) {
      return Response.json({ success: false, message: "data is missing" });
    }
    const dbUser = await prisma.user.findUnique({ where: { email: email } });
    if (!dbUser) {
      return Response.json({ success: false, message: "user not found" });
    }
    if (dbUser.password !== password) {
      return Response.json({ success: false, message: "wrong password" });
    }
    const token = signToken({ userId: dbUser.id, email: dbUser.email });

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return Response.json({
      success: true,
      message: "user loged in sucessfully",
    });
  } catch {
    return Response.json({
      success: false,
      message: "internal server error try again later",
    });
  }
}
