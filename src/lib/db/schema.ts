import { sql } from "drizzle-orm";
import { bigint, boolean, index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/* Better Auth core tables (names and columns must match Better Auth) */
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* Better Auth rate limiting (stored in the database so it works across serverless instances) */
export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

/* App tables */
export const jerseys = pgTable(
  "jerseys",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    team: text("team").notNull(),
    category: text("category").notNull(), // club | national | retro | special
    season: text("season").notNull(),
    version: text("version").notNull().default("Player"), // Player | Fan
    price: integer("price").notNull(),
    oldPrice: integer("old_price"),
    sizes: text("sizes").array().notNull().default(sql`ARRAY['S','M','L','XL','2XL','3XL']::text[]`),
    inStock: boolean("in_stock").notNull().default(true),
    isNew: boolean("is_new").notNull().default(false),
    imageUrl: text("image_url"),
    description: text("description").notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("jerseys_category_idx").on(t.category),
    index("jerseys_team_idx").on(t.team),
    index("jerseys_created_idx").on(t.createdAt),
  ],
);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    kind: text("kind").notNull(), // custom | contact
    name: text("name").notNull(),
    phone: text("phone"),
    message: text("message"),
    payload: jsonb("payload").$type<Record<string, string>>().notNull().default(sql`'{}'::jsonb`),
    status: text("status").notNull().default("new"), // new | handled
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("submissions_status_created_idx").on(t.status, t.createdAt)],
);
