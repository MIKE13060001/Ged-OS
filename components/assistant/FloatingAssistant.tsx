"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ChatInterface } from "@/components/assistant/ChatInterface";

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ShimmerButton
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-2xl p-0 shadow-2xl shadow-primary/40"
        aria-label="Ouvrir l'assistant IA"
      >
        <Sparkles size={24} />
      </ShimmerButton>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b border-border shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Sparkles size={14} className="text-primary" />
              </span>
              Assistant GEDOS
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
