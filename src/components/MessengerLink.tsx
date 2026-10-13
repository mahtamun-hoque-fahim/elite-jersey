"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { orderMessage } from "@/lib/order";
import { messengerUrl } from "@/lib/site";
import { useI18n } from "@/i18n/client";
import type { Jersey } from "@/data/jerseys";

/**
 * Plain text link to the page's Messenger. Messenger cannot be prefilled from a website,
 * so clicking also copies the order message to the clipboard. Hidden until the page username is set.
 */
export function MessengerLink({ jersey, size, className }: { jersey: Jersey; size?: string; className?: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  if (!messengerUrl) return null;

  async function onClick() {
    try {
      await navigator.clipboard.writeText(orderMessage(jersey, size));
      setCopied(true);
      setTimeout(() => setCopied(false), 6000);
    } catch {
      // clipboard blocked: the link still opens Messenger
    }
  }

  return (
    <span className="block">
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={cn("text-sm font-semibold text-brand hover:underline", className)}
      >
        {t.order.viaMessenger}
      </a>
      {copied && (
        <span role="status" className="mt-1 block text-xs text-muted">
          {t.order.copied}
        </span>
      )}
    </span>
  );
}
