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
  themeColor: "#f8f6f3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-[100dvh] flex flex-col">
        <header className="max-w-md w-full mx-auto px-5 pt-5">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="text-sm font-semibold tracking-tight">Aesthetic Guide <span className="text-muted font-normal">NYC & Miami</span></Link>
            <span className="flex gap-3 text-xs text-muted">
              <Link href="/procedures" className="hover:text-ink">All procedures</Link>
              <Link href="/compare" className="hover:text-ink">Compare</Link>
            </span>
          </div>
        </header>
        <main className="flex-1 w-full max-w-md mx-auto px-5 py-6 flex flex-col">{children}</main>
        <Footer />
        <DisclaimerModal />
        <PwaSupport />
      </body>
    </html>
  );
}
