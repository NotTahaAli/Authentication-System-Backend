"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendResponse;
function sendResponse(res, status, response) {
    let success = (status == 200);
    return res.status(status).json({ success: success, message: success ? response : undefined, error: success ? undefined : response });
}
;
