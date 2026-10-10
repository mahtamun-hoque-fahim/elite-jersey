import type { Metadata } from "next";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[1fr_20rem]">
      <div>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Contact us</h1>
        <p className="mb-6 mt-2 text-muted">Questions about a jersey, size or delivery? Send us a message.</p>
        <ContactForm />
      </div>
      <aside className="h-fit space-y-4 rounded-2xl border border-line bg-white p-5 text-sm">
        <h2 className="font-display text-base font-semibold">Reach us directly</h2>
        <a href={waLink("Hi Elite Jersey!")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-semibold text-brand hover:underline">
          <MessageCircle className="size-4" /> Chat on WhatsApp
        </a>
        {site.phone && <p className="flex gap-2 text-muted"><Phone className="mt-0.5 size-4" />{site.phone}</p>}
        {site.address && <p className="flex gap-2 text-muted"><MapPin className="mt-0.5 size-4 shrink-0" />{site.address}</p>}
      </aside>
    </div>
  );
}
