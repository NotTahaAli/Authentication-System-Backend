"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const server_config_1 = require("../configs/server.config");
function createServer(app) {
    http_1.default.createServer(app).listen((0, server_config_1.getHttpPort)(), () => {
        console.log(`Http Server is running on port ${(0, server_config_1.getHttpPort)()}`);
    });
    if ((0, server_config_1.getHttpsPort)()) {
        if (!fs_1.default.existsSync('./keys/key.pem') || !fs_1.default.existsSync('./keys/cert.pem') || !fs_1.default.existsSync('./keys/ca.pem')) {
            console.log("Https Keys are not present. Https Server will not run.");
        }
        else {
            var options = {
                key: fs_1.default.readFileSync('./keys/key.pem'),
                cert: fs_1.default.readFileSync('./keys/cert.pem'),
                ca: fs_1.default.readFileSync('./keys/ca.pem')
            };
            try {
                https_1.default.createServer(options, app).listen((0, server_config_1.getHttpsPort)(), () => {
                    console.log(`Https Server is running on port ${(0, server_config_1.getHttpsPort)()}`);
                });
            }
            catch (err) {
                console.log("Https Server will not run.");
                console.log((err instanceof Error) ? err.stack : "Error: " + err);
            }
        }
    }
}
