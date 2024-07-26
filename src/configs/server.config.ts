import { config } from "dotenv";
config();

export const getHttpPort = () => {
    const port = parseInt(process.env.PORT || "3000");
    if (Number.isNaN(port) || port <= 0) {
        throw new Error("Http Port should be a positive Integer");
    }
    return port;
}
export const getHttpsPort = () => {
    let port = (process.env.HTTPS_PORT != undefined) ? parseInt(process.env.HTTPS_PORT) : undefined;
    if (!port || port <= 0 || Number.isNaN(port)) {
        port = undefined
    }
    return port;
}

export const getCorsURLS = () => {
    const corsURLS = (process.env.CORS_URLS) ? process.env.CORS_URLS.split(" ") : [];
    corsURLS.push("http://localhost:" + getHttpPort());
    if (getHttpsPort()) corsURLS.push("https://localhost:" + getHttpsPort());
    return corsURLS
}

export const getMainURL = ()=>{
    return (process.env.MAIN_DOMAIN) ? process.env.MAIN_DOMAIN : "http://localhost:"+getHttpPort();
}

export default {
    getHttpPort,
    getHttpsPort,
    getCorsURLS,
    getMainURL
}