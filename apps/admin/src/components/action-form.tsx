"use client";
import { cn } from "@beer/ui/cn";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { type ReactNode, useActionState, useEffect, useRef } from "react";
import type { ActionResult } from "@/lib/form";

type Action = (prev: ActionResult, form: FormData) => Promise<ActionResult>;

/**
 * Generic form wrapper for server actions: shows a success/error banner and,
 * for field errors, marks the matching inputs as invalid.
 */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
}: {
  action: Action;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState<ActionResult, FormData>(action, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = ref.current;
    if (!form) return;
    for (const el of form.querySelectorAll("[aria-invalid]")) el.removeAttribute("aria-invalid");
    if (state.fieldErrors) {
      for (const name of Object.keys(state.fieldErrors)) {
        const el = form.querySelector<HTMLElement>(`[name="${CSS.escape(name)}"]`);
        el?.setAttribute("aria-invalid", "true");
      }
    }
    if (state.ok && resetOnSuccess) form.reset();
  }, [state, resetOnSuccess]);

  return (
    <form ref={ref} action={formAction} className={cn("flex flex-col gap-6", className)}>
      {(state.error || state.ok) && (
        <div
          role={state.error ? "alert" : "status"}
          className={cn(
            "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
            state.error
              ? "border-danger/40 bg-danger/10 text-danger"
              : "border-lime/40 bg-lime/10 text-lime",
          )}
        >
          {state.error ? (
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          )}
          <div>
            <p>{state.error ?? state.message ?? "Saved."}</p>
            {state.fieldErrors && (
              <ul className="mt-1 list-disc ps-4">
                {Object.entries(state.fieldErrors).map(([k, v]) => (
                  <li key={k}>
                    <span className="font-mono text-xs">{k}</span>: {v}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {children}
    </form>
  );
}
