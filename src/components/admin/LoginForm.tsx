"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Field, inputCls } from "@/components/FormField";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const { error } = await authClient.signIn.email({
      email: String(f.get("email") ?? ""),
      password: String(f.get("password") ?? ""),
    });
    setBusy(false);
    if (error) {
      setError("Wrong email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Email" htmlFor="email"><input id="email" name="email" type="email" required autoComplete="email" className={inputCls} /></Field>
      <Field label="Password" htmlFor="password"><input id="password" name="password" type="password" required autoComplete="current-password" className={inputCls} /></Field>
      {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-brand font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60">
        {busy ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
