"use client";

import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { useI18n } from "@/i18n/client";

export function LangToggle() {
  const { lang, t } = useI18n();
  const router = useRouter();

  function toggle() {
    const next = lang === "en" ? "bn" : "en";
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.common.switchTo}
      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
    >
      <Languages className="size-4" />
      {t.common.toggleLabel}
    </button>
  );
}
