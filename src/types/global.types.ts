import moongoose from "mongoose"; 
import { Role } from "./enum.types";


export const OnlyUser = [Role.USER]; 
export const OnlySuperAdmin = [Role.SUPER_ADMIN]
export const onlyAdmin = [Role.SUPER_ADMIN]
export const AllAdmins = [Role.SUPER_ADMIN, Role.ADMIN]
export const ALLUserAndAdmins= [Role.SUPER_ADMIN,Role.ADMIN,Role.USER]





export interface IPayload { 
    _id: moongoose.Types.ObjectId; 
    email: string; 
    firstname: string; 
    lastname: string; 
    role:Role, 

}

export interface IJwtpayload extends IPayload { 
    iat: number; 
    exp: number; 
    
}

