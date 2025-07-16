import jwt from "jsonwebtoken"; 
import { IPayload } from '../types/global.types';


const JWT_SECRET = process.env.JWT_SECRET 
export const generateToken = (payload: IPayload) => {
    return jwt.sign(payload, 'JWT_SECRET', {
        expiresIn: "1d",
    });
};
