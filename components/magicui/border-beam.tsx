import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 8,
  colorFrom = "#2563EB",
  colorTo = "#9b59b6",
  borderWidth = 1.5,
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--border-width": borderWidth,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        "[background:linear-gradient(transparent,transparent),linear-gradient(var(--color-from),var(--color-to))] [background-clip:padding-box,border-box] [background-origin:border-box]",
        "[mask-clip:padding-box,border-box]",
        "animate-border-beam",
        className
      )}
    />
  );
}
