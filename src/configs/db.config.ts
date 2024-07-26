import { config } from "dotenv";
config();

export const getPostgresURL = ()=>{
    if (!process.env.POSTGRES_URL) {
        throw new Error("Database Credentials Not Configured.");
    }
    if (!process.env.POSTGRES_URL.match(/^postgres:\/\/[^:]+:.+@.+(\/.*)?/i)) {
        throw new Error("Invalid Postgres URL");
    }
    return process.env.POSTGRES_URL;
}

getPostgresURL();

export default {
    getPostgresURL
}