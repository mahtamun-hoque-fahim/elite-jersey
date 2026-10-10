import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const getSession = cache(async () => {
  const h = await headers(); // also marks the page dynamic, so it is never prerendered
  if (!getDb()) return null;
  return auth.api.getSession({ headers: h });
});

/** Every account in this app is an admin. Public sign-up is blocked in the auth route. */
export const requireAdmin = cache(async () => {
  const session = await getSession();
  if (!session?.user) redirect("/admin/login");
  return session;
});
