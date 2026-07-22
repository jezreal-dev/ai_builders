import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";

const url = process.env.DATABASE_URL ?? "./taskflow.db";
const sqlite = new Database(url);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite, { schema });
migrate(db, { migrationsFolder: "./drizzle" });
console.log("Migrations applied successfully.");
