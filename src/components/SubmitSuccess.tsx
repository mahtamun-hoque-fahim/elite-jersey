"use client";

import { CheckCircle2, MessageCircle } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { waLink } from "@/lib/site";

export function SubmitSuccess({ saved, message }: { saved: boolean; message: string }) {
  const { t } = useI18n();
  return (
    <div role="status" className="rounded-2xl border border-line bg-white p-6 text-center sm:p-8">
      <CheckCircle2 className="mx-auto size-12 text-brand" />
      <h2 className="mt-3 font-display text-xl font-semibold">{saved ? t.success.received : t.success.oneMore}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        {saved ? t.success.savedText : t.success.unsavedText}
      </p>
      <a
        href={waLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-wa px-6 font-semibold text-white transition-colors hover:bg-wa-dark"
      >
        <MessageCircle className="size-5" />
        {saved ? t.success.msgUs : t.success.cont}
      </a>
    </div>
  );
}
