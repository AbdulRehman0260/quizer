import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { getEnvVariable } from "../helpers/database.helpers.js";
import {migrate} from "drizzle-orm/postgres-js/migrator";
import dotenv from "dotenv";
dotenv.config();

const migrationClient = postgres(getEnvVariable('DB_URL'),{max: 1});
await migrate(drizzle(migrationClient), { migrationsFolder: './src/db/migrations' });

const client = postgres(getEnvVariable('DB_URL'));
export const db = drizzle(client, { schema: schema });