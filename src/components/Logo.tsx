import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Elite Jersey home" className={cn("inline-block shrink-0", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="Elite Jersey" width={86} height={36} className="h-8 w-auto sm:h-9" />
    </Link>
  );
}
