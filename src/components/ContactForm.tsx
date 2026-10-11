"use client";

import { useActionState, useState } from "react";
import { Send } from "lucide-react";
import { Field, inputCls, textareaCls } from "./FormField";
import { SubmitSuccess } from "./SubmitSuccess";
import { submitContact } from "@/app/actions";
import { useI18n } from "@/i18n/client";

export function ContactForm() {
  const { t } = useI18n();
  const c = t.contactPage;
  const [message, setMessage] = useState("");
  const [state, action, pending] = useActionState(async (prev: Awaited<ReturnType<typeof submitContact>> | undefined, fd: FormData) => {
    const phone = String(fd.get("phone") ?? "").trim();
    setMessage(`Message from ${String(fd.get("name") ?? "").trim()}${phone ? ` (${phone})` : ""}\n\n${String(fd.get("message") ?? "").trim()}`);
    return submitContact(prev, fd);
  }, undefined);

  if (state?.ok) return <SubmitSuccess saved={Boolean(state.saved)} message={message} />;

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={c.name} htmlFor="name"><input id="name" name="name" required autoComplete="name" className={inputCls} /></Field>
        <Field label={c.phone} htmlFor="phone"><input id="phone" name="phone" type="tel" autoComplete="tel" className={inputCls} /></Field>
      </div>
      <Field label={c.message} htmlFor="message"><textarea id="message" name="message" rows={5} required className={textareaCls} /></Field>
      {state?.error && <p role="alert" className="text-sm font-medium text-red-600">{state.error === "busy" ? t.custom.busy : c.invalid}</p>}
      <button type="submit" disabled={pending} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto sm:px-8">
        <Send className="size-5" />
        {pending ? t.custom.sending : c.send}
      </button>
    </form>
  );
}
