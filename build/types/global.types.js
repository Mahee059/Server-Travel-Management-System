"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLUserAndAdmins = exports.AllAdmins = exports.onlyAdmin = exports.OnlySuperAdmin = exports.OnlyUser = void 0;
const enum_types_1 = require("./enum.types");
exports.OnlyUser = [enum_types_1.Role.USER];
exports.OnlySuperAdmin = [enum_types_1.Role.SUPER_ADMIN];
exports.onlyAdmin = [enum_types_1.Role.SUPER_ADMIN];
exports.AllAdmins = [enum_types_1.Role.SUPER_ADMIN, enum_types_1.Role.ADMIN];
exports.ALLUserAndAdmins = [enum_types_1.Role.SUPER_ADMIN, enum_types_1.Role.ADMIN, enum_types_1.Role.USER];
