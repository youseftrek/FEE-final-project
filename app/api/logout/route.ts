import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete the token cookie
    cookieStore.delete("token");

    return Response.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch {
    return Response.json({
      success: false,
      message: "Failed to logout",
    });
  }
}
