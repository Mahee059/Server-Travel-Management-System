import { Schema,model } from 'mongoose';
import { Gender, Role } from '../types/enum.types';
const userSchema = new Schema({
    firstName: { 
        type: String, 
        required: [true, 'firstname is required'],
        trim: true
    }, 
    lastName: { 
        type: String, 
        required: [true, 'lastName is requitred'], 
        trim: true, 
    
    }, 

    email: { 
        type: String, 
        required: [true, 'email is required'], 
        trim: true, 
        unique:[true,'user already exists with provided email']
    }, 
    
    password: {
        type: String, 
        required: [true, 'password is required'], 
        min:6
    }, 
     

    profile_image: {
        path: {
            type: String,
            
        },
        public_id: {
            type: String,
            
        },
    },
    role: {
        type: String, 
        enum: Object.values(Role),
        default:Role.USER
},
    phone: {
        type:String
    }, 
    gender: { 
        type: String,
        enum: Object.values(Gender), 
        default: Gender.NOTPREFER
        
    }

}, { timestamps: true })

const User = model('User', userSchema)
export  default User