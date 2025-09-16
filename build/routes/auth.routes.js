"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const global_types_1 = require("../types/global.types");
const router = express_1.default.Router();
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
router.get('/me', (0, authorization_middleware_1.authenticate)(global_types_1.ALLUserAndAdmins), auth_controller_1.profile);
exports.default = router;
