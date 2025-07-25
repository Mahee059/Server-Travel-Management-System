import { model, Schema } from "mongoose";
import { Package_Charge } from "../types/enum.types";

const packageSchema = new Schema({
    title:{
        type:String,
        required:[true,'title is required'],
        trim:true
    },


    cover_image: { 
        path:{ 
        type: String, 
        required:[true,'cover image is requried'],
    },

        public_id: {
            type: String,
            required: [true, "cover image is required"],
        }
     },


    images: [
         { 
        path:{ 
        type: String, 
    },

        public_id: {
            type: String,
        }
     }
        
    ], 
    
    destination:[
        { 
            location: { 
                type: String, 
                required:true
            },  
            description: { 
                type: String, 
        
            }
          }],
    

    start_date:{
        type:String,
        required:[true,'start_date is required'],  
    },
    end_date:{
        type:String,
        required:[true,'end_date is required'],
    },
    seats_available:{
        type:Number,
        required:[true,'total available seats are required']
    },
    total_charge:{
        type:Number,
        required:[true,'total_charge is required']
    },
    cost_type:{
        type:String,
        enum: Object.values(Package_Charge),
        default:Package_Charge.PER_PERSON
    }
}, { timestamps: true })

const Tour_Package = model('tour_package', packageSchema)
export default Tour_Package 

