import type { ReactNode } from "react";

export function Field({ label, htmlFor, children, hint }: { label: string; htmlFor: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export const inputCls =
  "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
export const textareaCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
