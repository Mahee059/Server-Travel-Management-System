import { Request, Response } from "express";

import { asyncHandler } from "../utils/async-handler.utils";
import CustomError from "../middlewares/error-handler.middleware";
import Tour_Package from "../models/tour_packages.models";
import Booking from "../models/booking.models";


export const book = asyncHandler(async (req: Request, res: Response) => {
    const { tour_Package, total_person } = req.body;
    
    if (!tour_Package) {
        throw new CustomError('tour package is required', 400)
    }
    const tourPackage = await Tour_Package.findById(tour_Package);
    if (!tourPackage) {
        throw new CustomError("package not found", 400);
    }
    
    const booking = await Booking.create({
        total_person,
        tour_Package: tourPackage._id,
    });

    res.status(201).json({
        message: "Package Booked",
        data: booking,
        status: "sucess",
        success: true,
    });
    
}); 