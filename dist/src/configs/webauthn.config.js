"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRPOrigin = void 0;
exports.getRPName = getRPName;
exports.getRPId = getRPId;
function getRPName() {
    if (!process.env.RP_NAME) {
        throw new Error("RP Name Not Configured.");
    }
    return process.env.RP_NAME;
}
function getRPId() {
    if (!process.env.RP_ID) {
        throw new Error("RP Id Not Configured.");
    }
    return process.env.RP_ID;
}
const getRPOrigin = () => {
    if (!process.env.RP_ORIGIN) {
        throw new Error("RP Origin Not Configured.");
    }
    if (!process.env.RP_ORIGIN.match(/^https?:\/\/[^:]+(:\d+)$/i)) {
        throw new Error("Invalid RP Origin");
    }
    return process.env.RP_ORIGIN;
};
exports.getRPOrigin = getRPOrigin;
exports.default = {
    rpName: getRPName(),
    rpId: getRPId(),
    rpOrigin: (0, exports.getRPOrigin)()
};
