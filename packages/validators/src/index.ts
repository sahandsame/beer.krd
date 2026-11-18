import { locales } from "@beer/i18n";
import { z } from "zod";

export const localized = z.object({ ckb: z.string(), en: z.string(), ar: z.string() });
/** Localized value whose Kurdish (default) translation is required. */
export const localizedRequired = localized.refine((v) => v.ckb.trim().length > 0, {
  message: "Kurdish (ckb) text is required",
  path: ["ckb"],
});

export const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, "Slug must be at least 2 characters")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes only");

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// ── Leads ────────────────────────────────────────────────
export const leadStatuses = ["new", "contacted", "proposal", "won", "lost"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const budgetRanges = ["lt500", "500-2000", "2000-5000", "gt5000", "unsure"] as const;
export type BudgetRange = (typeof budgetRanges)[number];

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v ? v : undefined))
    .optional();

/** Contact form on the public site. Error messages are keys into the web dictionaries. */
export const leadInput = z.object({
  name: z.string().trim().min(2, "nameRequired").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "phoneInvalid")
    .max(30)
    .regex(/^[+0-9\s()-]+$/, "phoneInvalid"),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.email("emailInvalid").optional()),
  serviceSlug: optionalText(80),
  budget: z.enum(budgetRanges).optional().catch(undefined),
  message: z.string().trim().min(10, "messageTooShort").max(4000),
  locale: z.enum(locales),
  sourcePage: optionalText(300),
});
export type LeadInput = z.infer<typeof leadInput>;

// ── Admin entities ───────────────────────────────────────
export const serviceInput = z.object({
  slug,
  icon: z.string().trim().max(40).default("sparkles"),
  sort: z.coerce.number().int().min(0).max(999).default(0),
  published: z.boolean(),
  name: localizedRequired,
  summary: localized,
  body: localized,
  deliverables: localized,
});
export type ServiceInput = z.infer<typeof serviceInput>;

export const projectInput = z.object({
  slug,
  client: z.string().trim().max(120).default(""),
  year: z.coerce.number().int().min(2000).max(2100).nullable(),
  featured: z.boolean(),
  published: z.boolean(),
  sort: z.coerce.number().int().min(0).max(999).default(0),
  title: localizedRequired,
  summary: localized,
  challenge: localized,
  approach: localized,
  results: localized,
  serviceIds: z.array(z.string()).default([]),
  videoUrls: z.array(z.url()).default([]),
});
export type ProjectInput = z.infer<typeof projectInput>;

export const teamMemberInput = z.object({
  sort: z.coerce.number().int().min(0).max(999).default(0),
  published: z.boolean(),
  name: localizedRequired,
  role: localized,
});
export type TeamMemberInput = z.infer<typeof teamMemberInput>;

export const staffRoles = ["owner", "admin", "editor"] as const;
export type StaffRole = (typeof staffRoles)[number];

export const invitationInput = z.object({
  email: z.email().trim().toLowerCase(),
  role: z.enum(staffRoles),
});

export const acceptInvitationInput = z
  .object({
    name: z.string().trim().min(2).max(120),
    password: z.string().min(10, "Password must be at least 10 characters").max(128),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const settingsInput = z.object({
  phone: z.string().trim().max(40),
  whatsapp: z.string().trim().max(40),
  viber: z.string().trim().max(40),
  email: z.union([z.literal(""), z.email()]),
  instagram: z.union([z.literal(""), z.url()]),
  facebook: z.union([z.literal(""), z.url()]),
  city: localized,
  address: localized,
  showMap: z.boolean(),
  mapEmbedUrl: z.union([z.literal(""), z.url()]),
  workSectionEnabled: z.boolean(),
  discordWebhookUrl: z.union([
    z.literal(""),
    z.url().refine((u) => /^https:\/\/(?:\w+\.)?discord(?:app)?\.com\/api\/webhooks\//.test(u), {
      message: "Must be a Discord webhook URL",
    }),
  ]),
});
export type SiteSettings = z.infer<typeof settingsInput>;
