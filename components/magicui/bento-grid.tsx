import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps {
  name?: string;
  className?: string;
  background?: ReactNode;
  Icon?: React.ElementType;
  description?: string;
  href?: string;
  cta?: string;
  children?: ReactNode;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn("grid w-full auto-rows-[22rem] grid-cols-3 gap-4", className)}>
      {children}
    </div>
  );
}

export function BentoCard({ name, className, background, Icon, description, children }: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
        "bg-card border border-border text-card-foreground",
        "transform-gpu transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary/30",
        className
      )}
    >
      <div>{background}</div>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300">
        {Icon && (
          <Icon className="h-12 w-12 origin-left transform-gpu text-muted-foreground transition-all duration-300 ease-in-out group-hover:text-primary" />
        )}
        {name && <h3 className="text-xl font-semibold text-foreground">{name}</h3>}
        {description && <p className="max-w-lg text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
