"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dict, Lang } from "./dictionaries";

const I18nContext = createContext<{ lang: Lang; t: Dict } | null>(null);

export function I18nProvider({ lang, dict, children }: { lang: Lang; dict: Dict; children: ReactNode }) {
  return <I18nContext.Provider value={{ lang, t: dict }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
