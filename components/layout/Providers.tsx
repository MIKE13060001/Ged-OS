"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SupabaseAuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(222.2 84% 4.9%)",
              border: "1px solid hsl(217.2 32.6% 17.5%)",
              color: "hsl(210 40% 98%)",
            },
          }}
        />
      </ThemeProvider>
    </SupabaseAuthProvider>
  );
}
