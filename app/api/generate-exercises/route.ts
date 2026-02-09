import { GoogleGenAI } from "@google/genai";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const decoded = verifyToken(token.value);
    if (!decoded) {
      return Response.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: decoded.userId },
    });

    if (!profile) {
      return Response.json(
        {
          success: false,
          message: "Profile not found. Please complete your profile first.",
        },
        { status: 404 },
      );
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { success: false, message: "API key not configured" },
        { status: 500 },
      );
    }

    // Prepare AI prompt with profile data
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a professional fitness coach. Based on the user's profile below, generate a personalized workout plan with 6-8 exercises.

User Profile:
- Name: ${profile.firstName} ${profile.lastName}
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height}cm
- Weight: ${profile.weight}kg
- Fitness Goal: ${profile.goal}
- Fitness Level: ${profile.level}
- Training Location: ${profile.place}
- Available Equipment: ${JSON.stringify(profile.equipment)}
- Training Days per Week: ${profile.days}
- Session Duration: ${profile.sessionTime} minutes
- Injuries/Limitations: ${profile.injures ? JSON.stringify(profile.injures) : "None"}
- Able to train: ${profile.able ? "Yes" : "No"}

Generate a JSON array of exercises. Each exercise should have:
- name: Exercise name
- description: Brief description (1-2 sentences)
- sets: Number of sets
- reps: Reps or duration
- restTime: Rest time between sets
- difficulty: beginner/intermediate/advanced
- muscleGroups: Array of targeted muscle groups
- tips: Array of 2-3 important tips for proper form
- equipment: Required equipment (or "bodyweight")

Make sure exercises match the user's fitness level, available equipment, training location, and consider any injuries. Return ONLY a valid JSON array, no additional text.`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const responseText = aiResponse.text
      ? aiResponse.text.trim()
      : "No response from ai, try later";

    // Remove markdown code blocks if present
    let jsonText = responseText;
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    // Parse the JSON
    const exercises = JSON.parse(jsonText);

    return Response.json({
      success: true,
      exercises,
    });
  } catch (error) {
    console.error("Error generating exercises:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to generate exercises. Please try again.",
      },
      { status: 500 },
    );
  }
}
