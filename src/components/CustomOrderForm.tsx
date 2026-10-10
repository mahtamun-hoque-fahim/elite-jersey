"use client";

import { useActionState, useState } from "react";
import { Send } from "lucide-react";
import { Field, inputCls, textareaCls } from "./FormField";
import { SubmitSuccess } from "./SubmitSuccess";
import { submitCustomOrder } from "@/app/actions";

function buildMessage(f: FormData) {
  const get = (k: string) => String(f.get(k) ?? "").trim() || "-";
  return [
    "Custom jersey request",
    `Team: ${get("team")}`,
    `Contact: ${get("contact")} (${get("phone")})`,
    `Quantity: ${get("quantity")}`,
    `Style: ${get("style")}`,
    `Sizes: ${get("sizes")}`,
    `Deadline: ${get("deadline")}`,
    `Notes: ${get("notes")}`,
  ].join("\n");
}

export function CustomOrderForm() {
  const [message, setMessage] = useState("");
  const [state, action, pending] = useActionState(async (prev: Awaited<ReturnType<typeof submitCustomOrder>> | undefined, fd: FormData) => {
    setMessage(buildMessage(fd));
    return submitCustomOrder(prev, fd);
  }, undefined);

  if (state?.ok) return <SubmitSuccess saved={Boolean(state.saved)} message={message} />;

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Team name" htmlFor="team"><input id="team" name="team" required className={inputCls} /></Field>
        <Field label="Contact person" htmlFor="contact"><input id="contact" name="contact" required autoComplete="name" className={inputCls} /></Field>
        <Field label="Phone / WhatsApp" htmlFor="phone"><input id="phone" name="phone" type="tel" required autoComplete="tel" className={inputCls} /></Field>
        <Field label="Quantity" htmlFor="quantity"><input id="quantity" name="quantity" type="number" min={1} required className={inputCls} /></Field>
        <Field label="Jersey style" htmlFor="style">
          <select id="style" name="style" className={inputCls} defaultValue="">
            <option value="">Select a style</option>
            <option>Half sleeve</option>
            <option>Full sleeve</option>
            <option>Polo collar</option>
          </select>
        </Field>
        <Field label="Deadline" htmlFor="deadline"><input id="deadline" name="deadline" type="date" className={inputCls} /></Field>
      </div>
      <Field label="Sizes needed" htmlFor="sizes" hint="Example: 5 M, 5 L, 2 XL"><input id="sizes" name="sizes" className={inputCls} /></Field>
      <Field label="Notes" htmlFor="notes" hint="Colors, names, numbers, sponsors. You can send design files on WhatsApp."><textarea id="notes" name="notes" rows={4} className={textareaCls} /></Field>
      {state?.error && <p role="alert" className="text-sm font-medium text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto sm:px-8">
        <Send className="size-5" />
        {pending ? "Sending..." : "Send request"}
      </button>
    </form>
  );
}
