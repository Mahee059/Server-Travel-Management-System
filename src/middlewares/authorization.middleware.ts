import { NextFunction, Request, Response } from "express"
import CustomError from "./error-handler.middleware";
import { verifyToken } from "../utils/jwt.utils";
import User from "../models/user.models";
import { IJwtpayload } from "../types/global.types";
import { Role } from "../types/enum.types";

export const authenticate = (roles?:Role[])  => {  
    return async (req: Request,res:Response, next: NextFunction) => { 
        try { 
            const token = req.cookies.access_token;
            console.log(token)
            if (!token) { 
                throw new CustomError  ('Unauthorized.Access denied',401)
            }
    
            // 2. decode token 
            const decodedData = verifyToken(token); 
            console.log(decodedData)
            if (!decodedData) { 
                throw new CustomError('Unauthorozied.Access denied',401)
                
            }
            
            // check database 
            const user = await User.findOne({email: decodedData.email })
            if (!user) { 
                throw new CustomError('Unauthorozied.Access denied',401)
                
            }
            // token expiry 
            if (Date.now() > decodedData?.exp* 100){ 
                throw new CustomError('Unauthorized.Access denied', 401)
            }

                
            //roles 
            if (Array.isArray(roles) && !roles?.includes(user.role)) { 
                throw new CustomError(
                    "Forbidden.You can not access this resource.",
                    403
                );
            
                
            }
            next()
        } catch (error) {
         next(error) 

        }
    }
}