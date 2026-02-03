import { signToken } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"


export async function POST(req:Request)
{
    try {
        const body = await req.json()
    const name =body.name
    const email =body.email
    const pass = body.password
    if (!name || !email || !pass)
    {
        return Response.json({success:false,message:"Data is Missing"})
    }
    const dbUser = await prisma.user.findUnique({ where: { email: email } })
    if (dbUser !== null)
    {
        return Response.json({success:false,message:"User already exist"})
        
    }
    const newUser = await prisma.user.create({ data: { name: name, email: email, password: pass } })
    const token = signToken({ userId: newUser.id, email: newUser.email })
   
    return Response.json({success:true,message:"User Create successfully",user:{id:newUser.id,email:newUser.email,name:newUser.name,token}})
    }
    catch {
            return Response.json({ success:false, message: "internal server error try again later"})
    }
}