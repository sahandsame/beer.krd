import type { Localized } from "@beer/i18n";
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const id = () =>
  text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());
const createdAt = () => timestamp({ withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());
const localized = () =>
  jsonb().$type<Localized>().notNull().default(sql`'{"ckb":"","en":"","ar":""}'::jsonb`);

// ── Better Auth core tables ──────────────────────────────
export const user = pgTable("user", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  /** owner | admin | editor */
  role: text().notNull().default("editor"),
  active: boolean().notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const session = pgTable(
  "session",
  {
    id: text().primaryKey(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    token: text().notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index().on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true }),
    scope: text(),
    password: text(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index().on(t.userId)],
);

export const verification = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// ── Staff invitations ────────────────────────────────────
export const invitation = pgTable("invitation", {
  id: id(),
  email: text().notNull(),
  role: text().notNull(),
  /** SHA-256 of the token in the invite link; the raw token is never stored. */
  tokenHash: text().notNull().unique(),
  invitedById: text().references(() => user.id, { onDelete: "set null" }),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  acceptedAt: timestamp({ withTimezone: true }),
  createdAt: createdAt(),
});

// ── Media ────────────────────────────────────────────────
export const media = pgTable("media", {
  id: id(),
  /** File name inside UPLOADS_DIR, e.g. `2026/11/abc123.webp`. */
  key: text().notNull().unique(),
  mime: text().notNull(),
  width: integer(),
  height: integer(),
  size: integer().notNull(),
  originalName: text().notNull().default(""),
  alt: localized(),
  createdById: text().references(() => user.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

// ── Services ─────────────────────────────────────────────
export const service = pgTable("service", {
  id: id(),
  slug: text().notNull().unique(),
  icon: text().notNull().default("sparkles"),
  sort: integer().notNull().default(0),
  published: boolean().notNull().default(true),
  name: localized(),
  summary: localized(),
  body: localized(),
  /** One deliverable per line. */
  deliverables: localized(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// ── Portfolio ────────────────────────────────────────────
export const project = pgTable("project", {
  id: id(),
  slug: text().notNull().unique(),
  client: text().notNull().default(""),
  year: integer(),
  featured: boolean().notNull().default(false),
  published: boolean().notNull().default(false),
  sort: integer().notNull().default(0),
  coverMediaId: text().references(() => media.id, { onDelete: "set null" }),
  title: localized(),
  summary: localized(),
  challenge: localized(),
  approach: localized(),
  results: localized(),
  videoUrls: jsonb().$type<string[]>().notNull().default([]),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const projectService = pgTable(
  "project_service",
  {
    projectId: text()
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    serviceId: text()
      .notNull()
      .references(() => service.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.serviceId] })],
);

export const projectMedia = pgTable(
  "project_media",
  {
    projectId: text()
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    mediaId: text()
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    sort: integer().notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.mediaId] })],
);

// ── Team ─────────────────────────────────────────────────
export const teamMember = pgTable("team_member", {
  id: id(),
  sort: integer().notNull().default(0),
  published: boolean().notNull().default(true),
  photoMediaId: text().references(() => media.id, { onDelete: "set null" }),
  name: localized(),
  role: localized(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// ── Editable page content & settings ─────────────────────
export const contentBlock = pgTable("content_block", {
  /** e.g. `home.hero`, `about.story` — see content-blocks.ts */
  key: text().primaryKey(),
  data: jsonb().$type<Record<string, unknown>>().notNull(),
  updatedById: text().references(() => user.id, { onDelete: "set null" }),
  updatedAt: updatedAt(),
});

export const setting = pgTable("setting", {
  key: text().primaryKey(),
  value: jsonb().$type<unknown>().notNull(),
  updatedAt: updatedAt(),
});

// ── Leads ────────────────────────────────────────────────
export const lead = pgTable(
  "lead",
  {
    id: id(),
    name: text().notNull(),
    phone: text().notNull(),
    email: text(),
    serviceId: text().references(() => service.id, { onDelete: "set null" }),
    budget: text(),
    message: text().notNull(),
    locale: text().notNull(),
    sourcePage: text(),
    /** new | contacted | proposal | won | lost */
    status: text().notNull().default("new"),
    assigneeId: text().references(() => user.id, { onDelete: "set null" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index().on(t.status), index().on(t.createdAt)],
);

export const leadNote = pgTable(
  "lead_note",
  {
    id: id(),
    leadId: text()
      .notNull()
      .references(() => lead.id, { onDelete: "cascade" }),
    authorId: text().references(() => user.id, { onDelete: "set null" }),
    body: text().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index().on(t.leadId)],
);

// ── Audit log ────────────────────────────────────────────
export const auditLog = pgTable(
  "audit_log",
  {
    id: id(),
    userId: text().references(() => user.id, { onDelete: "set null" }),
    action: text().notNull(),
    entity: text().notNull(),
    entityId: text(),
    summary: text().notNull().default(""),
    diff: jsonb().$type<unknown>(),
    createdAt: createdAt(),
  },
  (t) => [index().on(t.createdAt)],
);

export type User = typeof user.$inferSelect;
export type Service = typeof service.$inferSelect;
export type Project = typeof project.$inferSelect;
export type Media = typeof media.$inferSelect;
export type TeamMember = typeof teamMember.$inferSelect;
export type Lead = typeof lead.$inferSelect;
export type LeadNote = typeof leadNote.$inferSelect;
export type AuditLog = typeof auditLog.$inferSelect;
export type Invitation = typeof invitation.$inferSelect;
