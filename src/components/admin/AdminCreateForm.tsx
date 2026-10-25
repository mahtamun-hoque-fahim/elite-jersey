"use client";

import { useEffect, useRef } from "react";
import { useActionForm } from "@/lib/use-action-form";
import { createAdmin } from "@/app/admin/actions";
import { Field, inputCls } from "@/components/FormField";

export function AdminCreateForm() {
  const { state, onSubmit, pending } = useActionForm(createAdmin);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} onSubmit={onSubmit} className="space-y-4 rounded-xl border border-line bg-white p-5">
      <h2 className="font-display text-base font-semibold">Add an admin</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Name" htmlFor="a-name"><input id="a-name" name="name" required className={inputCls} /></Field>
        <Field label="Email" htmlFor="a-email"><input id="a-email" name="email" type="email" required className={inputCls} /></Field>
        <Field label="Password" htmlFor="a-pass" hint="At least 10 characters"><input id="a-pass" name="password" type="password" required minLength={10} autoComplete="new-password" className={inputCls} /></Field>
      </div>
      {state?.error && <p role="alert" className="text-sm font-medium text-red-600">{state.error}</p>}
      {state?.ok && <p role="status" className="text-sm font-medium text-brand">Admin created. Share the password with them privately.</p>}
      <button type="submit" disabled={pending} className="h-11 rounded-xl bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
        {pending ? "Creating..." : "Create admin"}
      </button>
    </form>
  );
}
