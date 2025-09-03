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
exports.remove = exports.update = exports.getById = exports.getAll = exports.create = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const tour_packages_models_1 = __importDefault(require("../models/tour_packages.models"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
const tour_package_folder = "/tour_package";
exports.create = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { destinations, title, start_date, end_date, total_seats, total_charge, cost_type, description, } = req.body;
    const { cover_image, images } = req.files;
    if (!cover_image) {
        throw new error_handler_middleware_1.default("cover image is required", 400);
    }
    console.log(images);
    const tour_package = new tour_packages_models_1.default({
        destinations: destinations ? JSON.parse(destinations !== null && destinations !== void 0 ? destinations : "") : null,
        title,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        seats_available: parseInt(total_seats),
        total_seats: parseInt(total_seats),
        total_charge,
        cost_type,
        description,
    });
    if (!tour_package) {
        throw new error_handler_middleware_1.default("Someting went wrong.Try again later", 500);
    }
    tour_package.cover_image = yield (0, cloudinary_utils_1.uploadFile)(cover_image[0].path, tour_package_folder);
    if (images && images.length > 0) {
        const imagePath = yield Promise.all(images.map((img) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, cloudinary_utils_1.uploadFile)(img.path, tour_package_folder); })));
        tour_package.set("images", imagePath);
    }
    yield tour_package.save();
    res.status(201).json({
        message: "Package added successfully.",
        succes: true,
        status: "success",
        data: tour_package,
    });
}));
exports.getAll = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, start_date, end_date, min_price, max_price, seats_available, limit, page, } = req.query;
    const page_limit = Number(limit) || 15;
    const current_page = Number(page) || 1;
    const skip = (current_page - 1) * page_limit;
    let filter = {};
    if (query) {
        filter.$or = [
            {
                title: {
                    $regex: query,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: query,
                    $options: "i",
                },
            },
        ];
    }
    if (start_date || end_date) {
        if (start_date) {
            filter.start_date = {
                $gte: start_date,
            };
        }
        if (end_date) {
            filter.end_date = {
                $lte: end_date,
            };
        }
    }
    if (min_price || max_price) {
        if (min_price) {
            filter.total_charge = {
                $gte: min_price,
            };
        }
        if (max_price) {
            filter.total_charge = {
                $lte: max_price,
            };
        }
    }
    if (seats_available) {
        filter.seats_available = {
            $gte: seats_available,
        };
    }
    const tour_packages = yield tour_packages_models_1.default.find(filter)
        .limit(page_limit)
        .skip(skip);
    const total = yield tour_packages_models_1.default.countDocuments(filter);
    res.status(200).json({
        message: "Packages fetched successfully.",
        succes: true,
        status: "success",
        data: {
            data: tour_packages,
            pagination: (0, pagination_utils_1.getPagination)(total, page_limit, current_page),
        },
    });
}));
exports.getById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const tour_package = yield tour_packages_models_1.default.findOne({ _id: id });
    if (!tour_package) {
        throw new error_handler_middleware_1.default("Tour plan is not found", 404);
    }
    res.status(200).json({
        message: "Package fetched successfully.",
        succes: true,
        status: "success",
        data: tour_package,
    });
}));
exports.update = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { cover_image, images } = req.files;
    const { destinations, title, start_date, end_date, seats_available, total_charge, cost_type, description, deletededImage, } = req.body;
    const tour_package = yield tour_packages_models_1.default.findByIdAndUpdate(id, {
        title,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        seats_available,
        total_charge,
        cost_type,
        description,
    }, { new: true, reValidate: true });
    if (!tour_package) {
        throw new error_handler_middleware_1.default("Tour plan is not found", 404);
    }
    if (destinations) {
        tour_package.destinations = JSON.parse(destinations);
        // await tour_package.save();
    }
    if (cover_image) {
        // !__________
        if (tour_package.cover_image) {
            yield (0, cloudinary_utils_1.deleteFile)([(_a = tour_package === null || tour_package === void 0 ? void 0 : tour_package.cover_image) === null || _a === void 0 ? void 0 : _a.public_id]);
        }
        tour_package.cover_image = yield (0, cloudinary_utils_1.uploadFile)(cover_image[0].path, tour_package_folder);
    }
    if (deletededImage &&
        deletededImage.length > 0 &&
        tour_package.images.length > 0) {
        //! delete images form cloudinary
        yield (0, cloudinary_utils_1.deleteFile)(deletededImage);
        const oldImages = tour_package.images.filter((img) => !deletededImage.includes(img.public_id));
        tour_package.set("images", oldImages);
    }
    if (images && images.length > 0) {
        const imagePath = yield Promise.all(images.map((img) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, cloudinary_utils_1.uploadFile)(img.path, tour_package_folder); })));
        tour_package.set("images", [...tour_package.images, ...imagePath]);
    }
    yield tour_package.save();
    res.status(200).json({
        message: "Tour plan updated",
        success: true,
        status: "success",
        data: tour_package,
    });
}));
// ! delete tour package
exports.remove = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const tour_package = yield tour_packages_models_1.default.findById(id);
    if (!tour_package) {
        throw new error_handler_middleware_1.default("Package not found", 404);
    }
    if (tour_package.cover_image) {
        yield (0, cloudinary_utils_1.deleteFile)([(_a = tour_package.cover_image) === null || _a === void 0 ? void 0 : _a.public_id]);
    }
    if (tour_package.images.length > 0) {
        yield (0, cloudinary_utils_1.deleteFile)(tour_package.images.map((image) => image === null || image === void 0 ? void 0 : image.public_id));
    }
    yield tour_package.deleteOne();
    res.status(200).json({
        message: "Package deleted",
        data: tour_package,
        success: true,
        status: "success",
    });
}));
