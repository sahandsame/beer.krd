/**
 * Renders every post in posts.ts to PNG with Chromium (correct Kurdish/Arabic shaping),
 * plus captions.md and a review gallery (index.html) in marketing/posts/out.
 *
 *   pnpm --filter @beer/posts render
 *
 * Screenshots of beer.krd for posts 9, 14 and 17 are taken from WEB_URL / ADMIN_URL
 * (the local dev servers by default); if they aren't running, placeholders are used.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pick } from "@beer/i18n";
import { Barcode, BMark } from "@beer/ui/brand";
import { type Browser, chromium } from "@playwright/test";
import type { ReactNode } from "react";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HANDLE, PHONE, type Post, packages, posts, SITE, type Slide, TAGS } from "./posts";

// Shared @beer/ui components are compiled with classic JSX when loaded from outside their package.
(globalThis as { React?: typeof React }).React = React;

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, "../out");
const SHOTS = path.join(OUT, "_shots");

const C = {
  green: "#06332E",
  deep: "#042621",
  ink: "#081D18",
  lime: "#C6DB62",
  paper: "#FAFFFE",
  mist: "#A9C4BD",
  line: "rgba(250,255,254,0.14)",
};
const SIZES = { feed: { width: 1080, height: 1350 }, tall: { width: 1080, height: 1920 } } as const;

const featured = (i: number) => packages[i]?.featured === "yes";
const pk = (i: number) => {
  const p = packages[i];
  if (!p) throw new Error(`No package ${i}`);
  return p;
};

// ── Templates ─────────────────────────────────────────────────────

function Frame({
  children,
  size,
  index,
  total,
}: {
  children: ReactNode;
  size: "feed" | "tall";
  index: number;
  total: number;
}) {
  const tall = size === "tall";
  return (
    <div className="frame" style={{ width: 1080, height: SIZES[size].height }}>
      <div className="grid" />
      <BMark shadow className="watermark" style={{ color: C.lime }} />
      <header dir="ltr">
        <span className="brand">
          <BMark style={{ height: 54, width: "auto", color: C.lime }} />
          <span className="brand-text">
            <Barcode style={{ height: 12, width: 150 }} />
            <span className="mono small">
              <b style={{ color: C.lime }}>Beer</b> Agency
            </span>
          </span>
        </span>
        {total > 1 && (
          <span className="mono counter">
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
        )}
      </header>
      <main dir="rtl" lang="ckb" style={{ paddingTop: tall ? 120 : 40 }}>
        {children}
      </main>
      <footer dir="ltr">
        <Barcode style={{ height: 22, width: 220 }} />
        <span className="mono small">
          {HANDLE} · {SITE}
        </span>
      </footer>
    </div>
  );
}

function SlideView({ slide, tall }: { slide: Slide; tall: boolean }) {
  switch (slide.kind) {
    case "hook":
      return (
        <div className="center">
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h1 className={tall ? "xl" : "lg"}>{slide.title}</h1>
          {slide.sub && <p className="sub">{slide.sub}</p>}
          {slide.demo && <span className="demo">دیمۆ · DEMO</span>}
        </div>
      );
    case "reason":
      return (
        <div className="center">
          <span className="num">{String(slide.n).padStart(2, "0")}</span>
          <h2>{slide.title}</h2>
          <p className="body">{slide.body}</p>
        </div>
      );
    case "list":
      return (
        <div className="center">
          <h2>{slide.title}</h2>
          <ul className="checks">
            {slide.items.map((i) => (
              <li key={i}>
                <span className="tick">✓</span>
                {i}
              </li>
            ))}
          </ul>
          {slide.note && <p className="pill">{slide.note}</p>}
        </div>
      );
    case "ladder":
      return (
        <div className="center">
          <h2>{slide.title}</h2>
          <ol className="ladder">
            {packages.map((p, i) => (
              <li key={i} className={featured(i) ? "hot" : ""}>
                <span className="mono idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="name">{pick(p.name, "ckb")}</span>
                <span className="price">{pick(p.price, "ckb")}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    case "package": {
      const p = pk(slide.tier);
      return (
        <div className={`card ${featured(slide.tier) ? "hot" : ""}`}>
          <div className="card-top">
            <span className="mono idx" dir="ltr">
              {String(slide.tier + 1).padStart(2, "0")} / {String(packages.length).padStart(2, "0")}
            </span>
            {featured(slide.tier) && <span className="badge">باوترین</span>}
          </div>
          <h2>{pick(p.name, "ckb")}</h2>
          <p className="price-xl">{pick(p.price, "ckb")}</p>
          <p className="body">{pick(p.summary, "ckb")}</p>
          <ul className="checks small-checks">
            {pick(p.features, "ckb")
              .split("\n")
              .map((f) => (
                <li key={f}>
                  <span className="tick">✓</span>
                  {f}
                </li>
              ))}
          </ul>
          <p className="delivery">⏱ ماوەی ئامادەکردن: {pick(p.delivery, "ckb")}</p>
        </div>
      );
    }
    case "steps":
      return (
        <div className="center">
          <h2>{slide.title}</h2>
          <ol className="steps">
            {slide.steps.map((s, i) => (
              <li key={s.title}>
                <span className="num sm">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
    case "qa":
      return (
        <div className="center">
          <p className="q-mark">؟</p>
          <h2>{slide.q}</h2>
          <p className="body answer">{slide.a}</p>
        </div>
      );
    case "choice": {
      const p = pk(slide.tier);
      return (
        <div className="center">
          <h2>{slide.q}</h2>
          <p className="arrow">↓</p>
          <div className={`answer-pill ${featured(slide.tier) ? "hot" : ""}`}>
            <span>{pick(p.name, "ckb")}</span>
            <b>{pick(p.price, "ckb")}</b>
          </div>
        </div>
      );
    }
    case "big":
      return (
        <div className="center">
          <h2>{slide.title}</h2>
          <p className="huge" dir="auto">
            {slide.value}
          </p>
          <p className="body">{slide.body}</p>
        </div>
      );
    case "split":
      return (
        <div className="center">
          <h2>{slide.title}</h2>
          <div className="split">
            {[slide.left, slide.right].map((col, i) => (
              <div key={col.label} className={i === 1 ? "col hot" : "col"}>
                <h3>{col.label}</h3>
                <ul>
                  {col.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    case "phones":
      return (
        <div className="center">
          <h2>{slide.title}</h2>
          {slide.sub && <p className="sub">{slide.sub}</p>}
          <div className="phones" dir="ltr">
            {slide.shots.map((s) => (
              <div key={s} className="phone">
                <img src={shotSrc(s)} alt="" />
              </div>
            ))}
          </div>
        </div>
      );
    case "screen":
      return (
        <div className="center">
          <h2>{slide.title}</h2>
          {slide.sub && <p className="sub">{slide.sub}</p>}
          <div className="laptop" dir="ltr">
            <div className="bar">
              <i />
              <i />
              <i />
              <span>admin.beer.krd</span>
            </div>
            <img src={shotSrc(slide.shot)} alt="" />
          </div>
        </div>
      );
    case "poll":
      return (
        <div className="center">
          <h1 className="lg">{slide.title}</h1>
          <div className="poll">
            {slide.options.map((o) => (
              <div key={o}>{o}</div>
            ))}
          </div>
        </div>
      );
    case "cta":
      return (
        <div className="center">
          <h1 className="lg">{slide.title}</h1>
          {slide.sub && <p className="sub">{slide.sub}</p>}
          <p className="phone-number" dir="ltr">
            {PHONE}
          </p>
          <p className="mono contacts" dir="ltr">
            WhatsApp · Viber · {HANDLE} · {SITE}
          </p>
        </div>
      );
  }
}

const css = `
*{box-sizing:border-box;margin:0;padding:0}
body{background:${C.green}}
.frame{position:relative;overflow:hidden;background:radial-gradient(120% 80% at 80% 0%,#0b4a42 0%,${C.green} 55%,${C.deep} 100%);color:${C.paper};font-family:Vazirmatn,sans-serif;display:flex;flex-direction:column;padding:64px 72px}
.grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(250,255,254,.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(250,255,254,.05) 1px,transparent 1px);background-size:72px 72px;mask-image:radial-gradient(ellipse at 70% 30%,black 20%,transparent 75%)}
.watermark{position:absolute;width:520px;height:auto;left:-120px;bottom:-140px;opacity:.12}
header,footer{position:relative;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:18px}.brand-text{display:flex;flex-direction:column;gap:8px}
.mono{font-family:"JetBrains Mono",monospace;letter-spacing:.25em}.small{font-size:20px;color:${C.mist}}.counter{font-size:24px;color:${C.lime}}
main{position:relative;flex:1;display:flex;flex-direction:column;justify-content:center}
.center{display:flex;flex-direction:column;gap:34px}
.eyebrow{display:inline-block;align-self:flex-start;background:${C.lime};color:${C.ink};font-weight:700;font-size:34px;padding:8px 26px;border-radius:999px}
h1{font-weight:800;line-height:1.35}.xl{font-size:118px}.lg{font-size:92px}
h2{font-weight:800;font-size:74px;line-height:1.4}h3{font-weight:700;font-size:44px}
.sub{font-size:44px;line-height:1.7;color:${C.mist}}
.body{font-size:44px;line-height:1.75;color:rgba(250,255,254,.9)}
.demo{align-self:flex-start;font-family:"JetBrains Mono",monospace;font-size:26px;letter-spacing:.2em;border:2px solid ${C.lime};color:${C.lime};padding:6px 18px;border-radius:10px}
.num{font-family:"JetBrains Mono",monospace;font-size:150px;font-weight:700;color:${C.lime};line-height:1}.num.sm{font-size:56px}
.checks{list-style:none;display:flex;flex-direction:column;gap:26px;font-size:46px}.checks li{display:flex;gap:24px;align-items:center}
.small-checks{font-size:32px;gap:12px}
.tick{flex:none;display:grid;place-items:center;width:58px;height:58px;border-radius:16px;background:${C.lime};color:${C.ink};font-weight:800;font-size:34px}
.small-checks .tick{width:44px;height:44px;font-size:26px;border-radius:12px}
.pill{align-self:flex-start;border:2px solid ${C.line};border-radius:999px;padding:12px 30px;font-size:34px;color:${C.lime}}
.ladder{list-style:none;display:flex;flex-direction:column;gap:18px}
.ladder li{display:flex;align-items:center;gap:28px;border:2px solid ${C.line};border-radius:26px;padding:24px 34px;background:rgba(10,60,54,.55);font-size:42px}
.ladder li.hot{border-color:${C.lime};background:rgba(198,219,98,.12)}
.ladder .idx{font-size:26px;color:${C.mist}}.ladder .name{flex:1;font-weight:700}.ladder .price{color:${C.lime};font-weight:800;unicode-bidi:plaintext}
.card{display:flex;flex-direction:column;gap:18px;border:3px solid ${C.line};border-radius:44px;padding:44px 48px;background:rgba(10,60,54,.7);box-shadow:30px 30px 0 -4px rgba(8,29,24,.6)}
.card.hot{border-color:${C.lime}}
.card-top{display:flex;justify-content:space-between;align-items:center}.card .idx{font-size:28px;color:${C.mist}}
.badge{background:${C.lime};color:${C.ink};font-weight:800;font-size:30px;padding:6px 24px;border-radius:999px}
.price-xl{font-size:80px;font-weight:800;color:${C.lime};unicode-bidi:plaintext;text-align:start}
.card h2{font-size:62px}.card .body{font-size:34px;line-height:1.6}
.delivery{font-size:30px;color:${C.mist};border-top:2px solid ${C.line};padding-top:18px}
.steps{list-style:none;display:flex;flex-direction:column;gap:30px}
.steps li{display:flex;gap:30px;align-items:flex-start;border-bottom:2px solid ${C.line};padding-bottom:26px}
.steps h3{font-size:50px;margin-bottom:6px}.steps p{font-size:38px;line-height:1.6;color:${C.mist}}
.q-mark{font-size:180px;font-weight:800;color:${C.lime};line-height:.8}
.answer{border-right:8px solid ${C.lime};padding-right:32px}
.arrow{font-size:110px;color:${C.lime};line-height:1}
.answer-pill{display:flex;justify-content:space-between;align-items:center;gap:30px;border:3px solid ${C.line};background:rgba(10,60,54,.7);border-radius:999px;padding:30px 50px;font-size:56px;font-weight:800}
.answer-pill.hot{border-color:${C.lime}}.answer-pill b{color:${C.lime};unicode-bidi:plaintext}
.huge{font-family:"Space Grotesk","JetBrains Mono",sans-serif;font-size:300px;font-weight:700;color:${C.lime};line-height:1;text-align:center}
.split{display:grid;grid-template-columns:1fr 1fr;gap:28px}
.col{border:2px solid ${C.line};border-radius:34px;padding:40px;background:rgba(10,60,54,.55)}.col.hot{border-color:${C.lime}}
.col h3{color:${C.lime};margin-bottom:24px}.col ul{list-style:none;display:flex;flex-direction:column;gap:22px;font-size:38px;line-height:1.5}
.phones{display:flex;gap:26px;justify-content:center;margin-top:10px}
.phone{width:290px;height:600px;border-radius:44px;border:10px solid #0c1f1b;overflow:hidden;background:#000;box-shadow:24px 24px 0 -4px rgba(8,29,24,.6)}
.phone img{width:100%;height:100%;object-fit:cover;object-position:top}
.laptop{border-radius:22px;overflow:hidden;border:2px solid ${C.line};box-shadow:30px 30px 0 -4px rgba(8,29,24,.6);background:#0c1f1b}
.laptop .bar{display:flex;align-items:center;gap:10px;padding:14px 20px;font-family:"JetBrains Mono",monospace;font-size:20px;color:${C.mist}}
.laptop .bar i{width:14px;height:14px;border-radius:50%;background:${C.line}}.laptop .bar span{margin-left:18px}
.laptop img{display:block;width:100%}
.poll{display:flex;flex-direction:column;gap:30px;margin-top:30px}
.poll div{border:3px solid ${C.lime};border-radius:40px;padding:44px;font-size:60px;font-weight:800;text-align:center;background:rgba(198,219,98,.08)}
.phone-number{font-family:"Space Grotesk",sans-serif;font-size:110px;font-weight:700;color:${C.lime};text-align:right}
.contacts{font-size:24px;letter-spacing:.12em;color:${C.mist};text-align:right;white-space:nowrap}
`;

function page(body: string) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@600;700&display=block" rel="stylesheet">
<style>${css}</style></head><body>${body}</body></html>`;
}

// ── Screenshots of beer.krd ───────────────────────────────────────

const shots = new Map<string, string>();
function shotSrc(name: string) {
  return shots.get(name) ?? placeholder(name);
}
function placeholder(name: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="780" height="1600"><rect width="100%" height="100%" fill="${C.deep}"/><text x="50%" y="50%" fill="${C.mist}" font-size="40" font-family="monospace" text-anchor="middle">${name}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

async function takeShots(browser: Browser) {
  mkdirSync(SHOTS, { recursive: true });
  const web = process.env.WEB_URL ?? "http://localhost:3000";
  const admin = process.env.ADMIN_URL ?? "http://localhost:3100";
  const save = (name: string, buf: Buffer) => {
    writeFileSync(path.join(SHOTS, `${name}.png`), buf);
    shots.set(name, `data:image/png;base64,${buf.toString("base64")}`);
  };
  try {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const p = await ctx.newPage();
    for (const l of ["ckb", "ar", "en"]) {
      await p.goto(`${web}/${l}`, { waitUntil: "networkidle", timeout: 30_000 });
      await p.waitForTimeout(1200);
      save(`web-${l}`, await p.screenshot());
    }
    await ctx.close();
    console.log("✓ website screenshots");
  } catch (e) {
    console.warn(`! website screenshots skipped (${(e as Error).message.split("\n")[0]})`);
  }
  try {
    const email = process.env.SEED_OWNER_EMAIL;
    const password = process.env.SEED_OWNER_PASSWORD;
    if (!email || !password) throw new Error("SEED_OWNER_* not set");
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 860 },
      deviceScaleFactor: 1.5,
    });
    const p = await ctx.newPage();
    await p.goto(`${admin}/login`, { timeout: 30_000 });
    await p.getByLabel("Email").fill(email);
    await p.getByLabel("Password").fill(password);
    await p.getByRole("button", { name: "Sign in" }).click();
    await p.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 30_000 });
    await p.goto(`${admin}/content/pricing.packages`, { waitUntil: "networkidle" });
    save("admin-pricing", await p.screenshot());
    await ctx.close();
    console.log("✓ admin screenshot");
  } catch (e) {
    console.warn(`! admin screenshot skipped (${(e as Error).message.split("\n")[0]})`);
  }
}

// ── Output ───────────────────────────────────────────────────────

function captionText(p: Post) {
  return [p.caption, p.captionAr, `📩 نامە بنێرە یان واتساپ: ${PHONE}`, TAGS]
    .filter(Boolean)
    .join("\n\n");
}

function captionsMd() {
  const lines = [
    "# December 2026 posts: captions and Reel scripts",
    "",
    "Generated by `pnpm --filter @beer/posts render`. Images are in each post's folder.",
    "",
  ];
  for (const p of posts) {
    lines.push(
      `## ${String(p.n).padStart(2, "0")} · ${p.date} · ${p.format}`,
      "",
      `**About:** ${p.about}  `,
      `**Ads:** ${p.ad}  `,
      `**Images:** \`${folder(p)}/\``,
      "",
    );
    if (p.note) lines.push(`> **Note:** ${p.note}`, "");
    if (p.format !== "Story")
      lines.push("**Caption (copy-paste):**", "", "```", captionText(p), "```", "");
    else lines.push(`**Story:** ${p.caption}`, "");
    if (p.script) {
      lines.push(
        "**Reel script** (9:16, 15–20 s; use a trending sound; on-screen text in Kurdish):",
        "",
        "| Time | What to show | On-screen text | Meaning |",
        "|---|---|---|---|",
      );
      for (const s of p.script) lines.push(`| ${s.time} | ${s.visual} | ${s.text} | ${s.textEn} |`);
      lines.push("", "Use the rendered cover image as the Reel cover.", "");
    }
  }
  return lines.join("\n");
}

const folder = (p: Post) => `${String(p.n).padStart(2, "0")}-${p.slug}`;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function gallery(files: Map<number, string[]>) {
  const cards = posts
    .map((p) => {
      const imgs = (files.get(p.n) ?? [])
        .map((f) => `<img src="${f}" loading="lazy" class="${p.size}">`)
        .join("");
      const script = p.script
        ? `<details><summary>Reel script</summary><ol>${p.script.map((s) => `<li><b>${s.time}</b> ${esc(s.visual)}<br><span dir="rtl">${esc(s.text)}</span> <i>(${esc(s.textEn)})</i></li>`).join("")}</ol></details>`
        : "";
      return `<section><h2>${String(p.n).padStart(2, "0")} · ${p.date} · ${p.format} <small>${esc(p.ad)}</small></h2><p class="about">${esc(p.about)}</p>${p.note ? `<p class="note">${esc(p.note)}</p>` : ""}<div class="imgs">${imgs}</div><pre dir="auto">${esc(p.format === "Story" ? p.caption : captionText(p))}</pre>${script}</section>`;
    })
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Beer Agency · December posts</title>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet">
<style>body{margin:0;background:#042621;color:#FAFFFE;font-family:Vazirmatn,system-ui,sans-serif;padding:24px 16px}main{max-width:1200px;margin:auto}h1{color:#C6DB62}section{border-top:1px solid rgba(250,255,254,.15);padding:28px 0}h2{font-size:20px;margin:0 0 6px}h2 small{color:#C6DB62;font-weight:400;margin-left:8px}.about{color:#A9C4BD;margin:0 0 6px}.note{color:#F2C46D;margin:0 0 10px}.imgs{display:flex;gap:10px;overflow-x:auto;padding-bottom:8px}.imgs img{height:340px;border-radius:10px;flex:none}pre{white-space:pre-wrap;background:#0a3c36;border-radius:10px;padding:14px;font-family:inherit;line-height:1.7}details{margin-top:8px}li{margin:8px 0}i{color:#A9C4BD}</style></head>
<body><main><h1>December 2026 · 20 posts</h1><p>Plan: marketing/2026-12-website-campaign.md · Captions: captions.md</p>${cards}</main></body></html>`;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  await takeShots(browser);
  const files = new Map<number, string[]>();
  let count = 0;
  for (const post of posts) {
    const dir = path.join(OUT, folder(post));
    mkdirSync(dir, { recursive: true });
    const size = SIZES[post.size];
    const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    const list: string[] = [];
    for (const [i, slide] of post.slides.entries()) {
      const html = renderToStaticMarkup(
        <Frame size={post.size} index={i} total={post.slides.length}>
          <SlideView slide={slide} tall={post.size === "tall"} />
        </Frame>,
      );
      await p.setContent(page(html), { waitUntil: "networkidle" });
      await p.evaluate(() => document.fonts.ready);
      const name =
        post.slides.length > 1
          ? `slide-${String(i + 1).padStart(2, "0")}.png`
          : post.format === "Reel"
            ? "cover.png"
            : "post.png";
      await p.screenshot({ path: path.join(dir, name), clip: { x: 0, y: 0, ...size } });
      list.push(`${folder(post)}/${name}`);
      count++;
    }
    files.set(post.n, list);
    await ctx.close();
  }
  await browser.close();
  writeFileSync(path.join(OUT, "captions.md"), captionsMd());
  writeFileSync(path.join(OUT, "index.html"), gallery(files));
  console.log(`✓ ${count} images for ${posts.length} posts → ${OUT}`);
}

await main();
