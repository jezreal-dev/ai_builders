import "server-only";
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

const authDb = new Database(process.env.DATABASE_URL ?? "./taskflow.db");
authDb.pragma("foreign_keys = ON");

export const auth = betterAuth({
  database: authDb,
  secret: process.env.BETTER_AUTH_SECRET ?? "dev-secret-change-in-production-min-32-chars",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: process.env.GOOGLE_CLIENT_ID
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        },
      }
    : {},
  user: {
    additionalFields: {
      timezone: {
        type: "string",
        required: false,
        defaultValue: "UTC",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
