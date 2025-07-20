import jwt from "jsonwebtoken"; 
import { IJwtpayload, IPayload } from '../types/global.types';


const JWT_SECRET = process.env.JWT_SECRET ?? ''
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
export const generateToken = (payload: IPayload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as any 
    });
};
export const verifyToken = (token:string) => { 
     return jwt.verify(token,JWT_SECRET ) as IJwtpayload
 }