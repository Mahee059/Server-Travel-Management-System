import { model, Schema } from "mongoose";
import { Package_Charge } from "../types/enum.types";

const packageSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },

    cover_image: {
      path: {
        type: String,
        required: [true, "cover image is required"],
      },
      public_id: {
        type: String,
        required: [true, "cover image is required"],
      },
    },
    images: [
      {
        path: {
          type: String,
        },
        public_id: {
          type: String,
        },
      },
    ],

    destinations: [
      {
        location: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: false,
        },
      },
    ],

    start_date: {
      type: String,
      required: [true, "start_date is required"],
    },
    end_date: {
      type: String,
      required: [true, "end_date is required"],
    },
    seats_available: {
      type: Number,
      required: [true, "total available seats are required"],
    },
    total_seats: {
      type: Number,
      required: [true, "total seats are required"],
    },
    total_charge: {
      type: Number,
      requred: [true, "total cost is required"],
    },
    cost_type: {
      type: String,
      enum: Object.values(Package_Charge),
      default: Package_Charge.PER_PERSON,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Tour_Package = model("tour_package", packageSchema);

export default Tour_Package;