import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { connection } from "next/server";
import { AUTH_ENV, missingEnv, missingMessage } from "@/lib/env";

export const metadata: Metadata = { title: "Admin login" };

export default async function LoginPage() {
  await connection();
  const missing = missingEnv(AUTH_ENV);
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-line bg-white p-6 sm:p-8">
        <div className="text-center">
          <Logo />
          <h1 className="mt-4 font-display text-xl font-semibold">Admin login</h1>
        </div>
        {missing.length > 0 && <p className="rounded-lg bg-brand-tint p-3 text-sm text-muted">{missingMessage(missing)}</p>}
        <LoginForm />
      </div>
    </div>
  );
}
