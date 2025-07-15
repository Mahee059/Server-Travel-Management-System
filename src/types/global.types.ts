import moongoose from "mongoose"; 
import { Role } from "./enum.types";
export interface IPayload { 
    _id: moongoose.Types.ObjectId; 
    email: string; 
    firstname: string; 
    lastname: string; 
    role:Role, 

}