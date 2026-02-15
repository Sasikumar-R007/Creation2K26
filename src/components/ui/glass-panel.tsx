import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "bordered";
  glow?: "none" | "cyan" | "purple" | "gold";
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = "default", glow = "none", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl backdrop-blur-xl border transition-all duration-500",
          // Base glass styles - cleaner, more modern
          "bg-card/40 border-border/30",
          // Variants
          variant === "hover" && "hover:bg-card/60 hover:border-border/50",
          variant === "bordered" && "border-2",
          // Glow effects - more subtle
          glow === "cyan" && "hover:shadow-[0_0_25px_hsl(var(--primary)_/_0.2)]",
          glow === "purple" && "hover:shadow-[0_0_25px_hsl(var(--secondary)_/_0.2)]",
          glow === "gold" && "hover:shadow-[0_0_25px_hsl(var(--accent)_/_0.2)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassPanel.displayName = "GlassPanel";

export { GlassPanel };
