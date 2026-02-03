import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
                { status: 401 }
            );
        }
        
        const body = await req.json();
        const firstName = body.firstName;
        const lastName = body.lastName;
        const age = Number(body.age);
        const height = Number(body.height);
        const weight = Number(body.weight);
        
        // Helper function to safely parse JSON
        const safeJsonParse = (value: any) => {
            if (!value) return null;
            if (typeof value === "object") return value;
            try {
                return JSON.parse(value);
            } catch {
                return null;
            }
        };
        
        const equipment = safeJsonParse(body.equipment);
        const injures = safeJsonParse(body.injures);
        const others = safeJsonParse(body.others);
        
        const gender = body.gender;
        const goal = body.goal;
        const level = body.level;
        const place = body.place;
        const able = Boolean(body.able);
        const sessionTime = Number(body.sessionTime);
        const days = Number(body.days);

        if (!firstName || !lastName || !age || !height || !weight || !gender || !goal || !level || !place || able === undefined || !sessionTime || !days || !equipment) {
            return Response.json({ success: false, message: "data is missing" });
        }
        
        if (Number.isNaN(age)) {
            return Response.json({ success: false, message: "invalid age" });
        }
        if (Number.isNaN(height)) {
            return Response.json({ success: false, message: "invalid height" });
        }
        if (Number.isNaN(weight)) {
            return Response.json({ success: false, message: "invalid weight" });
        }
        if (age > 100 || age < 0) {
            return Response.json({ success: false, message: "invalid age" });
        }
        if (days > 7 || days < 0) {
            return Response.json({ success: false, message: "invalid days" });
        }
        if (height < 0) {
            return Response.json({ success: false, message: "invalid height" });
        }
        if (weight < 0) {
            return Response.json({ success: false, message: "invalid weight" });
        }
        
        // Accept both objects and arrays for Json fields
        if (!equipment || typeof equipment !== "object") {
            return Response.json({ success: false, message: "invalid equipment" });
        }
        if (injures && typeof injures !== "object") {
            return Response.json({ success: false, message: "invalid injures" });
        }
        if (others && typeof others !== "object") {
            return Response.json({ success: false, message: "invalid others" });
        }

        const newProfile = await prisma.profile.create({
            data: {
                firstName,
                lastName,
                age,
                height,
                weight,
                userId: data.userId,
                equipment,
                injures,
                others,
                gender,
                days,
                goal,
                level,
                place,
                able,
                sessionTime
            }
        });

        return Response.json({ success: true, message: "profile saved" });
    } catch (error) {
        console.error("Error creating profile:", error);
        return Response.json({ success: false, message: "internal server error try again later" });
    }
}