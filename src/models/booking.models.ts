import mongoose from "mongoose";
import { Booking_Status } from "../types/enum.types";

const bookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,'user is required']
    },
    tour_package:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'tour_package',
        required:[true,'tour_package is required']
    },
    total_person :{
        type:Number,
        min:[1, 'minimum 1person is required'],
        required:[true,'total persons is required'],
    },
    total_amount:{
        type:Number,
        required:[true,'total amount is required']
    },
     
    status: { 
        type: String,
        default: Booking_Status.PENDING, 
        enum:Object.values(Booking_Status)
    }

},{timestamps:true})

const Booking = mongoose.model('booking',bookingSchema)
export default Booking;