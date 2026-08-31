
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { getEnvVariable } from "./src/helpers/database.helpers.js";
dotenv.config();


export default defineConfig({
  schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: getEnvVariable('DB_URL'),
    }
});