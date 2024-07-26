import dbConfig from "../configs/db.config";

import { Pool, PoolClient } from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

let pool: Pool | null = null;
let db: NodePgDatabase<Record<string, never>> | null = null;

export async function closeDrizzleDB()
{
    if (!pool) {
        db = null;
        return;
    }
    await pool.end();
    pool = null;
    db = null;
}

export function getDrizzleDB() {
    if (pool && db) return db;
    if (!pool)
    {
        pool = new Pool({
            connectionString: dbConfig.getPostgresURL()
        });
    
        // the pool will emit an error on behalf of any idle clients it contains if a backend error or network partition happens
        pool.on('error', (err: Error, _client: PoolClient) => {
            console.error('Unexpected error on idle client', err)
            process.exit(-1)
        });
    }

    db = drizzle(pool);
    return db;
}

export async function migrateDB() {
    await migrate(getDrizzleDB(), { migrationsFolder: "drizzle" })
};

export default getDrizzleDB();