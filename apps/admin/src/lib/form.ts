import { localizedFromForm } from "@beer/i18n";
import type { z } from "zod";

export { localizedFromForm };

export type ActionResult = {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export const str = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
export const bool = (form: FormData, key: string) =>
  form.get(key) === "on" || form.get(key) === "true";
export const files = (form: FormData, key: string) =>
  form.getAll(key).filter((f): f is File => f instanceof File && f.size > 0);

/** Flatten zod issues into { "name.ckb": "message" } for display. */
export function zodErrors(error: z.ZodError): ActionResult {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) fieldErrors[issue.path.join(".") || "form"] ??= issue.message;
  return { error: "Please fix the highlighted fields.", fieldErrors };
}

export function isUniqueViolation(e: unknown): boolean {
  const err = e as { code?: string; cause?: { code?: string } };
  return err?.code === "23505" || err?.cause?.code === "23505";
}
