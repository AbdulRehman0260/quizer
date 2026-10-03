import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import {migrate} from "drizzle-orm/postgres-js/migrator";

const databaseUrl = process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/questions";

const migrationClient = postgres(databaseUrl,{max: 1});
await migrate(drizzle(migrationClient), { migrationsFolder: './src/db/migrations' });

const client = postgres(databaseUrl);
export const db = drizzle(client, { schema: schema });