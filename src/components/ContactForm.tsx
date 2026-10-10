"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Field, inputCls, textareaCls } from "./FormField";
import { waLink } from "@/lib/site";

export function ContactForm() {
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    if (!get("name") || !get("message")) {
      setError("Please add your name and a message.");
      return;
    }
    setError("");
    window.open(waLink(`Message from ${get("name")}${get("phone") ? ` (${get("phone")})` : ""}\n\n${get("message")}`), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name"><input id="name" name="name" required autoComplete="name" className={inputCls} /></Field>
        <Field label="Phone (optional)" htmlFor="phone"><input id="phone" name="phone" type="tel" autoComplete="tel" className={inputCls} /></Field>
      </div>
      <Field label="Message" htmlFor="message"><textarea id="message" name="message" rows={5} required className={textareaCls} /></Field>
      {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
      <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-white transition-colors hover:bg-brand-dark sm:w-auto sm:px-8">
        <MessageCircle className="size-5" />
        Send on WhatsApp
      </button>
    </form>
  );
}
