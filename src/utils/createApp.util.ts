import express from "express";
import helmet from "helmet";
import cors from 'cors';
import {getCorsURLS} from "../configs/server.config";
import cookieParser from "cookie-parser";

export async function createApp() {
    const app = express();
    
    // Setting up for JSON Data
    app.use(express.json({ limit: "50mb" }));
    app.use(helmet());

    // Setting up for Cookies
    app.use(cookieParser());
    
    // Setting up for URL Encoded Payloads
    app.use(
        express.urlencoded({
            limit: "50mb",
            extended: true,
            parameterLimit: 50000,
        })
    );
    
    app.use(cors({
        origin: getCorsURLS(),
        credentials: true
    }))

    return app;
}