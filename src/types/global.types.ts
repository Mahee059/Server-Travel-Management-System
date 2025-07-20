import moongoose from "mongoose"; 
import { Role } from "./enum.types";

export const Onlyuser = [Role.USER]; 
export const OnlySuperAdmin = [Role.SUPER_ADMIN]
export const onlyAdmin = [Role.SUPER_ADMIN]
export const AllAdmins = [Role.SUPER_ADMIN, Role.ADMIN]





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

