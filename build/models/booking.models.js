"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../types/enum.types");
const bookingSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'user is required']
    },
    tour_package: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'tour_package',
        required: [true, 'tour_package is required']
    },
    total_person: {
        type: Number,
        min: [1, 'minimum 1person is required'],
        required: [true, 'total persons is required'],
    },
    total_amount: {
        type: Number,
        required: [true, 'total amount is required']
    },
    status: {
        type: String,
        default: enum_types_1.Booking_Status.PENDING,
        enum: Object.values(enum_types_1.Booking_Status)
    }
}, { timestamps: true });
const Booking = mongoose_1.default.model('booking', bookingSchema);
exports.default = Booking;
