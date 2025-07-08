import { NextFunction, Request, Response } from "express";

  
    
    
    
    export const errorHandler = (error:any, req:Request, res:Response, next:NextFunction)=> {
      const statusCode = error?.statusCode || 500;
      
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
    
  