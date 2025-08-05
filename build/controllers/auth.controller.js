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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_models_1 = __importDefault(require("../models/user.models"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const async_handler_utils_1 = require("../utils/async-handler.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
exports.register = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, phone, gender } = req.body;
    if (!password) {
        throw new error_handler_middleware_1.default("password is required", 400);
    }
    console.log(email);
    const user = new user_models_1.default({
        firstName,
        lastName,
        email,
        phone,
        gender,
    });
    const hashedPassword = yield (0, bcrypt_utils_1.hashPoassword)(password);
    user.password = hashedPassword;
    console.log(user);
    yield user.save();
    res.status(201).json({
        message: "user registered successfully!",
        success: true,
        status: "success",
        data: user,
    });
}));
exports.login = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    if (!email) {
        throw new error_handler_middleware_1.default("email required", 400); //400
    }
    if (!password) {
        throw new error_handler_middleware_1.default("password required", 400); //400
    }
    const user = yield user_models_1.default.findOne({ email });
    if (!user) {
        throw new error_handler_middleware_1.default("credentials does not match", 400); //400
    }
    const _b = user === null || user === void 0 ? void 0 : user._doc, { password: userPass } = _b, userData = __rest(_b, ["password"]);
    const isPasswordMatch = yield (0, bcrypt_utils_1.comparePassword)(password, userPass);
    if (!isPasswordMatch) {
        throw new error_handler_middleware_1.default("credentials does not match", 400); //400
    }
    const payload = {
        _id: user._id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        role: user.role,
    };
    //! generate token
    const token = (0, jwt_utils_1.generateToken)(payload);
    // await sendMail({
    //   html: "<h1>Login success</h1>",
    //   to: "aerapoudel@gmail.com",
    //   subject: "Login Success",
    // });
    console.log(token);
    res
        .cookie("access_token", token, {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: true,
        maxAge: Number((_a = process.env.COOKIE_EXPIRES_IN) !== null && _a !== void 0 ? _a : "7") * 24 * 60 * 60 * 1000,
    })
        .status(201)
        .json({
        message: "Login successful",
        status: "success",
        success: true,
        data: {
            data: userData,
            access_token: token,
        },
    });
}));
// !update user
