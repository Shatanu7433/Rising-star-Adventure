import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Rising Stars Adventure | Small-group trips from Nagpur",
    template: "%s | Rising Stars Adventure",
  },
  description:
    "Rising Stars Adventure plans small-group adventure trips across India with transparent pricing, expert trip captains and easy online booking. Based in Nagpur, Maharashtra.",
  openGraph: {
    title: "Rising Stars Adventure",
    description: SITE.tagline,
    images: ["/logo.png"],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070707",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavigationBar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
