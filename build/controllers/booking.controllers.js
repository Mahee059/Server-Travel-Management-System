"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.getById = exports.getAllBookingsByTourPackage = exports.getAllBookings = exports.getUsersBooking = exports.confirm = exports.cancel = exports.book = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const booking_models_1 = __importDefault(require("../models/booking.models"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const tour_packages_models_1 = __importDefault(require("../models/tour_packages.models"));
const enum_types_1 = require("../types/enum.types");
const nodemailer_utils_1 = require("../utils/nodemailer.utils");
exports.book = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('called');
    const { tour_package, total_person, phone } = req.body;
    const user = req.user._id;
    console.log('user');
    let total_cost;
    console.log(tour_package);
    if (!tour_package) {
        throw new error_handler_middleware_1.default("tour package is required", 400);
    }
    const tourPackage = yield tour_packages_models_1.default.findById(tour_package);
    console.log(tourPackage);
    if (!tourPackage) {
        throw new error_handler_middleware_1.default("package not found", 400);
    }
    if ((tourPackage === null || tourPackage === void 0 ? void 0 : tourPackage.seats_available) < Number(total_person)) {
        throw new error_handler_middleware_1.default(`Only ${tourPackage.seats_available} seats  left`, 400);
    }
    const booking = new booking_models_1.default({
        total_person,
        tour_package: tourPackage._id,
        user,
        phone
    });
    if (tourPackage.cost_type === enum_types_1.Package_Charge.PER_PERSON) {
        total_cost = Number(total_person) * Number(tourPackage === null || tourPackage === void 0 ? void 0 : tourPackage.total_charge);
        booking.total_amount = total_cost;
    }
    else {
        const totalDays = new Date(tourPackage.end_date).getDate() -
            new Date(tourPackage.start_date).getDate();
        total_cost = totalDays * total_person * Number(tourPackage === null || tourPackage === void 0 ? void 0 : tourPackage.total_charge);
        booking.total_amount = total_cost;
    }
    tourPackage.seats_available -= Number(total_person);
    const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <div style="background-color: #4CAF50; color: #ffffff; padding: 20px; text-align: center;">
        <h2>🎉 Booking Confirmed!</h2>
        <p>Thank you for choosing our tour service.</p>
      </div>

      <div style="padding: 30px;">
        <h3 style="margin-top: 0;">Booking Details</h3>
        <p><strong>Package Name:</strong> ${tourPackage.title}</p>
        <p><strong>Total Persons:</strong> ${booking.total_person}</p>
        <p><strong>Booking Date:</strong> ${new Date(booking.createdAt)}</p>
        <p><strong>Start Date:</strong> ${tourPackage.start_date}</p>
        <p><strong>End Date:</strong> ${tourPackage.end_date}</p>
        <p><strong>Total Amount:</strong> ₹${booking.total_amount}</p>

        <hr style="margin: 20px 0;">

        <p>If you have any questions, feel free to reply to this email.</p>
        <p>We look forward to giving you an unforgettable experience!</p>
      </div>

      <div style="background-color: #f1f1f1; text-align: center; padding: 15px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Your Travel Company. All rights reserved.</p>
      </div>

    </div>
  </div>
