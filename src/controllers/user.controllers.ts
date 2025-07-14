import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../models/user.models";
import CustomError from "../middlewares/error-handler.middleware";
import { asyncHandler } from "../utils/async-handler.utils";

export const getallUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});
    res.status(200).json({
      messsage: "All user fetched",
      status: "success",
      success: "true",
      data: users,
    });
  }
);

//get user by id
export const getBYId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //1. get user id <-from client

    const { id } = req.params;
    //2. query db <-findBYid()

    const user = await User.findOne({ _id: id });
    //const user = User.findById(id)

    if (!user) {
      throw new CustomError("user not found", 404);
    }

    res.status(200).json({
      message: "All user fetched",
      status: "success",
      data: user,
    });
  }
);
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        throw new CustomError("user not found", 404);
      }

      res.status(200).json({
        message: `user deleted`,
        data: deletedUser,
      });
    } catch (error: any) {
      next(error);
    }
  }
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, phone, gender } = req.body;
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;

    await user.save();
    res.status(200).json({
      message: `profile updated succesfully`,
      success: true,
      status: "success",
      data: user,
    });
  }
);
