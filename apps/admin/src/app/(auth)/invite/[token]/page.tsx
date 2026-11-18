import { Field, Input } from "@beer/ui/components/form";
import type { Metadata } from "next";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { findValidInvitation } from "@/lib/invitations";
import { acceptInvitation } from "./actions";

export const metadata: Metadata = { title: "Accept invitation" };

export default async function InvitePage({ params }: PageProps<"/invite/[token]">) {
  const { token } = await params;
  const invite = await findValidInvitation(token);
  if (!invite) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Invitation not valid</h1>
        <p className="text-sm text-mist">
          This link has expired or was already used. Ask the owner for a new one.
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Welcome to Beer Agency</h1>
        <p className="text-sm text-mist">
          Set up your <span className="text-paper">{invite.role}</span> account for{" "}
          <span className="text-paper">{invite.email}</span>.
        </p>
      </div>
      <ActionForm action={acceptInvitation.bind(null, token)}>
        <Field id="name" label="Your name">
          <Input id="name" name="name" autoComplete="name" required />
        </Field>
        <Field id="password" label="Password" hint="At least 10 characters.">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
          />
        </Field>
        <Field id="confirm" label="Confirm password">
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
        </Field>
        <SubmitButton>Create account</SubmitButton>
      </ActionForm>
    </div>
  );
}
