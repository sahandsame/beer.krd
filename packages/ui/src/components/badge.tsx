import type { HTMLAttributes } from "react";
import { cn } from "../cn";

export type BadgeTone = "lime" | "neutral" | "warning" | "danger" | "info";

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        {
          lime: "bg-lime/15 text-lime",
          neutral: "bg-white/8 text-mist",
          warning: "bg-warning/15 text-warning",
          danger: "bg-danger/15 text-danger",
          info: "bg-sky-300/15 text-sky-200",
        }[tone],
        className,
      )}
      {...props}
    />
  );
}
