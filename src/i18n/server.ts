import "server-only";
import { cookies, headers } from "next/headers";
import { dictionaries, type Lang } from "./dictionaries";

/** Cookie first, then the browser language, then English. */
export async function getLang(): Promise<Lang> {
  const saved = (await cookies()).get("lang")?.value;
  if (saved === "bn" || saved === "en") return saved;
  const accept = (await headers()).get("accept-language") ?? "";
  return /^\s*bn\b/i.test(accept) ? "bn" : "en";
}

export async function getT() {
  const lang = await getLang();
  return { lang, t: dictionaries[lang] };
}
