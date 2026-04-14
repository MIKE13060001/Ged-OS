"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChatInterface } from "@/components/assistant/ChatInterface";

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Ouvrir l'assistant IA"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95"
        style={{
          background: "hsl(240 16% 8%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        <img src="/dos-logo.png" alt="Documents Office Solutions" className="w-9 h-9 object-contain" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b border-border shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center overflow-hidden">
                <img src="/dos-logo.png" alt="DOS" className="w-5 h-5 object-contain" />
              </span>
              Assistant Documents Office Solutions
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            <ChatInterface compact />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
