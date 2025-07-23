
import { Request, Response, NextFunction } from "express";

export function checkRole(...allowedRoles: string[]){
    return (req: Request, res:Response, next:NextFunction)=>{
        const user = (req as any).user
        if(!user){
            return res.status(401).json({msg:"Non authentifié."})
        }

        if(!allowedRoles.includes(user.role)){
            return res.status(403).json({msg:"Accès interdit. Role insuffisant."})
        }
        next()
    }
}