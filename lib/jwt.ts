import jwt from "jsonwebtoken"
const JWT_SECERT = "sdjgfyu21jsdfbh" 
export function signToken(payload: { userId: string; email: string })
{
    return jwt.sign(payload,JWT_SECERT,{expiresIn:"7d"})
}

export function verifyToken(token:string)
{
    try {
        
        return  jwt.verify(token,JWT_SECERT)as {userId:string, email :string}
    }
    catch {
        return null
    }
}
