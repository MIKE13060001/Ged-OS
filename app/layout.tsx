import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: "GEDOS – GED Intelligente",
  description: "Gestion Électronique de Documents avec assistants IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
