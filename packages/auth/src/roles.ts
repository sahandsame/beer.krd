import type { StaffRole } from "@beer/validators";

const rank: Record<StaffRole, number> = { editor: 1, admin: 2, owner: 3 };

export function isStaffRole(v: unknown): v is StaffRole {
  return v === "owner" || v === "admin" || v === "editor";
}

/** True when `role` is at least `required` (owner > admin > editor). */
export function hasRole(role: string | null | undefined, required: StaffRole): boolean {
  return isStaffRole(role) && rank[role] >= rank[required];
}

/** What each role can do in the admin. */
export const can = {
  editContent: (role: string) => hasRole(role, "editor"),
  manageLeads: (role: string) => hasRole(role, "editor"),
  manageSettings: (role: string) => hasRole(role, "admin"),
  viewAudit: (role: string) => hasRole(role, "admin"),
  manageUsers: (role: string) => hasRole(role, "owner"),
};
