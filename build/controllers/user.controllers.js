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
exports.deleteUser = exports.updateProfile = exports.getById = exports.getAllUser = void 0;
const user_models_1 = __importDefault(require("../models/user.models"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const async_handler_utils_1 = require("../utils/async-handler.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const user_folder = '/user';
//get all user
exports.getAllUser = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_models_1.default.find().select("-password");
    res.status(200).json({
        message: 'All users fetched',
        status: 'success',
        success: true,
        data: users
    });
}));
//get by id
exports.getById = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield user_models_1.default.findById(userId).select("-password");
    if (!user) {
        throw new error_handler_middleware_1.default("user not found", 404);
    }
    res.status(200).json({
        message: `user fetched`,
        status: "success",
        success: true,
        data: user
    });
}));
//update profile
exports.updateProfile = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { firstName, lastName, phone, gender } = req.body;
    const { userId } = req.params;
    const profile_image = req.file;
    const user = yield user_models_1.default.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.default("user not found", 404);
    }
    if (firstName)
        user.firstName = firstName;
    if (lastName)
        user.lastName = lastName;
    if (phone)
        user.phone = phone;
    if (gender)
        user.gender = gender;
    if (profile_image) {
        if ((_a = user.profile_image) === null || _a === void 0 ? void 0 : _a.public_id) {
            yield (0, cloudinary_utils_1.deleteFile)([(_b = user === null || user === void 0 ? void 0 : user.profile_image) === null || _b === void 0 ? void 0 : _b.public_id]);
        }
        user.profile_image = yield (0, cloudinary_utils_1.uploadFile)(profile_image.path, user_folder);
    }
    yield user.save();
    // OR findByIdAndUpdate ({id},{firstName,lastName,phone,gender},{new:true})
    res.status(200).json({
        message: `profile updated successully`,
        success: true,
        status: 'success',
        data: user
    });
}));
//delete user
exports.deleteUser = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { userId } = req.params;
    const user = yield user_models_1.default.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.default("user not found", 404);
    }
    if ((_a = user.profile_image) === null || _a === void 0 ? void 0 : _a.public_id) {
        yield (0, cloudinary_utils_1.deleteFile)([(_b = user.profile_image) === null || _b === void 0 ? void 0 : _b.public_id]);
    }
    yield user.deleteOne();
    res.status(200).json({
        message: `user deleted sucessfully`,
        success: true,
        status: 'success',
        data: null
    });
}));
