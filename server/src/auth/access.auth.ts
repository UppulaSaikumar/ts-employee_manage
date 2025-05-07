import { Response, NextFunction } from "express";
import { verifyToken } from "../controllers/auth.controllers";
import { smallReq } from '../types/auth.types';

export const access = (req:smallReq,res:Response,next:NextFunction):any=>{
    const token:string =  req.cookies.token;
    if(!token){
        const error:Partial<Error>&{status:number} = {
            message: "No token is Found",
            status: 404,
        }
        res.send("token not found");
        return;
    }
    let decryptedCode = verifyToken(token);
    if(!decryptedCode){
        return;
    }
    req.email=decryptedCode.email
    next();
}
