"use client";
import { ThemeProvider as NextThemes } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </NextThemes>
  );
}
