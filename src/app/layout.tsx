import type { Metadata, Viewport } from "next";
import "@fontsource-variable/open-sans";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource-variable/noto-sans-bengali";
import "./globals.css";
import { I18nProvider } from "@/i18n/client";
import { dictionaries } from "@/i18n/dictionaries";
import { getLang } from "@/i18n/server";

export const metadata: Metadata = {
  title: { default: "Elite Jersey | Premium Football Jerseys", template: "%s | Elite Jersey" },
  description: "Club, country, retro and custom football jerseys. Order directly on WhatsApp.",
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await getLang();
  return (
    <html lang={lang}>
      <body className="flex min-h-screen flex-col">
        <I18nProvider lang={lang} dict={dictionaries[lang]}>{children}</I18nProvider>
      </body>
    </html>
  );
}
