import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { Footer } from "@/components/Footer";
import { PwaSupport } from "@/components/PwaSupport";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aesthetic Guide NYC & Miami",
  description: "Educational guide to aesthetic procedures, costs and qualified providers in New York City and Miami. Not medical advice.",
  applicationName: "Aesthetic Guide",
  appleWebApp: { capable: true, title: "Aesthetic Guide", statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#171717",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-neutral-200">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
            <Link href="/" className="font-semibold tracking-tight">Aesthetic Guide <span className="text-neutral-400 font-normal">NYC & Miami</span></Link>
            <span className="text-[11px] uppercase tracking-wider rounded-full border border-neutral-300 px-2 py-0.5 text-neutral-500 shrink-0">Educational</span>
          </div>
        </header>
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">{children}</main>
        <Footer />
        <DisclaimerModal />
        <PwaSupport />
      </body>
    </html>
  );
}