`;
    //! send mail
    yield (0, nodemailer_utils_1.sendMail)({
        html,
        // package name , total person , booking time , total amount
        to: req.user.email,
        subject: "Booking success",
    });
    yield booking.save();
    yield tourPackage.save();
    // ! send confirmation email to user
    res.status(201).json({
        message: "Package Booked",
        data: booking,
        status: "sucess",
        success: true,
    });
}));
exports.cancel = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const booking = yield booking_models_1.default.findById(id);
    if (!booking) {
        throw new error_handler_middleware_1.default("booking not found", 404);
    }
    const tour_package = yield tour_packages_models_1.default.findById(booking.tour_package);
    booking.status = enum_types_1.Booking_Status.CANCELED;
    if (tour_package) {
        tour_package.seats_available += Number(booking.total_person);
        yield tour_package.save();
    }
    yield booking.save();
    // ! send  email to user
    res.status(200).json({
        message: "Booking canceled",
        status: "success",
        success: true,
        data: booking,
    });
}));
exports.confirm = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const booking = yield booking_models_1.default.findById(id);
    if (!booking) {
        throw new error_handler_middleware_1.default("booking not found", 404);
    }
    booking.status = enum_types_1.Booking_Status.CONFIRMED;
    yield booking.save();
    // ! send confirmation email to user
    res.status(200).json({
        message: "Booking canceled",
        status: "success",
        success: true,
        data: booking,
    });
}));
// ! get all bookings of currently loggedin user
exports.getUsersBooking = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user._id;
    const bookings = yield booking_models_1.default.find({ user }).populate("tour_package");
    res.status(200).json({
        message: "Bookings fetched",
        data: bookings,
    });
}));
// ! get all bookings for admin
exports.getAllBookings = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    const bookings = yield booking_models_1.default.find({})
        .populate("tour_package")
        .populate("user");
    // const aggregate = [
    //   {
    //     $lookup:{
    //       from:'users',
    //       localField:'user',
    //       foreignField:'_id',
    //       as:'user'
    //     }
    //   },
    //   {
    //     $unwind:'$user'
    //   },
    //   {
    //     $match:{
    //    'user.firstName': {
    //         $options:'i',
    //         $regex:query
    //       }
    //     }
    //   }
    // ]
    // const bookings =await  Booking.aggregate(aggregate)
    res.status(200).json({
        message: "Bookings fetched",
        data: bookings,
    });
}));
// ! get all bookings by tour package
exports.getAllBookingsByTourPackage = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { packageId } = req.params;
    const bookings = yield booking_models_1.default.find({ tour_package: packageId })
        .populate("tour_package")
        .populate("user");
    res.status(200).json({
        message: "Bookings fetched",
        data: bookings,
    });
}));
exports.getById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const booking = yield booking_models_1.default.findById(id)
        .populate("tour_package")
        .populate("user");
    res.status(200).json({
        message: "Booking fetched",
        data: booking,
    });
}));
//TODO: update booking
exports.update = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // task {id} => params
    const { id } = req.params;
    const userId = req.user._id;
    let total_cost;
    // task {total_person} => body
    // ! total_person
    const total_person = Number(req.body.total_person);
    const booking = yield booking_models_1.default.findById(id);
    if (!booking) {
        throw new error_handler_middleware_1.default("booking not found", 404);
    }
    const tour_package = yield tour_packages_models_1.default.findById(booking.tour_package);
    if (!tour_package) {
        throw new error_handler_middleware_1.default("tour package not found", 404);
    }
    if (booking.user.toString() !== userId.toString()) {
        throw new error_handler_middleware_1.default("You can not update this booking", 403);
    }
    // ! changeInPerson
    const changeInPerson = total_person - booking.total_person;
    if (changeInPerson === 0) {
        res.status(200).json({
            message: "person not changed",
        });
    }
    if (changeInPerson > 0) {
        if (tour_package.seats_available < changeInPerson) {
            throw new error_handler_middleware_1.default(`only ${tour_package.seats_available} sets are available`, 400);
        }
        booking.total_person = total_person;
        tour_package.seats_available -= changeInPerson;
        // ! cost calculation
        if (tour_package.cost_type === enum_types_1.Package_Charge.PER_PERSON) {
            total_cost = Number(changeInPerson) * Number(tour_package === null || tour_package === void 0 ? void 0 : tour_package.total_charge);
            booking.total_amount += total_cost;
        }
        else {
            const totalDays = new Date(tour_package.end_date).getDate() -
                new Date(tour_package.start_date).getDate();
            total_cost =
                totalDays * total_person * Number(tour_package === null || tour_package === void 0 ? void 0 : tour_package.total_charge);
            booking.total_amount += total_cost;
        }
    }
    if (changeInPerson < 0) {
        booking.total_person = total_person;
        tour_package.seats_available += Math.abs(changeInPerson);
        if (tour_package.cost_type === enum_types_1.Package_Charge.PER_PERSON) {
            total_cost =
                Math.abs(changeInPerson) * Number(tour_package === null || tour_package === void 0 ? void 0 : tour_package.total_charge);
            booking.total_amount -= total_cost;
        }
        else {
            const totalDays = new Date(tour_package.end_date).getDate() -
                new Date(tour_package.start_date).getDate();
            total_cost =
                totalDays *
                    Math.abs(changeInPerson) *
                    Number(tour_package === null || tour_package === void 0 ? void 0 : tour_package.total_charge);
            booking.total_amount -= total_cost;
        }
    }
    //! send mail
    yield booking.save();
    yield tour_package.save();
    res.status(200).json({
        message: "booking updated",
        data: booking,
        status: "success",
        success: true,
    });
}));
// get bookings by user 
// -> filter
