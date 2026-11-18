import { Card } from "@beer/ui/components/card";
import { PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/session";
import { PasswordForm } from "./password-form";

export const metadata = { title: "Your account" };

export default async function AccountPage() {
  const me = await requireUser();
  return (
    <>
      <PageTitle title="Your account" description={`${me.email} · ${me.role}`} />
      <Card className="max-w-lg">
        <h2 className="mb-4 font-semibold">Change password</h2>
        <PasswordForm />
      </Card>
    </>
  );
}
