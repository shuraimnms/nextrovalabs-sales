import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/shared/theme-provider";

export const metadata: Metadata = {
  title: { default: "Nextrova Sales OS", template: "%s · Nextrova Sales OS" },
  description: "Private sales training and call-support platform for Nextrova Labs employees.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#090b1f" }, { media: "(prefers-color-scheme: light)", color: "#f7f7fb" }] };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">Skip to content</a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
