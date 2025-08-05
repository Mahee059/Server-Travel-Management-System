"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        //Error message 
        this.isOpeartional = true;
        this.statusCode = statusCode;
        this.success = false;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        Error.captureStackTrace(this, CustomError);
    }
}
const errorHandler = (error, req, res, next) => {
    const statusCode = (error === null || error === void 0 ? void 0 : error.statusCode) || 500;
    console.log(error);
    const message = (error === null || error === void 0 ? void 0 : error.message) || 'Internal sever error';
    const success = (error === null || error === void 0 ? void 0 : error.status) || false;
    const status = (error === null || error === void 0 ? void 0 : error.status) || "error";
    res.status(statusCode).json({
        message,
        status,
        success,
        data: null
    });
};
exports.errorHandler = errorHandler;
exports.default = CustomError;
