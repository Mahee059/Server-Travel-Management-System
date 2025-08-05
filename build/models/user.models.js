"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enum_types_1 = require("../types/enum.types");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'firstname is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'lastName is requitred'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        unique: [true, 'user already exists with provided email']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        min: 6
    },
    profile_image: {
        path: {
            type: String,
        },
        public_id: {
            type: String,
        },
    },
    role: {
        type: String,
        enum: Object.values(enum_types_1.Role),
        default: enum_types_1.Role.USER
    },
    phone: {
        type: String
    },
    gender: {
        type: String,
        enum: Object.values(enum_types_1.Gender),
        default: enum_types_1.Gender.NOTPREFER
    }
}, { timestamps: true });
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
