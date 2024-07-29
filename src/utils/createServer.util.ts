import { Express } from "express";
import fs from "fs";
import https from "https";
import http from "http";
import { getHttpPort, getHttpsPort } from "../configs/server.config";

export function createServer(app: Express) {
    http.createServer(app).listen(getHttpPort(), () => {
        console.log(`Http Server is running on port ${getHttpPort()}`);
    });
    if (getHttpsPort()) {
        if (!fs.existsSync('/keys/key.pem') || !fs.existsSync('/keys/cert.pem') || !fs.existsSync('/keys/ca.pem')) {
            console.log("Https Keys are not present. Https Server will not run.");
        } else {
            var options = {
                key: fs.readFileSync('/keys/key.pem'),
                cert: fs.readFileSync('/keys/cert.pem'),
                ca: fs.readFileSync('/keys/ca.pem')
            };
            try {
                https.createServer(options, app).listen(getHttpsPort(), () => {
                    console.log(`Https Server is running on port ${getHttpsPort()}`);
                });
            } catch (err) {
                console.log("Https Server will not run.");
                console.log((err instanceof Error) ? err.stack : "Error: " + err);
            }
        }
    }
}