import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { db, invitation } from "@beer/db";
import { and, eq, gt, isNull } from "drizzle-orm";

export const INVITE_TTL_DAYS = 7;

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function newInviteToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashToken(token) };
}

export async function findValidInvitation(token: string) {
  if (!token || token.length > 100) return null;
  return db.query.invitation.findFirst({
    where: and(
      eq(invitation.tokenHash, hashToken(token)),
      isNull(invitation.acceptedAt),
      gt(invitation.expiresAt, new Date()),
    ),
  });
}
