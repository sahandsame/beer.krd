import path from "node:path";

/** Isolated ports, database and upload folder so e2e never touches the dev setup. */
export const WEB = "http://localhost:3200";
export const ADMIN = "http://localhost:3300";
export const DB_PORT = 5546;
export const OWNER = {
  email: "owner@e2e.test",
  password: "e2e-owner-password-1",
  name: "E2E Owner",
};

const tmp = path.resolve(import.meta.dirname, ".tmp");

export const appEnv: Record<string, string> = {
  DATABASE_URL: `postgres://beer:beer@localhost:${DB_PORT}/beer`,
  WEB_URL: WEB,
  ADMIN_URL: ADMIN,
  BETTER_AUTH_URL: ADMIN,
  BETTER_AUTH_SECRET: "e2e-secret-e2e-secret-e2e-secret-e2e",
  REVALIDATE_SECRET: "e2e-revalidate-secret",
  UPLOADS_DIR: path.join(tmp, "uploads"),
  MEDIA_BASE_URL: `${WEB}/media`,
  DISCORD_WEBHOOK_URL: "",
  AUTH_RATE_LIMIT: "0",
  E2E_TMP: tmp,
};
