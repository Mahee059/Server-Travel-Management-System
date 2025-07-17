import { NextFunction, Request, Response } from "express"
import CustomError from "./error-handler.middleware";
import { verifyToken } from "../utils/jwt.utils";
import User from "../models/user.models";

export const authenticate = () => { 
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

            next()
        } catch (error) {
         next(error) 

        }
    }
}