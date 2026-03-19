"use client";

import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  children?: React.ReactNode;
  className?: string;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "12px",
      background = "rgba(37, 99, 235, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white",
          "[background:var(--bg)] [border-radius:var(--radius)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          "after:animate-shimmer after:absolute after:inset-0 after:rounded-[inherit] after:[background:linear-gradient(var(--spread),transparent_var(--cut),var(--shimmer-color)_50%,transparent_calc(100%-var(--cut)),transparent)]",
          "after:[background-size:var(--shimmer-width,200px)_100%]",
          "hover:scale-[1.02]",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
        <div
          className={cn(
            "absolute bottom-0 left-1/2 h-1/3 w-3/5 -translate-x-1/2 rounded-full blur-md",
            "bg-primary opacity-50 group-hover:opacity-80 transition-opacity duration-500"
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
