import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../cn";

export type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background,color,box-shadow,transform] duration-200 select-none",
    "disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
    {
      primary:
        "bg-lime text-ink hover:bg-lime-soft shadow-[6px_6px_0_0_var(--color-ink)] hover:shadow-[3px_3px_0_0_var(--color-ink)]",
      outline: "border border-line-strong text-paper hover:border-lime hover:text-lime",
      ghost: "text-mist hover:text-paper hover:bg-white/5",
      danger: "bg-danger/15 text-danger border border-danger/40 hover:bg-danger/25",
    }[variant],
    { sm: "h-8 px-3.5 text-sm", md: "h-10 px-5 text-sm", lg: "h-12 px-7 text-base" }[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
};

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}
