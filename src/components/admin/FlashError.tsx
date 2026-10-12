import { CircleAlert } from "lucide-react";

export function FlashError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      {message.slice(0, 200)}
    </p>
  );
}
