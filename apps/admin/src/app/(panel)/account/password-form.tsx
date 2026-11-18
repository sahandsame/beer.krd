"use client";
import { authClient } from "@beer/auth/client";
import { Button } from "@beer/ui/components/button";
import { Field, Input } from "@beer/ui/components/form";
import { useState } from "react";

export function PasswordForm() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, setPending] = useState(false);
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const next = String(fd.get("new"));
        if (next.length < 10)
          return setMsg({ ok: false, text: "New password must be at least 10 characters." });
        if (next !== fd.get("confirm"))
          return setMsg({ ok: false, text: "Passwords do not match." });
        setPending(true);
        const { error } = await authClient.changePassword({
          currentPassword: String(fd.get("current")),
          newPassword: next,
          revokeOtherSessions: true,
        });
        setPending(false);
        if (error)
          return setMsg({ ok: false, text: error.message ?? "Could not change password." });
        form.reset();
        setMsg({ ok: true, text: "Password changed. Other devices were signed out." });
      }}
    >
      <Field id="current" label="Current password">
        <Input
          id="current"
          name="current"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      <Field id="new" label="New password" hint="At least 10 characters.">
        <Input id="new" name="new" type="password" autoComplete="new-password" required />
      </Field>
      <Field id="confirm" label="Confirm new password">
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
      </Field>
      {msg && (
        <p
          role={msg.ok ? "status" : "alert"}
          className={msg.ok ? "text-sm text-lime" : "text-sm text-danger"}
        >
          {msg.text}
        </p>
      )}
      <div>
        <Button type="submit" disabled={pending}>
          Change password
        </Button>
      </div>
    </form>
  );
}
