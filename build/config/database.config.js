"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = (uri) => {
    mongoose_1.default
        .connect(uri)
        .then(() => {
        console.log("database connected");
    })
        .catch((err) => {
        console.log(err);
    });
};
exports.connectDatabase = connectDatabase;
