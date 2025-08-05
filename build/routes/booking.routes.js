"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_controllers_1 = require("../controllers/booking.controllers");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const global_types_1 = require("../types/global.types");
const router = express_1.default.Router();
router.post('/', (0, authorization_middleware_1.authenticate)(global_types_1.OnlyUser), booking_controllers_1.book);
router.put('/confirm/:id', (0, authorization_middleware_1.authenticate)(global_types_1.AllAdmins), booking_controllers_1.confirm);
router.put('/cancel/:id', (0, authorization_middleware_1.authenticate)(global_types_1.AllAdmins), booking_controllers_1.cancel);
router.get('/', (0, authorization_middleware_1.authenticate)(global_types_1.AllAdmins), booking_controllers_1.getAllBookings);
router.get('/:id', (0, authorization_middleware_1.authenticate)(global_types_1.ALLUserAndAdmins), booking_controllers_1.getById);
router.get('/package/:packageId', (0, authorization_middleware_1.authenticate)(global_types_1.AllAdmins), booking_controllers_1.getAllBookingsByTourPackage);
router.get('/user', (0, authorization_middleware_1.authenticate)(global_types_1.OnlyUser), booking_controllers_1.getUsersBooking);
router.put('/:id', (0, authorization_middleware_1.authenticate)(global_types_1.OnlyUser), booking_controllers_1.update);
exports.default = router;
