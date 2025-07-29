import { NextFunction, Request, Response } from "express"
import customError from "./error-handler.middleware";
import { verifyToken } from "../utils/jwt.utils";
import User from "../models/user.models";
import { IJwtpayload} from "../types/global.types";
import { Role } from "../types/enum.types";

export const authenticate = (roles:Role[])=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const token = req.cookies.access_token;
            // console.log(token)

            if(!token){
                throw new customError('Unathorized. Access denied',401)
            }

            //decode token
            const decodedData:IJwtpayload= verifyToken(token)
            // console.log(decodedData)

            // check if user exists in database
            const user = await User.findOne({email:decodedData.email})
            if(!user){
                throw new customError('Unathorized. Access Denied',401)
            }

            // token expiry
            if(Date.now()> decodedData?.exp*1000){
                res.clearCookie('access_token',{
                    maxAge:Date.now()
                })
                throw new customError('Unathorized. Access Denied',401)
            }

            //role based
            if(Array.isArray(roles) && (!roles?.includes(user.role) || !roles?.includes(decodedData.role))){
                throw new customError('Forbidden. you cannot access this resource.', 403)
            }
           

             req.user = {
                    _id:user._id,
                    email:user.email,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    role:user.role
            }



            next();
            
        } catch(error){
            next(error)
        }
    }
}