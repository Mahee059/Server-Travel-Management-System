import { NextFunction, Request, Response } from "express";

  
    
class CustomError extends Error  { 
  //new Error (message)
  statusCode: number; 
  status: 'success' | 'fail' | 'error'
  isOpeartional: boolean 
  success: boolean 
  
  constructor(message:string, statusCode:number) { 
    
    super(message)
    //Error message 
    this.isOpeartional = true; 
    this.statusCode = statusCode; 
    this.success = false 
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error'; 
    Error.captureStackTrace(this,CustomError) 
    
    }
  }
  
      
      
     
  


    export const errorHandler = (error:any, req:Request, res:Response, next:NextFunction)=> {
      const statusCode = error?.statusCode || 500;
      console.log(error)
      
      const message = error?.message || 'Internal sever error'
      const success = error?.status || false 
      const status = error?.status || "error"


      res.status(statusCode).json({
        message,
        status,
        success,
        data: null
      });
    };
    
    export default CustomError
  