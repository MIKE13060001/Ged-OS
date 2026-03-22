import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        "inline animate-animate-gradient bg-gradient-to-r from-[#9b59b6] via-[#2563EB] to-[#9b59b6] bg-[length:var(--bg-size,400%)_100%] bg-clip-text text-transparent",
        className
      )}
      style={{ "--bg-size": "400%" } as React.CSSProperties}
    >
      {children}
    </span>
  );
}
