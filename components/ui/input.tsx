// components/ui/input.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const inputVariants = cva(
  // Base input styles
  "w-full rounded-xl border bg-white text-zinc-900 placeholder:text-zinc-400 " +
    "shadow-sm transition-all outline-none " +
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black " +
    "dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 " +
    "disabled:cursor-not-allowed disabled:opacity-60 " +
    "border-zinc-300 dark:border-zinc-700",
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-3.5 text-sm",
        lg: "h-11 px-4 text-base",
      },
      state: {
        default: "",
        invalid:
          "border-red-500 focus-visible:ring-red-600 dark:border-red-500",
        valid:
          "border-green-500 focus-visible:ring-green-600 dark:border-green-500",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Optional decorative/semantic icons inside the field (left side). */
  leftIcon?: React.ReactNode;
  /** Optional decorative/semantic icons inside the field (right side). */
  rightIcon?: React.ReactNode;
  /** Extra classes for the actual <input>, separate from the wrapper. */
  inputClassName?: string;
}

/**
 * Input with optional left/right icons.
 * className applies to the wrapper; inputClassName applies to the <input>.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputClassName,
      leftIcon,
      rightIcon,
      size,
      state,
      disabled,
      ...props
    },
    ref
  ) => {
    const withLeft = Boolean(leftIcon);
    const withRight = Boolean(rightIcon);

    // Padding adjustments when icons are present
    const padLeft = size === "lg" ? "pl-11" : size === "sm" ? "pl-9" : "pl-10";
    const padRight = size === "lg" ? "pr-11" : size === "sm" ? "pr-9" : "pr-10";

    const iconY =
      size === "lg" ? "inset-y-0.5" : size === "sm" ? "inset-y-0" : "inset-y-0";

    return (
      <div className={cn("relative", className)}>
        {leftIcon && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-3 flex items-center text-zinc-500 dark:text-zinc-400",
              iconY
            )}
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          aria-invalid={state === "invalid" || undefined}
          disabled={disabled}
          className={cn(
            inputVariants({ size, state }),
            withLeft && padLeft,
            withRight && padRight,
            inputClassName
          )}
          {...props}
        />

        {rightIcon && (
          <span
            className={cn(
              "absolute right-3 flex items-center text-zinc-500 dark:text-zinc-400",
              iconY
            )}
          >
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { inputVariants };
