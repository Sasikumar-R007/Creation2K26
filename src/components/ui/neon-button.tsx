import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const neonButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        cyan: [
          "bg-primary text-primary-foreground",
          "hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.4),0_0_25px_hsl(var(--neon-cyan)/0.25),inset_0_0_10px_hsl(var(--neon-cyan)/0.15)]",
          "hover:scale-105 hover:-translate-y-0.5",
          "active:scale-102 active:translate-y-0",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
          "after:absolute after:inset-0 after:border-2 after:border-primary/50 after:rounded-lg after:opacity-0 hover:after:opacity-100 hover:after:animate-ping",
        ],
        purple: [
          "bg-secondary text-secondary-foreground",
          "hover:shadow-[0_0_25px_hsl(var(--neon-purple)/0.7),0_0_50px_hsl(var(--neon-purple)/0.4),inset_0_0_15px_hsl(var(--neon-purple)/0.2)]",
          "hover:scale-105 hover:-translate-y-0.5",
          "active:scale-102 active:translate-y-0",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
          "after:absolute after:inset-0 after:border-2 after:border-secondary/50 after:rounded-lg after:opacity-0 hover:after:opacity-100 hover:after:animate-ping",
        ],
        gold: [
          "bg-accent text-accent-foreground",
          "hover:shadow-[0_0_25px_hsl(var(--neon-gold)/0.7),0_0_50px_hsl(var(--neon-gold)/0.4),inset_0_0_15px_hsl(var(--neon-gold)/0.2)]",
          "hover:scale-105 hover:-translate-y-0.5",
          "active:scale-102 active:translate-y-0",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
          "after:absolute after:inset-0 after:border-2 after:border-accent/50 after:rounded-lg after:opacity-0 hover:after:opacity-100 hover:after:animate-ping",
        ],
        outline: [
          "border-2 border-primary bg-transparent text-primary relative",
          "hover:border-primary/80",
          "hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5),inset_0_0_10px_hsl(var(--neon-cyan)/0.1)]",
          "hover:scale-105 hover:-translate-y-0.5",
          "active:scale-102 active:translate-y-0",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
          "after:absolute after:inset-[-2px] after:border-2 after:border-primary/30 after:rounded-lg after:opacity-0 hover:after:opacity-100 hover:after:animate-pulse",
        ],
        ghost: [
          "bg-transparent text-foreground",
          "hover:bg-muted/50",
          "hover:text-primary",
          "hover:scale-105",
          "active:scale-100",
        ],
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "cyan",
      size: "default",
    },
  }
);

export interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neonButtonVariants> {
  asChild?: boolean;
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(neonButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
NeonButton.displayName = "NeonButton";

export { NeonButton, neonButtonVariants };
