import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb, getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";

// Better Auth never queries during the build; the placeholder keeps the build working without env vars.
const db = getDb() ?? createDb("postgresql://placeholder:placeholder@localhost.invalid/placeholder");

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, // creating an admin must never swap the current admin's session
    minPasswordLength: 10,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
});
