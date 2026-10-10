"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Field, inputCls, textareaCls } from "./FormField";
import { waLink } from "@/lib/site";

export function CustomOrderForm() {
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    if (!get("team") || !get("contact") || !get("phone") || !get("quantity")) {
      setError("Please fill in team name, contact person, phone and quantity.");
      return;
    }
    setError("");
    const text = [
      "Custom jersey request",
      `Team: ${get("team")}`,
      `Contact: ${get("contact")} (${get("phone")})`,
      `Quantity: ${get("quantity")}`,
      `Style: ${get("style") || "-"}`,
      `Sizes: ${get("sizes") || "-"}`,
      `Deadline: ${get("deadline") || "-"}`,
      `Notes: ${get("notes") || "-"}`,
    ].join("\n");
    window.open(waLink(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
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
      {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
      <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-white transition-colors hover:bg-brand-dark sm:w-auto sm:px-8">
        <MessageCircle className="size-5" />
        Send request on WhatsApp
      </button>
    </form>
  );
}
