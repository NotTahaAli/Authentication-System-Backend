import { getHttpPort } from "./server.config";

export function getRPName()
{
    if (!process.env.RP_NAME) {
        throw new Error("RP Name Not Configured.");
    }
    return process.env.RP_NAME;
}

export function getRPId()
{
    if (!process.env.RP_ID) {
        throw new Error("RP Id Not Configured.");
    }
    return process.env.RP_ID;
}

export const getRPOrigin = ()=>{
    if (!process.env.RP_ORIGIN) {
        throw new Error("RP Origin Not Configured.");
    }
    if (!process.env.RP_ORIGIN.match(/^https?:\/\/[^:]+(:\d+)$/i)) {
        throw new Error("Invalid RP Origin");
    }
    return process.env.RP_ORIGIN;
}

export default {
    rpName: getRPName(),
    rpId: getRPId(),
    rpOrigin: getRPOrigin()
}