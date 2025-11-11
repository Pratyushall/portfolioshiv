// components/ui/button.tsx
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  // Base
  "inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-black text-white hover:bg-black/90 border-transparent dark:bg-white dark:text-black dark:hover:bg-white/90",
        secondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border-transparent dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
        outline:
          "bg-transparent text-zinc-900 border-zinc-300 hover:bg-zinc-50 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800/40",
        ghost:
          "bg-transparent text-zinc-900 hover:bg-zinc-100 border-transparent dark:text-zinc-100 dark:hover:bg-zinc-800/50",
        destructive:
          "bg-red-600 text-white hover:bg-red-600/90 border-transparent",
        link: "bg-transparent border-transparent text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm rounded-lg",
        lg: "h-11 px-5 text-base rounded-xl",
        icon: "h-10 w-10 p-0",
      },
      elevation: {
        none: "",
        sm: "shadow-sm",
        md: "shadow",
      },
      isLoading: {
        true: "cursor-progress",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      elevation: "none",
      isLoading: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      elevation,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            size,
            elevation,
            isLoading: loading ? true : false,
          }),
          className
        )}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {/* Left icon / spinner */}
        {loading ? (
          <Spinner className={cn(size === "icon" ? "h-5 w-5" : "h-4 w-4")} />
        ) : (
          leftIcon
        )}

        {/* Label (visually dim when loading) */}
        <span className={cn(loading && "opacity-90")}>{children}</span>

        {/* Right icon */}
        {!loading && rightIcon}
      </Comp>
    );
  }
);
Button.displayName = "Button";

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      viewBox="0 0 24 24"
      role="img"
      aria-label="Loading"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export type { VariantProps } from "class-variance-authority";
export { buttonVariants };
