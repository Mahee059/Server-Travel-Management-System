import { NextFunction, Request, Response } from "express";
import User from "../models/user.models";
import { comparePassword, hashPoassword } from "../utils/bcrypt.utils";
import CustomError from "../middlewares/error-handler.middleware";
import { asyncHandler } from "../utils/async-handler.utils";
import { generateToken } from "../utils/jwt.utils";
import { IPayload } from "../types/global.types";

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone, gender } = req.body;
    //cosnole.log(re)

    if (!password) {
      throw new CustomError("password is required",400);
    }
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      gender,
    });

    const hashedPassword = await hashPoassword(password);

    user.password = hashedPassword;

    await user.save();

    res.status(201).json({
      message: "user registered sucessfully",
      sucess: true,
      status: "success",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error?.message ?? "Internal Server Error",
      success: false,
      status: "fail",
      data: null,
    });
  }
};

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError("email required", 400);
    }
    if (!password) {
      throw new CustomError("password required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("credentials does not match", 400);
    }

    const { password: userPass, ...userData } = user;

    const isPasswordMatch = await comparePassword(password, userPass);

    if (!isPasswordMatch) {
      throw new CustomError("credentials does not match", 400);
    }
    const payload: IPayload = {
      _id: user._id,
      email: user.email,
      firstname: user.firstName,
      lastname: user.lastName,
      role: user.role,
    };
    //!generate token

    const token = generateToken(payload);
    console.log(token);
    res
      .cookie("access_token", token, {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: true,
        maxAge:
          Number(process.env.COOKIE_EXPRESS_in ?? "7") * 24 * 60 * 60 * 1000,
      })
      .status(201).json({
        message: "Login sucessful",
        status: "success",
        success: true,
        data: {
          data: userData,
          access_token: token,
        },
      });
  }
);
