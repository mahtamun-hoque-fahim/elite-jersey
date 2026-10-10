import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";
import { getT } from "@/i18n/server";

export async function WhatsAppFab() {
  const { t } = await getT();
  return (
    <a
      href={waLink("Hi Elite Jersey, I have a question.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.common.chatWhatsapp}
      className="fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-wa text-white shadow-lg transition-transform duration-200 ease-subtle hover:scale-105 hover:bg-wa-dark"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
