// components/ui/textarea.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const textareaVariants = cva(
  "w-full min-h-[96px] rounded-xl border bg-white text-zinc-900 placeholder:text-zinc-400 " +
    "shadow-sm transition-all outline-none resize-none " +
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black " +
    "dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 " +
    "disabled:cursor-not-allowed disabled:opacity-60 " +
    "border-zinc-300 dark:border-zinc-700",
  {
    variants: {
      size: {
        sm: "text-sm px-3 py-2",
        md: "text-sm px-3.5 py-2.5",
        lg: "text-base px-4 py-3",
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

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  /** Auto grows height while typing. */
  autoResize?: boolean;
  /** Show character counter when maxLength is set. */
  showCount?: boolean;
  /** Put the counter on the right bottom corner. */
  counterClassName?: string;
}

/**
 * Textarea with optional auto-resize and character counter.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      size,
      state,
      autoResize = true,
      showCount = false,
      counterClassName,
      onInput,
      maxLength,
      ...props
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    // Merge refs
    React.useImperativeHandle(
      ref,
      () => innerRef.current as HTMLTextAreaElement
    );

    const resize = React.useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, []);

    React.useEffect(() => {
      if (autoResize) resize();
    }, [autoResize, resize, props.value]);

    const handleInput: React.FormEventHandler<HTMLTextAreaElement> = (e) => {
      autoResize && resize();
      onInput?.(e);
    };

    const valueLength =
      typeof props.value === "string" ? props.value.length : undefined;

    return (
      <div className={cn("relative", className)}>
        <textarea
          ref={innerRef}
          aria-invalid={state === "invalid" || undefined}
          onInput={handleInput}
          className={cn(textareaVariants({ size, state }))}
          maxLength={maxLength}
          {...props}
        />
        {showCount && typeof maxLength === "number" && (
          <span
            className={cn(
              "pointer-events-none absolute bottom-2 right-3 select-none " +
                "text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400",
              counterClassName
            )}
            aria-hidden
          >
            {valueLength ?? 0}/{maxLength}
          </span>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { textareaVariants };
