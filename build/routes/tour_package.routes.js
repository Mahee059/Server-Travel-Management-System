"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tour_package_controllers_1 = require("../controllers/tour_package.controllers");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const global_types_1 = require("../types/global.types");
const file_uploader_middleware_1 = require("../middlewares/file-uploader.middleware");
// multer uploader
const uploader = (0, file_uploader_middleware_1.upload)();
const router = express_1.default.Router();
//public routes
router.get("/", tour_package_controllers_1.getAll);
router.get("/:id", tour_package_controllers_1.getById);
//private routes
router.post("/", (0, authorization_middleware_1.authenticate)(global_types_1.AllAdmins), uploader.fields([
    {
        name: "cover_image",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 5,
    },
]), tour_package_controllers_1.create);
router.put("/:id", (0, authorization_middleware_1.authenticate)(global_types_1.AllAdmins), uploader.fields([
    {
        name: 'cover_image',
        maxCount: 1
    },
    {
        name: 'images',
        maxCount: 5,
    }
]), tour_package_controllers_1.update);
router.delete("/:id", (0, authorization_middleware_1.authenticate)(global_types_1.AllAdmins), tour_package_controllers_1.remove);
exports.default = router;
