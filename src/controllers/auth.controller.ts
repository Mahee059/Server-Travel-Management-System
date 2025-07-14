import { Request, Response } from "express"; 
import User from "../models/user.models";
import { comparePassword, hashPoassword } from "../utils/bcrypt.utils";
import CustomError from "../middlewares/error-handler.middleware";

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
            throw new CustomError('email required',400);
        }  
        if (!password) {
            throw new CustomError('password required',400); 
       }
        
         const user = await User.findOne({email})
        if (!user) { 
              throw new CustomError('credentials does not match',400)
          }  

        const { password: userPass, ...userData } = user
     
        const isPasswordMatch = await comparePassword(password, userPass)

        if (!isPasswordMatch) {
            throw new CustomError('credentials does not match',400)
        }
          
        //!generate token 
        



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


