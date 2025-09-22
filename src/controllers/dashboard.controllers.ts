
import { Request, Response } from "express";
import User from "../models/user.models";
import { Role } from "../types/enum.types";
import Tour_Package from "../models/tour_packages.models";
import Booking from "../models/booking.models";


export const getDashboardCounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsersCount = await User.countDocuments();
    const usersCount = await User.countDocuments({ role: Role.USER});
    const adminsCount = await User.countDocuments({ role: Role.ADMIN });
    const tourPackagesCount = await Tour_Package.countDocuments();
    const bookingsCount = await Booking.countDocuments();

    res.json({
      totalUsers: totalUsersCount,
      users: usersCount,
      admins: adminsCount,
      tourPackages: tourPackagesCount,
      bookings: bookingsCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch counts" });
  }
};