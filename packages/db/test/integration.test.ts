import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDb, type Database } from "../src/client";
import { runMigrations } from "../src/migrate";
import {
  createLead,
  getBlocks,
  getProjectBySlug,
  getPublishedProjects,
  getPublishedServices,
  getServiceBySlug,
  getSiteSettings,
} from "../src/queries/public";
import { contentBlock, media, project, projectMedia, projectService, service } from "../src/schema";
import { seed } from "../src/seed";
import { seedBlocks } from "../src/seed-data";
import { createCredentialUser } from "../src/users";
import { startTestDb } from "./pg";

let pg: Awaited<ReturnType<typeof startTestDb>>;
let db: Database;

beforeAll(async () => {
  pg = await startTestDb(5544);
  await runMigrations(pg.url);
  db = createDb(pg.url, 3);
  await seed(db, { email: "Owner@Beer.krd", password: "test-password-123", name: "Owner" });
}, 120_000);

afterAll(async () => {
  await db?.$client.end();
  await pg?.stop();
});

describe("seed", () => {
  it("creates the five services with Kurdish text intact", async () => {
    const services = await getPublishedServices(db);
    expect(services.map((s) => s.slug)).toEqual([
      "web-software",
      "social-media",
      "branding",
      "paid-ads",
      "photo-video",
    ]);
    expect(services[1]?.name.ckb).toBe("بەڕێوەبردنی سۆشیال میدیا");
  });

  it("is idempotent and never overwrites admin edits", async () => {
    await db.update(service).set({ icon: "sparkles" }).where(eq(service.slug, "branding"));
    const again = await seed(db, { email: "x@y.z", password: "whatever-123", name: "X" });
    expect(again.ownerCreated).toBe(false);
    expect((await getServiceBySlug(db, "branding"))?.icon).toBe("sparkles");
    expect(await getPublishedServices(db)).toHaveLength(5);
  });

  it("creates the owner with a lower-cased email and a credential account", async () => {
    const u = await db.query.user.findFirst();
    expect(u?.email).toBe("owner@beer.krd");
    expect(u?.role).toBe("owner");
    const acc = await db.query.account.findFirst();
    expect(acc?.providerId).toBe("credential");
    expect(acc?.password).toBeTruthy();
    expect(acc?.password).not.toContain("test-password-123");
  });

  it("refuses duplicate users", async () => {
    await expect(
      createCredentialUser(db, {
        email: "owner@beer.krd",
        name: "Dup",
        password: "abcdefghijk",
        role: "editor",
      }),
    ).rejects.toThrow(/already exists/);
  });
});

describe("settings and content", () => {
  it("returns default settings with the Work section hidden", async () => {
    const s = await getSiteSettings(db);
    expect(s.workSectionEnabled).toBe(false);
    expect(s.city.en).toBe("Erbil, Kurdistan");
  });

  it("merges saved blocks over the defaults", async () => {
    await db
      .update(contentBlock)
      .set({ data: { ...seedBlocks["home.hero"], title: { ckb: "نوێ", en: "New", ar: "جديد" } } })
      .where(eq(contentBlock.key, "home.hero"));
    await db.delete(contentBlock).where(eq(contentBlock.key, "home.cta"));
    const b = await getBlocks(db, ["home.hero", "home.cta"]);
    expect(b["home.hero"].title.en).toBe("New");
    expect(b["home.hero"].eyebrow.en).toBe("Beer Agency · Erbil");
    expect(b["home.cta"].title.en).toBe("Have a project in mind?");
  });
});

describe("leads", () => {
  it("stores a lead and resolves the service", async () => {
    const { lead, service: svc } = await createLead(db, {
      name: "ئارام",
      phone: "0773 000 0000",
      message: "پێویستمان بە ماڵپەڕێکی نوێیە.",
      locale: "ckb",
      serviceSlug: "web-software",
      budget: "500-2000",
    });
    expect(lead.status).toBe("new");
    expect(lead.name).toBe("ئارام");
    expect(svc?.slug).toBe("web-software");
  });

  it("ignores unknown service slugs", async () => {
    const { lead } = await createLead(db, {
      name: "A B",
      phone: "0773000000",
      message: "Something else please",
      locale: "en",
      serviceSlug: "other",
    });
    expect(lead.serviceId).toBeNull();
  });
});

describe("portfolio", () => {
  it("only returns published projects, with services, cover and gallery", async () => {
    const [m] = await db
      .insert(media)
      .values({ key: "2026/11/a.webp", mime: "image/webp", size: 10, width: 10, height: 5 })
      .returning();
    const [p] = await db
      .insert(project)
      .values({
        slug: "cafe",
        published: true,
        featured: true,
        coverMediaId: m!.id,
        title: { ckb: "کافێ", en: "Cafe", ar: "مقهى" },
      })
      .returning();
    await db
      .insert(project)
      .values({ slug: "draft", published: false, title: { ckb: "ڕەشنووس", en: "Draft", ar: "" } });
    const svc = await getServiceBySlug(db, "branding");
    await db.insert(projectService).values({ projectId: p!.id, serviceId: svc!.id });
    await db.insert(projectMedia).values({ projectId: p!.id, mediaId: m!.id, sort: 1 });

    const list = await getPublishedProjects(db);
    expect(list.map((x) => x.slug)).toEqual(["cafe"]);
    expect(list[0]?.cover?.key).toBe("2026/11/a.webp");
    expect(list[0]?.services.map((s) => s.slug)).toEqual(["branding"]);
    expect(await getPublishedProjects(db, { featuredOnly: true })).toHaveLength(1);

    const detail = await getProjectBySlug(db, "cafe");
    expect(detail?.gallery).toHaveLength(1);
    expect(await getProjectBySlug(db, "draft")).toBeNull();
  });
});
