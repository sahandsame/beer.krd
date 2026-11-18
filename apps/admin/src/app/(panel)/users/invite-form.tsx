"use client";
import { Button } from "@beer/ui/components/button";
import { Field, Input, Select } from "@beer/ui/components/form";
import { Copy } from "lucide-react";
import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { type InviteResult, inviteUser } from "./actions";

export function InviteForm() {
  const [state, action] = useActionState<InviteResult, FormData>(inviteUser, {});
  const [copied, setCopied] = useState(false);
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
        <Field id="invite-email" label="Email">
          <Input id="invite-email" name="email" type="email" required placeholder="name@beer.krd" />
        </Field>
        <Field id="invite-role" label="Role">
          <Select id="invite-role" name="role" defaultValue="editor">
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </Select>
        </Field>
        <SubmitButton>Create invite</SubmitButton>
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.link && (
        <div
          role="status"
          className="flex flex-col gap-2 rounded-xl border border-lime/40 bg-lime/10 p-4 text-sm"
        >
          <p className="text-lime">{state.message}</p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={state.link}
              className="font-mono text-xs"
              onFocus={(e) => e.currentTarget.select()}
              aria-label="Invitation link"
            />
            <Button
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(state.link ?? "");
                setCopied(true);
              }}
            >
              <Copy className="size-4" /> {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
