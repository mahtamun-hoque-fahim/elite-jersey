import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Logo } from "@/components/Logo";
import { SetupForm } from "@/components/admin/SetupForm";
import { getDb } from "@/lib/db";
import { adminCount } from "@/lib/data/submissions";
import { AUTH_ENV, missingEnv, missingMessage } from "@/lib/env";

export const metadata: Metadata = { title: "First admin setup" };

export default async function SetupPage() {
  await connection();
  const missing = missingEnv([...AUTH_ENV, "ADMIN_SETUP_KEY"]);
  if (getDb() && (await adminCount()) > 0) redirect("/admin/login");
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-line bg-white p-6 sm:p-8">
        <div className="text-center">
          <Logo />
          <h1 className="mt-4 font-display text-xl font-semibold">Create the first admin</h1>
          <p className="mt-1 text-sm text-muted">Works once, and needs the setup key from your environment variables.</p>
        </div>
        {missing.length > 0 && <p className="rounded-lg bg-brand-tint p-3 text-sm text-muted">{missingMessage(missing)}</p>}
        <SetupForm />
      </div>
    </div>
  );
}
