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
exports.authenticate = void 0;
const error_handler_middleware_1 = __importDefault(require("./error-handler.middleware"));
const jwt_utils_1 = require("../utils/jwt.utils");
const user_models_1 = __importDefault(require("../models/user.models"));
const authenticate = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.cookies.access_token;
            // console.log(token)
            if (!token) {
                throw new error_handler_middleware_1.default('Unathorized. Access denied', 401);
            }
            //decode token
            const decodedData = (0, jwt_utils_1.verifyToken)(token);
            // console.log(decodedData)
            // check if user exists in database
            const user = yield user_models_1.default.findOne({ email: decodedData.email });
            if (!user) {
                throw new error_handler_middleware_1.default('Unathorized. Access Denied', 401);
            }
            // token expiry
            if (Date.now() > (decodedData === null || decodedData === void 0 ? void 0 : decodedData.exp) * 1000) {
                res.clearCookie('access_token', {
                    maxAge: Date.now()
                });
                throw new error_handler_middleware_1.default('Unathorized. Access Denied', 401);
            }
            //role based
            if (Array.isArray(roles) && (!(roles === null || roles === void 0 ? void 0 : roles.includes(user.role)) || !(roles === null || roles === void 0 ? void 0 : roles.includes(decodedData.role)))) {
                throw new error_handler_middleware_1.default('Forbidden. you cannot access this resource.', 403);
            }
            req.user = {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            };
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.authenticate = authenticate;
