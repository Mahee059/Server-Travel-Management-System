"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const upload = () => {
    if (!fs_1.default.existsSync('uploads')) {
        fs_1.default.mkdirSync('uploads', { recursive: true });
    }
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            const fileName = file.fieldname + '-' + Date.now() + '-' + file.originalname;
            cb(null, fileName);
        }
    });
    return (0, multer_1.default)({ storage });
};
exports.upload = upload;
