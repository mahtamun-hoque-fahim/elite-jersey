// Browser-only helpers for the order flow. Import from client components only.
import { img, money, type Jersey } from "@/data/jerseys";

/** The message sent on WhatsApp or pasted into Messenger. Stays in English so the owner reads one format. */
export function orderMessage(jersey: Jersey, size?: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return [
    "Hi Elite Jersey, I want to order this jersey.",
    "",
    jersey.name,
    `Size: ${size || "(please confirm)"}`,
    `Price: ${money(jersey.price)}`,
    `Link: ${origin}/jersey/${jersey.slug}`,
    ...(jersey.image ? ["", "I have attached the photo."] : []),
  ].join("\n");
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Saves the jersey photo to the device. Returns false when the jersey has no photo. */
export async function downloadPhoto(jersey: Jersey): Promise<boolean> {
  if (!jersey.image) return false;
  const res = await fetch(img(jersey.image, "f_jpg,q_90,w_1200") ?? jersey.image);
  const blob = await res.blob();
  const ext = blob.type.split("/")[1]?.replace("jpeg", "jpg").replace("svg+xml", "svg") || "jpg";
  saveBlob(blob, `${jersey.slug}.${ext}`);
  return true;
}
