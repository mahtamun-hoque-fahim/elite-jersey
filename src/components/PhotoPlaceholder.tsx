import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Stands in for a jersey photo until one is uploaded from the dashboard.
 * Same box as a photo (fills its parent), so layout never shifts when a real image arrives.
 */
export function PhotoPlaceholder({
  label,
  compact,
  className,
}: {
  label: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("grid size-full place-items-center bg-linear-to-b from-white to-zinc-200/70 text-zinc-400", className)}
    >
      <div className="flex flex-col items-center gap-2 px-3 text-center">
        <span className={cn("grid place-items-center rounded-full bg-white shadow-sm ring-1 ring-line", compact ? "size-8" : "size-14")}>
          <ImageIcon className={compact ? "size-4" : "size-7"} strokeWidth={1.5} />
        </span>
        {!compact && <span className="text-xs font-medium text-muted">{label}</span>}
      </div>
    </div>
  );
}
