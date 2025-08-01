import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import Booking from "../models/booking.models";
import CustomError from "../middlewares/error-handler.middleware";
import Tour_Package from "../models/tour_packages.models";
import { Booking_Status, Package_Charge } from "../types/enum.types";
import { sendMail } from "../utils/nodemailer.utils";


export const book = asyncHandler(async (req: Request, res: Response) => {
  const { tour_package, total_person } = req.body;
  const user = req.user._id;
  let total_cost: number;

  if (!tour_package) {
    throw new CustomError("tour package is required", 400);
  }

  const tourPackage = await Tour_Package.findById(tour_package);

  if (!tourPackage) {
    throw new CustomError("package not found", 400);
  }

  if (tourPackage?.seats_available < Number(total_person)) {
    throw new CustomError(
      `Only ${tourPackage.seats_available} seats  left`,
      400
    );
  }

  const booking = new Booking({
    total_person,
    tour_package: tourPackage._id,
    user,
  });

  if (tourPackage.cost_type === Package_Charge.PER_PERSON) {
    total_cost = Number(total_person) * Number(tourPackage?.total_charge);
    booking.total_amount = total_cost;
  } else {
    const totalDays =
      new Date(tourPackage.end_date).getDate() -
      new Date(tourPackage.start_date).getDate();

    total_cost = totalDays * total_person * Number(tourPackage?.total_charge);
    booking.total_amount = total_cost;
  }

  tourPackage.seats_available -= Number(total_person);

  //! send mail
  await sendMail({
      html: "<h1>Package booked</h1>",
      // package name , total person , booking time , total amount
      to: req.user.email,
      subject: "Booking success",
    });
  await booking.save();
  await tourPackage.save();

  // ! send confirmation email to user

  res.status(201).json({
    message: "Package Booked",
    data: booking,
    status: "sucess",
    success: true,
  });
});

export const cancel = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new CustomError("booking not found", 404);
  }
  const tour_package = await Tour_Package.findById(booking.tour_package);
  booking.status = Booking_Status.CANCELED;

  if (tour_package) {
    tour_package.seats_available += Number(booking.total_person);
    await tour_package.save();
  }
  await booking.save();

  // ! send  email to user

  res.status(200).json({
    message: "Booking canceled",
    status: "success",
    success: true,
    data: booking,
  });
});

export const confirm = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new CustomError("booking not found", 404);
  }

  booking.status = Booking_Status.CONFIRMED;

  await booking.save();

  // ! send confirmation email to user

  res.status(200).json({
    message: "Booking canceled",
    status: "success",
    success: true,
    data: booking,
  });
});

// ! get all bookings of currently loggedin user
export const getUsersBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user._id;

    const bookings = await Booking.find({ user }).populate("tour_package");

    res.status(200).json({
      message: "Bookings fetched",
      data: bookings,
    });
  }
);

// ! get all bookings for admin
export const getAllBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const bookings = await Booking.find({})
      .populate("tour_package")
      .populate("user");

    res.status(200).json({
      message: "Bookings fetched",
      data: bookings,
    });
  }
);

// ! get all bookings by tour package
export const getAllBookingsByTourPackage = asyncHandler(
  async (req: Request, res: Response) => {
    const { packageId } = req.params;
    const bookings = await Booking.find({ tour_package: packageId })
      .populate("tour_package")
      .populate("user");

    res.status(200).json({
      message: "Bookings fetched",
      data: bookings,
    });
  }
);

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await Booking.findById(id)
    .populate("tour_package")
    .populate("user");

  res.status(200).json({
    message: "Booking fetched",
    data: booking,
  });
});

//TODO: update booking
export const update = asyncHandler(async (req: Request, res: Response) => {
  // task {id} => params
  const { id } = req.params;
  const userId = req.user._id;
  let total_cost;
  // task {total_person} => body
  // ! total_person
  const total_person = Number(req.body.total_person);

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new CustomError("booking not found", 404);
  }
  const tour_package = await Tour_Package.findById(booking.tour_package);
  if (!tour_package) {
    throw new CustomError("tour package not found", 404);
  }
  if (booking.user.toString() !== userId.toString()) {
    throw new CustomError("You can not update this booking", 403);
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
      throw new CustomError(
        `only ${tour_package.seats_available} sets are available`,
        400
      );
    }

    booking.total_person = total_person;
    tour_package.seats_available -= changeInPerson;
    // ! cost calculation
    if (tour_package.cost_type === Package_Charge.PER_PERSON) {
      total_cost = Number(changeInPerson) * Number(tour_package?.total_charge);
      booking.total_amount += total_cost;
    } else {
      const totalDays =
        new Date(tour_package.end_date).getDate() -
        new Date(tour_package.start_date).getDate();

      total_cost =
        totalDays * total_person * Number(tour_package?.total_charge);
      booking.total_amount += total_cost;
    }
  }

  if (changeInPerson < 0) {
    booking.total_person = total_person;
    tour_package.seats_available += Math.abs(changeInPerson);

    if (tour_package.cost_type === Package_Charge.PER_PERSON) {
      total_cost =
        Math.abs(changeInPerson) * Number(tour_package?.total_charge);
      booking.total_amount -= total_cost;
    } else {
      const totalDays =
        new Date(tour_package.end_date).getDate() -
        new Date(tour_package.start_date).getDate();

      total_cost =
        totalDays *
        Math.abs(changeInPerson) *
        Number(tour_package?.total_charge);
      booking.total_amount -= total_cost;
    }
  }

  //! send mail


  await booking.save();
  await tour_package.save();

  res.status(200).json({
    message: "booking updated",
    data: booking,
    status: "success",
    success: true,
  });
});