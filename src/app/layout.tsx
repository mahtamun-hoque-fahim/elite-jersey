import type { Metadata, Viewport } from "next";
import "@fontsource-variable/open-sans";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrderProvider } from "@/components/OrderProvider";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export const metadata: Metadata = {
  title: { default: "Elite Jersey | Premium Football Jerseys", template: "%s | Elite Jersey" },
  description: "Club, country, retro and custom football jerseys. Order directly on WhatsApp.",
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <OrderProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFab />
        </OrderProvider>
      </body>
    </html>
  );
}
