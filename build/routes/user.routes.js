"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("../controllers/user.controllers");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const global_types_1 = require("../types/global.types");
const file_uploader_middleware_1 = require("../middlewares/file-uploader.middleware");
const uploader = (0, file_uploader_middleware_1.upload)();
const router = express_1.default.Router();
router.get('/', (0, authorization_middleware_1.authenticate)(global_types_1.AllAdmins), user_controllers_1.getAllUser);
router.get('/:userId', (0, authorization_middleware_1.authenticate)(global_types_1.ALLUserAndAdmins), user_controllers_1.getById);
router.put('/:userId', (0, authorization_middleware_1.authenticate)(global_types_1.ALLUserAndAdmins), uploader.single('profile_image'), user_controllers_1.updateProfile);
router.delete('/:userId', (0, authorization_middleware_1.authenticate)(global_types_1.ALLUserAndAdmins), user_controllers_1.deleteUser);
exports.default = router;
