import { db, invitation, user as userTable } from "@beer/db";
import { Card } from "@beer/ui/components/card";
import { Select } from "@beer/ui/components/form";
import { and, asc, gt, isNull } from "drizzle-orm";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { formatDate, PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/session";
import { revokeInvitation, updateUser } from "./actions";
import { InviteForm } from "./invite-form";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  const me = await requireUser("owner");
  const [users, invites] = await Promise.all([
    db.select().from(userTable).orderBy(asc(userTable.createdAt)),
    db
      .select()
      .from(invitation)
      .where(and(isNull(invitation.acceptedAt), gt(invitation.expiresAt, new Date()))),
  ]);
  return (
    <>
      <PageTitle
        title="Users"
        description={
          <>
            Owners manage users. Admins can change settings and delete content. Editors edit content
            and handle leads.
          </>
        }
      />
      <div className="grid max-w-4xl gap-6">
        <Card>
          <h2 className="mb-4 font-semibold">Invite a staff member</h2>
          <InviteForm />
        </Card>
        {invites.length > 0 && (
          <Card>
            <h2 className="mb-4 font-semibold">Open invitations</h2>
            <ul className="divide-y divide-line">
              {invites.map((i) => (
                <li
                  key={i.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
                >
                  <span>
                    {i.email}{" "}
                    <span className="text-mist">
                      · {i.role} · expires {formatDate(i.expiresAt)}
                    </span>
                  </span>
                  <form action={revokeInvitation.bind(null, i.id)}>
                    <SubmitButton size="sm" variant="ghost">
                      Revoke
                    </SubmitButton>
                  </form>
                </li>
              ))}
            </ul>
          </Card>
        )}
        <Card>
          <h2 className="mb-4 font-semibold">Staff</h2>
          <ul className="divide-y divide-line">
            {users.map((u) => (
              <li key={u.id} className="py-4">
                <ActionForm action={updateUser.bind(null, u.id)} className="gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {u.name}{" "}
                        {u.id === me.id && <span className="text-xs text-lime">(you)</span>}
                        {!u.active && <span className="ms-2 text-xs text-danger">deactivated</span>}
                      </p>
                      <p className="text-xs text-mist">
                        {u.email} · joined {formatDate(u.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        name="role"
                        defaultValue={u.role}
                        className="h-9 w-32 text-sm"
                        aria-label={`Role for ${u.name}`}
                      >
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                        <option value="owner">Owner</option>
                      </Select>
                      <Select
                        name="active"
                        defaultValue={String(u.active)}
                        className="h-9 w-36 text-sm"
                        aria-label={`Status for ${u.name}`}
                      >
                        <option value="true">Active</option>
                        <option value="false">Deactivated</option>
                      </Select>
                      <SubmitButton size="sm" variant="outline">
                        Save
                      </SubmitButton>
                    </div>
                  </div>
                </ActionForm>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
