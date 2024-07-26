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
exports.closeDrizzleDB = closeDrizzleDB;
exports.getDrizzleDB = getDrizzleDB;
exports.migrateDB = migrateDB;
const db_config_1 = __importDefault(require("../configs/db.config"));
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
let pool = null;
let db = null;
function closeDrizzleDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!pool) {
            db = null;
            return;
        }
        yield pool.end();
        pool = null;
        db = null;
    });
}
function getDrizzleDB() {
    if (pool && db)
        return db;
    if (!pool) {
        pool = new pg_1.Pool({
            connectionString: db_config_1.default.getPostgresURL()
        });
        // the pool will emit an error on behalf of any idle clients it contains if a backend error or network partition happens
        pool.on('error', (err, _client) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }
    db = (0, node_postgres_1.drizzle)(pool);
    return db;
}
function migrateDB() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, migrator_1.migrate)(getDrizzleDB(), { migrationsFolder: "drizzle" });
    });
}
;
exports.default = getDrizzleDB();
