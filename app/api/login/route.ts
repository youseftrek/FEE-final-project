import { signToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
    const email = body.email;
    const password = body.password;
    if (!email || !password) {
        return Response.json({success:false,message:"data is missing"}) 
    }
    const dbUser = await prisma.user.findUnique({ where: { email: email } })
    if (!dbUser) {
    
        return Response.json({ success: false, message: "user not found" })
    }
    if (dbUser.password !== password) {
        return Response.json({success:false,message:"wrong password"})   
    }
    const token = signToken({ userId: dbUser.id, email: dbUser.email });
    
    return Response.json({ success:true , message: "user loged in sucessfully",token })
    }
    catch {
    return Response.json({ success:false, message: "internal server error try again later"})

    }
}