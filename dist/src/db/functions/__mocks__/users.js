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
Object.defineProperty(exports, "__esModule", { value: true });
const mockedUsers = jest.createMockFromModule("../users");
function getUserDataFromId(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (user_id == 1) {
            return { username: "abc", email: "abc@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 1, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset() + 1) * 60000), twoFactor: false };
        }
        if (user_id == 2) {
            return { username: "abc2", email: "abc2@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 2, lastChanged: new Date(2020, 11, 10), twoFactor: true };
        }
        if (user_id == 3) {
            return { username: "abc3", email: "abc3@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 3, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset() + 1) * 60000), twoFactor: false };
        }
        if (user_id == 5) {
            return { username: "abc5", email: "abc5@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: false, id: 5, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset() + 1) * 60000), twoFactor: false };
        }
        return null;
    });
}
function getUserDataFromUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        if (username == "abc") {
            return { username: "abc", email: "abc@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 1, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset() + 1) * 60000), twoFactor: false };
        }
        if (username == "abc2") {
            return { username: "abc2", email: "abc2@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 2, lastChanged: new Date(2020, 11, 10), twoFactor: true };
        }
        if (username == "abc3") {
            return { username: "abc3", email: "abc3@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 3, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset() + 1) * 60000), twoFactor: false };
        }
        if (username == "abc5") {
            return { username: "abc5", email: "abc5@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: false, id: 5, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset() + 1) * 60000), twoFactor: false };
        }
        return null;
    });
}
function getUserDataFromEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (email == "abc@gmail.com") {
            return { username: "abc", email: "abc@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 1, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset() + 1) * 60000), twoFactor: false };
        }
        if (email == "abc2@gmail.com") {
            return { username: "abc2", email: "abc2@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 2, lastChanged: new Date(2020, 11, 10), twoFactor: true };
        }
        if (email == "abc3@gmail.com") {
            return { username: "abc3", email: "abc3@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: false, id: 3, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset() + 1) * 60000), twoFactor: false };
        }
        if (email == "abc5@gmail.com") {
            return { username: "abc5", email: "abc5@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: false, id: 5, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset() + 1) * 60000), twoFactor: false };
        }
        return null;
    });
}
function setEmailVerified(email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield getUserDataFromEmail(email)))
            return false;
        return true;
    });
}
function addUser(username, email, passwordHash, verified) {
    return __awaiter(this, void 0, void 0, function* () {
        if (username == "abc1")
            return 4;
        return 1;
    });
}
function changePassword(user_id, passwordHash) {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}
function setTwoFactorEnabled(user_id, twoFactor) {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}
mockedUsers.changePassword = jest.fn(changePassword);
mockedUsers.addUser = jest.fn(addUser);
mockedUsers.setEmailVerified = jest.fn(setEmailVerified);
mockedUsers.getUserDataFromEmail = jest.fn(getUserDataFromEmail);
mockedUsers.getUserDataFromId = jest.fn(getUserDataFromId);
mockedUsers.getUserDataFromUsername = jest.fn(getUserDataFromUsername);
mockedUsers.setTwoFactorEnabled = jest.fn(setTwoFactorEnabled);
exports.default = mockedUsers;
