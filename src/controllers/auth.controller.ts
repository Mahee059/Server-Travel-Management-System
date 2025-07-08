import { Request, Response } from "express"; 
import User from "../models/user.models";
import { comparePassword, hashPoassword } from "../utils/bcrypt.utils";

export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, phone, gender } = req.body
        //cosnole.log(re)
 
        if (password) {
            throw new Error('password is required')
        }
        const user =  new User({
                firstName,
                lastName,
                email,
                password,
                phone,
                gender
                
            });

        const hashedPassword = await hashPoassword(password)

        user.password = hashedPassword
        

        await user.save() 

        res.status(201).json({
            message: 'user registered sucessfully',
            sucess: true,
            status: 'success',
            data: user,
        });
        
        

    } catch (error: any) {
        res.status(500).json({
            message: error?.message ?? 'Internal Server Error',
            success: false,
            status: 'fail',
            data: null,
        });
        
    }
};


export const login = async (req: Request, res: Response) => {
    
    try {
     
        const { email, password } = req.body

        if (!email || !password) {
            throw new Error('email required');
        }  
        if (!password) {
            throw new Error('password required'); 
       }
        
         const user = await User.findOne({email})
        if (!user) { 
              throw new Error('credentials does not match')
          }  

        const { password: userPass, ...userData } = user
     
        const isPasswordMatch = await comparePassword(password, userPass)

        if (!isPasswordMatch) {
            throw new Error('credentials does not match')
        }
          
        res.status(201).json({
            message: 'Login sucessful', 
            status: 'success', 
            success: true, 
            data: userData, 
            
          })


    } catch (error: any) {
        res.status(500).json({
            message: error?.message ?? 'Internal Server Error',
            success: false,
            status: 'fail',
            data: null,
        });
        
    }

}
