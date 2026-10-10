"use client";

import { useActionState, useState } from "react";
import { Send } from "lucide-react";
import { Field, inputCls, textareaCls } from "./FormField";
import { SubmitSuccess } from "./SubmitSuccess";
import { submitCustomOrder } from "@/app/actions";
import { useI18n } from "@/i18n/client";

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
  const { t } = useI18n();
  const c = t.custom;
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
        <Field label={c.team} htmlFor="team"><input id="team" name="team" required className={inputCls} /></Field>
        <Field label={c.contact} htmlFor="contact"><input id="contact" name="contact" required autoComplete="name" className={inputCls} /></Field>
        <Field label={c.phone} htmlFor="phone"><input id="phone" name="phone" type="tel" required autoComplete="tel" className={inputCls} /></Field>
        <Field label={c.quantity} htmlFor="quantity"><input id="quantity" name="quantity" type="number" min={1} required className={inputCls} /></Field>
        <Field label={c.style} htmlFor="style">
          <select id="style" name="style" className={inputCls} defaultValue="">
            <option value="">{c.selectStyle}</option>
            <option value="Half sleeve">{c.half}</option>
            <option value="Full sleeve">{c.full}</option>
            <option value="Polo collar">{c.polo}</option>
          </select>
        </Field>
        <Field label={c.deadline} htmlFor="deadline"><input id="deadline" name="deadline" type="date" className={inputCls} /></Field>
      </div>
      <Field label={c.sizes} htmlFor="sizes" hint={c.sizesHint}><input id="sizes" name="sizes" className={inputCls} /></Field>
      <Field label={c.notes} htmlFor="notes" hint={c.notesHint}><textarea id="notes" name="notes" rows={4} className={textareaCls} /></Field>
      {state?.error && <p role="alert" className="text-sm font-medium text-red-600">{c.invalid}</p>}
      <button type="submit" disabled={pending} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto sm:px-8">
        <Send className="size-5" />
        {pending ? c.sending : c.send}
      </button>
    </form>
  );
}
