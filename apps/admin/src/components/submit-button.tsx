"use client";
import { Button, type ButtonVariant } from "@beer/ui/components/button";
import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  variant,
  confirm,
  name,
  value,
  size = "md",
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  /** Ask before submitting (for deletes). */
  confirm?: string;
  name?: string;
  value?: string;
  size?: "sm" | "md" | "lg";
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      name={name}
      value={value}
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </Button>
  );
}
