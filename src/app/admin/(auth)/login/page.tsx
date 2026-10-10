import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { connection } from "next/server";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "Admin login" };

export default async function LoginPage() {
  await connection();
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-line bg-white p-6 sm:p-8">
        <div className="text-center">
          <Logo />
          <h1 className="mt-4 font-display text-xl font-semibold">Admin login</h1>
        </div>
        {!getDb() && (
          <p className="rounded-lg bg-brand-tint p-3 text-sm text-muted">The database is not connected yet. Add DATABASE_URL to enable login.</p>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
