import { signToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = body.name;
    const email = body.email;
    const pass = body.password;
    if (!name || !email || !pass) {
      return Response.json({ success: false, message: "Data is Missing" });
    }
    const dbUser = await prisma.user.findUnique({ where: { email: email } });
    if (dbUser !== null) {
      return Response.json({ success: false, message: "User already exist" });
    }
    const newUser = await prisma.user.create({
      data: { name: name, email: email, password: pass },
    });
    const token = signToken({ userId: newUser.id, email: newUser.email });

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
      message: "User Create successfully",
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch {
    return Response.json({
      success: false,
      message: "internal server error try again later",
    });
  }
}
