"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking_Status = exports.Package_Charge = exports.Role = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["NOTPREFER"] = "NOTPREFER";
})(Gender || (exports.Gender = Gender = {}));
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var Package_Charge;
(function (Package_Charge) {
    Package_Charge["PER_DAY"] = "PER_DAY";
    Package_Charge["PER_PERSON"] = "PER_PERSON";
})(Package_Charge || (exports.Package_Charge = Package_Charge = {}));
var Booking_Status;
(function (Booking_Status) {
    Booking_Status["PENDING"] = "PENDING";
    Booking_Status["CONFIRMED"] = "CONFIRMED";
    Booking_Status["COMPLETED"] = "COMPLETED";
    Booking_Status["CANCELED"] = "CANCELED";
})(Booking_Status || (exports.Booking_Status = Booking_Status = {}));
