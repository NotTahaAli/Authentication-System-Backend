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
exports.checkPasswordRequirements = checkPasswordRequirements;
exports.checkUsernameRequirements = checkUsernameRequirements;
exports.checkUsernameDoesntExist = checkUsernameDoesntExist;
const users_1 = __importDefault(require("../db/functions/users"));
function checkPasswordRequirements(password) {
    if (typeof (password) != "string")
        throw { status: 400, message: "Password is Missing or Invalid." };
    if (password.length < 8)
        throw { status: 400, message: "Length of Password can not be less than 8 characters." };
    if (!(password.match(/([A-Z])/)))
        throw { status: 400, message: "Password must contain atleast 1 uppercase letter." };
    if (!(password.match(/([a-z])/)))
        throw { status: 400, message: "Password must contain atleast 1 lowercase letter." };
    if (!(password.match(/([0-9])/)))
        throw { status: 400, message: "Password must contain atleast 1 digit." };
    if (!(password.match(/([^A-Za-z0-9])/)))
        throw { status: 400, message: "Password must contain atleast 1 special character." };
}
function checkUsernameRequirements(username) {
    if (typeof (username) != "string")
        throw { status: 400, message: "Username is Missing or Invalid." };
    if (username.length < 3)
        throw { status: 400, message: "Length of Username can not be less than 3 characters." };
}
function checkUsernameDoesntExist(username) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield users_1.default.getUserDataFromUsername(username)) {
            throw { status: 400, message: "Username already used." };
        }
    });
}
