"use client";

import { useActionForm } from "@/lib/use-action-form";
import { setupFirstAdmin } from "@/app/admin/actions";
import { Field, inputCls } from "@/components/FormField";

export function SetupForm() {
  const { state, onSubmit, pending } = useActionForm(setupFirstAdmin);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Setup key" htmlFor="setupKey"><input id="setupKey" name="setupKey" type="password" required autoComplete="off" className={inputCls} /></Field>
      <Field label="Name" htmlFor="name"><input id="name" name="name" required autoComplete="name" className={inputCls} /></Field>
      <Field label="Email" htmlFor="email"><input id="email" name="email" type="email" required autoComplete="email" className={inputCls} /></Field>
      <Field label="Password" htmlFor="password" hint="At least 10 characters"><input id="password" name="password" type="password" required minLength={10} autoComplete="new-password" className={inputCls} /></Field>
      {state?.error && <p role="alert" className="text-sm font-medium text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="h-12 w-full rounded-xl bg-brand font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60">
        {pending ? "Creating..." : "Create admin"}
      </button>
    </form>
  );
}
