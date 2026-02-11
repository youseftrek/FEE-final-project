import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const userMsg = body.message;
  const history = body.history || [];

  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  let userData = null;
  let userProfile = null;

  if (!userMsg) {
    return NextResponse.json(
      {
        success: false,
        message: "Please enter your message",
      },
      {
        status: 400,
      },
    );
  }

  if (token) {
    try {
      userData = verifyToken(token.value);
      if (userData) {
        userProfile = await prisma.profile.findUnique({ where: { userId: userData.userId } });
      }
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  }


  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        message: "API key is not found, add it to .env file",
      },
      {
        status: 500,
      },
    );
  }

  let profileContext = "";
  if (userProfile) {
    profileContext = `
## User Profile Context
- Name: ${userProfile.firstName} ${userProfile.lastName}
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Height: ${userProfile.height} cm
- Weight: ${userProfile.weight} kg
- Goal: ${userProfile.goal}
- Fitness Level: ${userProfile.level}
- Workout Location: ${userProfile.place}
- Available Equipment: ${Array.isArray(userProfile.equipment) ? userProfile.equipment.join(", ") : JSON.stringify(userProfile.equipment)}
- Injuries/Limitations: ${userProfile.injures ? (Array.isArray(userProfile.injures) ? userProfile.injures.join(", ") : JSON.stringify(userProfile.injures)) : "None reported"}
- Schedule: ${userProfile.days} days per week, ${userProfile.sessionTime} minutes per session
`;
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = `
## Overview
You are an AI Fitness & Diet Planner(Healthify). Your job is to give concise, practical guidance on fitness, workouts, nutrition, and physical health only.
The current date and time is ${new Date().toLocaleString()}
${profileContext}

## Rules
- Keep responses VERY short (2-3 sentences maximum)
- Answer only fitness, diet, workouts, and physical health topics
- No medical diagnosis, medications, or treatments
- Do not re-introduce yourself after the first message

## Instructions
1) Always use the user's first name throughout the conversation if available in the User Profile Context - make responses personal and friendly
2) For greetings or casual messages: Briefly introduce yourself and ask what specific topic they need help with (e.g., "workout plan", "nutrition advice", "exercise form")
3) Reply in the user's language
4) Only provide detailed advice when the user specifically requests it
5) If User Profile Context is provided, only mention specific details when giving actual advice - don't list it out unprompted
6) Wait for the user to tell you what they want help with before offering detailed plans

## Examples
1)
Input: Hi (with user name available)
- Output: "Hello [Name]! I'm Healthify, your fitness and diet assistant. What would you like help with today - workout planning, nutrition advice, or something else?"

2)
Input: Hi (without user profile)
- Output: "Hello! I'm Healthify, your fitness and diet assistant. What would you like help with today - workout planning, nutrition advice, or something else?"

3)
Input: What's the best investment?
- Output: "I specialize in fitness and nutrition only. I can help with workouts, diet, or health-related questions."
`;

  // Build conversation history for context
  let conversationHistory = systemPrompt + "\n\n## Conversation History:\n";

  if (history.length > 0) {
    history.forEach((msg: { role: string; content: string }) => {
      const roleLabel = msg.role === "user" ? "User" : "Assistant";
      conversationHistory += `${roleLabel}: ${msg.content}\n`;
    });
  }

  conversationHistory += `\nUser: ${userMsg}`;

  const aiResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: conversationHistory,
  });

  return NextResponse.json({ success: true, response: aiResponse.text });
}
