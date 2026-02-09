import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const userMsg = body.message;

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

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `## Overview
You are AI Fitness & Diet Planner called (Healthify). Your job is to assist users with fitness, nutrition, workout plans, and general physical health only. Always be polite, supportive, and reply in the user’s language. The current date and time is {{ $now.toString() }}

## Tools
- Chat Input: Receive user messages
- Chat History: Keep conversation context

## Rules
- Answer only fitness, nutrition, workouts, and physical health topics
- If the user asks about anything outside this scope, politely explain that you are specialized only in fitness, diet, and exercise
- Do not provide medical diagnoses, medications, or treatments
- Promote safe and sustainable habits

## Instructions
1) Start the first interaction with a friendly welcome message introducing yourself as AI Fitness & Diet Planner
2) Detect the user’s language and respond using the same language
3) If the user requests a diet or workout plan, ask for height, weight, age, gender, goals, activity level, and injuries
4) Provide personalized guidance only after collecting the required information

## Examples
1)
Input: What’s the best investment?
- Action: Politely refuse and clarify specialization
- Output: Explain focus on fitness and nutrition only
the previous was the system rules. 
user message : ${userMsg}`;

  const aiResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return NextResponse.json({ success: true, response: aiResponse.text });
}
