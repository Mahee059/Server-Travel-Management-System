import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import Tour_Package from "../models/tour_packages.models";
import CustomError from "../middlewares/error-handler.middleware";

export const create = asyncHandler(async (req: Request, res: Response) => {
    console.log(req.body)
    
    const {
        destination,
        title,
        start_date,
        end_date, seats_available,
        total_charge,
        cost_type,
        description,
    
    } = req.body

    const tour_package = await Tour_Package.create({
        destination:JSON.parse(destination ?? ""), 
        title,
        start_date:new Date(start_date), 
        end_date: new Date (end_date),
        seats_available,
        total_charge,
        cost_type,
        description
    })

    res.status(201).json({
        data:tour_package
    })
})  

export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const tour_packages = await Tour_Package.find({});


    res.status(201).json({
        messages: 'Packages fetched successfully.',
        success: true,
        status: 'success',
        data: tour_packages
    })
})
    
export const getBYId = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const tour_package = await Tour_Package.findOne({ _id: id })

    if (!tour_package) { 
        throw new CustomError ('Tour plan is not found',401)
    }
        
    res.status(201).json({
        messages: 'Packages fetched successfully.',
        success: true,
        status: 'success',
        data: tour_package
    })
    


});

export const update = asyncHandler(async (req: Request, res: Response) => {
        const{id} = req.params
    const {
        destination,
        title,
        start_date,
        end_date, seats_available,
        total_charge,
        cost_type,
        description,
    
    } = req.body

    const tour_package = await Tour_Package.findByIdAndUpdate(id, {
        title,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        seats_available,
        total_charge,
        cost_type,
        description,
    },
        { new: true, reValidate: true }
    );
    if (!tour_package) {
        throw new CustomError("Tour plan is not found", 404); 
        
        
    } 
    if (destination) { 
        tour_package.destination = JSON.parse(destination); 
        await tour_package.save(); 

    } 
    res.status(200).json({
        message: 'Tour plan updated',
        success: true,
        status: 'success',
        data: tour_package
    });;

});
    

//! delete tour package

export const remove = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const tour_package = await Tour_Package.findByIdAndDelete(id)
    if (!tour_package) { 
        throw new CustomError('package not found', 404); 
    } 
    res.status(200).json({ 
        message: 'Package deleted', 
        data: tour_package, 
        success: true, 
        status: 'success'
    })
})

    