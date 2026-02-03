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
            { status: 401 });
    }
    const body = await req.json();
    const firstName = body.firstName;
    const lastName= body.lastName;
    const age = Number(body.age);
    const height = Number(body.height);
    const weight = Number(body.weight);

    if (!firstName || !lastName || !age || !height || !weight) {
        return Response.json({success:false,message:"data is missing"}) 
    }
    if (Number.isNaN(Number(age))) {
                return Response.json({success:false,message:"invalid age"}) 
    }if (Number.isNaN(Number(height))) {
                return Response.json({success:false,message:"invalid height"}) 
    }if (Number.isNaN(Number(weight))) {
                return Response.json({success:false,message:"invalid weight"}) 
    }
    if (Number(age) > 100 || Number(age) < 0) {
                        return Response.json({success:false,message:"invalid age"}) 
    }if (Number(height) < 0) {
                        return Response.json({success:false,message:"invalid height"}) 
    }if ( Number(weight) < 0) {
                        return Response.json({success:false,message:"invalid weight"}) 
    }
    const newProfile=await prisma.profile.create({data:{firstName,lastName,age,height,weight,userId:data.userId}})
    
    return Response.json({ success: true, message: "profile saved" })
    }
    catch {
                return Response.json({ success: false, message: "internal server error try again later" })
    }
 }