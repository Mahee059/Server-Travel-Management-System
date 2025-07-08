import { Request, Response, NextFunction } from "express"; 
import User from "../models/user.models"; 

export const getAllUser = async (req: Request, res: Response) => {


    try {
        const users = await User.find({});

        res.status(200).json({
            message: "All user fetched",
            status: "success",
            data: users,

        });
    

    } catch (error: any) {
        res.status(200).json({
            message: error?.message ?? "Somenting went wrong",
            status: "error",
        });
    }
};


//get user by id 
export const getBYId = async (req: Request, res: Response, next: NextFunction) => {


    try {
        //1. get user id <-from client

        const { id } = req.params
        //2. query db <-findBYid()
       
        const user = await User.findOne({ _id: id })
        //const user = User.findById(id)

        if (!user) { 
            const err : any = new Error('user not found')
            err.statusCode = 404
            err.success = false
            err.status = 'fail'
            throw err

        }
        
        res.status(200).json({
            message: "All user fetched",
            status: "success",
            data: user,

        });
    

    } catch (error: any) {
        // res.status(200).json({
        //     message: error?.message ?? "Somenting went wrong",
        //     status: "error",
        // });
 
        error.statusCode = error.statusCode ?? 500
        error.success = false
        error.status = error.status ?? 'error'

        next (error)
    }
};
 