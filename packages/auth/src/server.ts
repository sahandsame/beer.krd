import { account, db, session, user, verification } from "@beer/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

const isProd = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  appName: "Beer Agency Admin",
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.ADMIN_URL ?? "http://localhost:3100",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    // Staff are invited by the owner; nobody can sign up from the outside.
    disableSignUp: true,
    minPasswordLength: 10,
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "editor", input: false },
      active: { type: "boolean", required: false, defaultValue: true, input: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  databaseHooks: {
    session: {
      create: {
        // Deactivated staff cannot sign in.
        before: async (s) => {
          const u = await db.query.user.findFirst({ where: (t, { eq }) => eq(t.id, s.userId) });
          if (!u?.active) return false;
          return { data: s };
        },
      },
    },
  },
  rateLimit: {
    // On in production; AUTH_RATE_LIMIT=0 turns it off (end-to-end tests), =1 forces it on.
    enabled: process.env.AUTH_RATE_LIMIT === "1" || (isProd && process.env.AUTH_RATE_LIMIT !== "0"),
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
    },
  },
  advanced: {
    useSecureCookies: isProd,
    cookiePrefix: "beer",
  },
  telemetry: { enabled: false },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
