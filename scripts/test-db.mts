// Database logic test against an in-memory Postgres (PGlite). Run: npm run test:db
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { readFileSync } from "node:fs";
import * as schema from "@/lib/db/schema";
import * as q from "@/lib/data/queries";
import { jerseySchema } from "@/lib/validation/schemas";

const c = new PGlite();
for (const s of readFileSync("drizzle/0000_init.sql", "utf8").split("--> statement-breakpoint")) if (s.trim()) await c.exec(s);
await c.exec(readFileSync("drizzle/seed.sql", "utf8"));
const db = drizzle(c, { schema }) as unknown as q.AnyDb;
const ok = (n: string, v: boolean) => {
  console.log(v ? "PASS" : "FAIL", n);
  if (!v) process.exitCode = 1;
};

let cat = await q.fetchCatalog(db);
ok("catalog 3 types in order Club,Country,Special", cat.map((t) => t.name).join() === "Club,Country,Special");
ok("club has 17 entries, default 6 sizes", cat[0].groups.length === 17 && cat[0].groups[0].sizes.length === 6);

// create type + entry with limited sizes
const t = await q.createType(db, "Replica"); ok("create type", t.ok);
await q.createType(db, "Replica"); cat = await q.fetchCatalog(db);
ok("duplicate name gets unique slug", cat.map((x) => x.slug).includes("replica-2"));
const typeId = t.ok ? t.id! : "";
const g = await q.createGroup(db, typeId, "Retro Replica", ["M", "L", "XXL"]); ok("create entry", g.ok);
cat = await q.fetchCatalog(db);
ok("entry sizes cleaned to valid sizes only", JSON.stringify(cat.find((x) => x.slug === "replica")!.groups[0].sizes) === '["M","L"]');
ok("bad name rejected", !(await q.createType(db, "x")).ok);
ok("no sizes rejected", !(await q.createGroup(db, typeId, "Empty", [])).ok);

// jerseys: inherit vs override
const rm = cat[0].groups[0];
await c.exec(`insert into jerseys (slug,name,group_id,season,price) values ('a','A','${rm.id}','26/27',990)`);
await c.exec(`insert into jerseys (slug,name,group_id,season,price,sizes) values ('b','B','${rm.id}','26/27',990,ARRAY['XL']::text[])`);
await q.updateGroup(db, rm.id, "Real Madrid", ["S", "M"]);
const js = await q.fetchJerseys(db);
const a = js.find((j) => j.slug === "a")!, b = js.find((j) => j.slug === "b")!;
ok("jersey without own sizes inherits entry sizes (S,M)", a.sizes.join() === "S,M" && a.sizesOverride === null);
ok("jersey with own sizes keeps them (XL)", b.sizes.join() === "XL" && b.sizesOverride?.join() === "XL");
ok("join gives type + entry names", a.typeName === "Club" && a.groupName === "Real Madrid" && a.typeSlug === "club");
ok("fetch by slug and id", (await q.fetchJerseyBy(db, { slug: "a" }))?.name === "A" && (await q.fetchJerseyBy(db, { id: b.id }))?.slug === "b");

// guarded deletes
const d1 = await q.deleteGroup(db, rm.id); ok("delete entry with jerseys blocked: " + (d1.ok ? "" : d1.error), !d1.ok);
const d2 = await q.deleteType(db, cat[0].id); ok("delete type with jerseys blocked: " + (d2.ok ? "" : d2.error), !d2.ok);
ok("delete empty entry", (await q.deleteGroup(db, g.ok ? g.id! : "")).ok);
ok("delete empty type", (await q.deleteType(db, typeId)).ok);

// reorder
await q.moveType(db, cat[2].id, "up"); cat = await q.fetchCatalog(db);
ok("move Special up -> Club,Special,Country", cat.slice(0, 3).map((x) => x.name).join() === "Club,Special,Country");
await q.moveType(db, cat[0].id, "up"); cat = await q.fetchCatalog(db);
ok("moving first item up is a no-op", cat[0].name === "Club");
const first = cat[0].groups[0], second = cat[0].groups[1];
await q.moveGroup(db, second.id, "up"); cat = await q.fetchCatalog(db);
ok("move entry up swaps order", cat[0].groups[0].id === second.id && cat[0].groups[1].id === first.id);
await q.renameType(db, cat[1].id, "Specials"); cat = await q.fetchCatalog(db);
ok("rename keeps slug", cat[1].name === "Specials" && cat[1].slug === "special");

// Facebook post link: stored, mapped, and validated
await c.exec(`insert into jerseys (slug,name,group_id,season,price,fb_post_url) values ('c','C','${rm.id}','26/27',990,'https://www.facebook.com/page/posts/123')`);
const withPost = await q.fetchJerseyBy(db, { slug: "c" });
ok("fb post url stored and returned", withPost?.fbPostUrl === "https://www.facebook.com/page/posts/123");
ok("jersey without a post link has none", (await q.fetchJerseyBy(db, { slug: "a" }))?.fbPostUrl === undefined);

const base = { name: "Test Jersey", groupId: "11111111-1111-4111-8111-111111111111", season: "26/27", version: "Player", price: "990", oldPrice: "", sizes: [], inStock: true, isNew: false, imageUrl: "", description: "" };
const tryUrl = (u: string) => jerseySchema.safeParse({ ...base, fbPostUrl: u });
ok("valid facebook.com link accepted", tryUrl("https://www.facebook.com/x/posts/1").success);
ok("m.facebook.com and fb.watch accepted", tryUrl("https://m.facebook.com/p/1").success && tryUrl("https://fb.watch/abc").success);
ok("empty link becomes null", (() => { const r = tryUrl(""); return r.success && r.data.fbPostUrl === null; })());
ok("http link rejected", !tryUrl("http://facebook.com/x").success);
ok("other site rejected", !tryUrl("https://example.com/facebook.com").success && !tryUrl("https://facebook.com.evil.com/x").success);
ok("javascript: link rejected", !tryUrl("javascript:alert(1)").success);

const failed = process.exitCode;
if (!failed) console.log("done");
