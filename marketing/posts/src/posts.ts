/**
 * December 2026 campaign: every post's slides, caption and (for Reels) shooting script.
 * Plan and rationale: marketing/2026-12-website-campaign.md
 * Prices come from the website's own package data, so posts and site never disagree.
 */
import { seedBlocks } from "@beer/db/seed-data";

export const PHONE = "0771 881 3535";
export const HANDLE = "@beeragencyy";
export const SITE = "beer.krd";

export const packages = seedBlocks["pricing.packages"].items;

export type Slide =
  | { kind: "hook"; eyebrow?: string; title: string; sub?: string; demo?: boolean }
  | { kind: "reason"; n: number; title: string; body: string }
  | { kind: "list"; title: string; items: string[]; note?: string }
  | { kind: "package"; tier: number }
  | { kind: "ladder"; title: string }
  | { kind: "steps"; title: string; steps: { title: string; body: string }[] }
  | { kind: "qa"; q: string; a: string }
  | { kind: "choice"; q: string; tier: number }
  | { kind: "big"; value: string; title: string; body: string }
  | {
      kind: "split";
      title: string;
      left: { label: string; items: string[] };
      right: { label: string; items: string[] };
    }
  | { kind: "phones"; title: string; sub?: string; shots: string[] }
  | { kind: "screen"; title: string; sub?: string; shot: string }
  | { kind: "poll"; title: string; options: [string, string] }
  | { kind: "cta"; title: string; sub?: string };

export type Scene = { time: string; visual: string; text: string; textEn: string };

export type Post = {
  n: number;
  date: string;
  slug: string;
  format: "Reel" | "Carousel" | "Single image" | "Story";
  /** 4:5 feed post, or 9:16 for Reel covers and Stories */
  size: "feed" | "tall";
  ad: string;
  /** English summary for the team */
  about: string;
  slides: Slide[];
  caption: string;
  captionAr: string;
  script?: Scene[];
  note?: string;
};

const CTA: Slide = {
  kind: "cta",
  title: "نامە بنێرە یان واتساپ",
  sub: "ماڵپەڕ و سیستەم لە $100 تا $5,000",
};

export const TAGS =
  "#ئاژانسی_بیر #ماڵپەڕ #هەولێر #سلێمانی #دهۆک #بزنس #کوردستان #Erbil #Kurdistan #WebDesign #BeerAgency";

const allPosts: Post[] = [
  // ── Week 1: the problem ─────────────────────────────────────────
  {
    n: 1,
    date: "Thu 3 Dec",
    slug: "instagram-is-not-a-website",
    format: "Reel",
    size: "tall",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about:
      "A customer searches Google, finds the competitor's website, and the business that's only on Instagram loses them.",
    slides: [
      {
        kind: "hook",
        eyebrow: "ئاژانسی بیر",
        title: "ئینستاگرامەکەت ماڵپەڕ نییە.",
        sub: "کڕیار لە گووگڵ بەدوای تۆدا دەگەڕێت. دەتدۆزێتەوە؟",
      },
    ],
    caption:
      "کڕیارەکانت پێش ئەوەی بێن، لە گووگڵ بەدوایتدا دەگەڕێن. 🔎\nئەگەر ماڵپەڕت نەبێت، ڕکابەرەکەت دەیانبات.\n\nماڵپەڕێکی سادە و جوان بۆ بزنسەکەت لە ٥ ڕۆژدا، لە $100ـەوە.",
    captionAr: "عملاؤك يبحثون عنك في جوجل قبل أن يأتوا. موقعك جاهز خلال 5 أيام، ابتداءً من 100$.",
    script: [
      {
        time: "0–2s",
        visual: "Close-up of a phone: typing «باشترین کافێ لە هەولێر» into Google.",
        text: "کڕیارێک لە گووگڵ دەگەڕێت…",
        textEn: "A customer searches Google…",
      },
      {
        time: "2–5s",
        visual: "Results: a competitor's website at the top; your café isn't there.",
        text: "ڕکابەرەکەت دەردەکەوێت. تۆ نا.",
        textEn: "Your competitor shows up. You don't.",
      },
      {
        time: "5–9s",
        visual: "They tap the competitor: menu, map, WhatsApp button.",
        text: "مینیو، شوێن، واتساپ… هەمووی لە یەک شوێن.",
        textEn: "Menu, location, WhatsApp… all in one place.",
      },
      {
        time: "9–13s",
        visual: "Cut to an Instagram post full of «نرخ؟» comments and «DM» replies.",
        text: "تۆ هێشتا دەڵێیت: نرخ لە دایرێکت.",
        textEn: "You're still saying: price in DM.",
      },
      {
        time: "13–17s",
        visual: "Beer logo animation, then the phone number.",
        text: "ماڵپەڕەکەت لە ٥ ڕۆژدا · لە $100ـەوە",
        textEn: "Your website in 5 days · from $100",
      },
    ],
  },
  {
    n: 2,
    date: "Fri 4 Dec",
    slug: "5-reasons",
    format: "Carousel",
    size: "feed",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Five reasons a small business needs a website.",
    slides: [
      {
        kind: "hook",
        eyebrow: "٥ هۆکار",
        title: "بۆچی بزنسەکەت پێویستی بە ماڵپەڕە؟",
        sub: "ڕابکێشە بۆ چەپ ←",
      },
      {
        kind: "reason",
        n: 1,
        title: "لە گووگڵ دەتدۆزنەوە",
        body: "کاتێک کەسێک دەنووسێت «سالۆن لە هەولێر»، ماڵپەڕەکەت دەردەکەوێت، نەک تەنها ئینستاگرامەکەت.",
      },
      {
        kind: "reason",
        n: 2,
        title: "متمانە دروست دەکات",
        body: "بزنسێک کە ماڵپەڕی هەیە، پرۆفیشناڵتر دەردەکەوێت و کڕیار زووتر بڕیار دەدات.",
      },
      {
        kind: "reason",
        n: 3,
        title: "٢٤ کاتژمێر کراوەیە",
        body: "نرخ، کاتی کار و شوێنەکەت هەمیشە بەردەستن، تەنانەت کاتێک تۆ وەڵام نادەیتەوە.",
      },
      {
        kind: "reason",
        n: 4,
        title: "دوگمەی واتساپ",
        body: "کڕیار بە یەک کلیک نامەت بۆ دەنێرێت، بێ گەڕان بەدوای ژمارەکەتدا.",
      },
      {
        kind: "reason",
        n: 5,
        title: "خاوەنی کڕیارەکانی خۆتیت",
        body: "ئەلگۆریتمی ئینستاگرام دەگۆڕێت. ماڵپەڕەکەت هی خۆتە و کەس لێت ناسەنێتەوە.",
      },
      CTA,
    ],
    caption:
      "ئینستاگرام باشە، بەڵام بەس نییە. ئەمانە ٥ هۆکارن کە بزنسەکەت ماڵپەڕی پێویستە. 👆\n\nکامیان بۆ تۆ گرنگترە؟ لە کۆمێنتدا بنووسە.",
    captionAr: "إنستغرام جيد لكنه لا يكفي. هذه 5 أسباب تجعل موقعك ضرورياً لعملك.",
  },
  {
    n: 3,
    date: "Sun 6 Dec",
    slug: "before-after",
    format: "Reel",
    size: "tall",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Split screen: the same café with Instagram only, then with a website (demo).",
    slides: [
      {
        kind: "hook",
        eyebrow: "پێش و دوای ماڵپەڕ",
        title: "هەمان کافێ، دوو ئەنجامی جیاواز.",
        demo: true,
      },
    ],
    caption:
      "لای چەپ: تەنها ئینستاگرام، پرسیاری «نرخ؟» و «لە کوێن؟». ☕\nلای ڕاست: ماڵپەڕ، مینیو، شوێن و داواکردن بە واتساپ.\n\nتۆ کامیانی؟ (دیمۆیە، بۆ نموونە دروستکراوە)",
    captionAr: "نفس المقهى، نتيجتان مختلفتان: بدون موقع ومع موقع. (نموذج تجريبي)",
    script: [
      {
        time: "0–2s",
        visual: "Split screen title card.",
        text: "پێش و دوای ماڵپەڕ",
        textEn: "Before and after a website",
      },
      {
        time: "2–7s",
        visual: "LEFT: café Instagram, DMs piling up: «نرخ؟», «لە کوێن؟», «کەی دەکرێنەوە؟».",
        text: "بێ ماڵپەڕ: هەمان پرسیار، ١٠٠ جار",
        textEn: "Without a website: the same questions, 100 times",
      },
      {
        time: "7–13s",
        visual:
          "RIGHT: the demo café site on a phone: menu, prices, map, opening hours, WhatsApp order button.",
        text: "لەگەڵ ماڵپەڕ: هەموو وەڵامەکان لە یەک لینک",
        textEn: "With a website: every answer in one link",
      },
      {
        time: "13–16s",
        visual: "Order arrives on WhatsApp. Small «DEMO» label in the corner throughout.",
        text: "داواکاری ڕاستەوخۆ بە واتساپ",
        textEn: "Orders straight to WhatsApp",
      },
      {
        time: "16–19s",
        visual: "Beer logo, phone number.",
        text: "مینیو و ماڵپەڕ لە $300ـەوە",
        textEn: "Menu sites from $300",
      },
    ],
    note: "Record the café demo site on a phone. Keep the «DEMO» label visible.",
  },
  {
    n: 0,
    date: "Sat 5 Dec · Story only",
    slug: "story-poll",
    format: "Story",
    size: "tall",
    ad: "Not promoted (Story only)",
    about:
      "Extra Story (not one of the 20 posts, not promoted). Reply to everyone who answers «No».",
    slides: [
      { kind: "poll", title: "بزنسەکەت ماڵپەڕی هەیە؟", options: ["بەڵێ ✅", "نەخێر، دەمەوێت 🙋"] },
    ],
    caption: "(Story: add Instagram's poll sticker over the two answer boxes.)",
    captionAr: "",
  },

  // ── Week 2: the offer ───────────────────────────────────────────
  {
    n: 4,
    date: "Mon 7 Dec",
    slug: "100-to-5000",
    format: "Carousel",
    size: "feed",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "All six packages, one slide each, with prices and delivery times.",
    slides: [
      {
        kind: "hook",
        eyebrow: "پاکێجەکان",
        title: "لە $100 تا $5,000",
        sub: "ماڵپەڕ و سیستەم بۆ هەر بزنسێک",
      },
      { kind: "ladder", title: "شەش پاکێج، یەک ستاندارد" },
      ...packages.map((_, i) => ({ kind: "package", tier: i }) as Slide),
      { kind: "cta", title: "نازانیت کامیان؟", sub: "نامەمان بۆ بنێرە، بەخۆڕایی ڕێنماییت دەکەین." },
    ],
    caption:
      "لە ماڵپەڕێکی یەک پەڕەییەوە تا سیستەمێکی تەواو بۆ کۆمپانیاکەت. 🖥️\nهەموو نرخەکان ڕوونن، هیچ پارەیەکی شاراوە نییە.\n\nبۆ پڕۆژە گەورەکان یەکەم ڕاوێژ بەخۆڕاییە.\nهەموو وردەکاری: beer.krd/ckb/pricing",
    captionAr:
      "من موقع بصفحة واحدة إلى نظام متكامل لشركتك، من 100$ إلى 5,000$. الاستشارة الأولى للمشاريع الكبيرة مجانية.",
  },
  {
    n: 5,
    date: "Wed 9 Dec",
    slug: "qr-menu",
    format: "Reel",
    size: "tall",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "QR menu demo: scan, switch language, order on WhatsApp.",
    slides: [
      {
        kind: "hook",
        eyebrow: "بۆ چێشتخانە و کافێ",
        title: "مینیوی QR بۆ چێشتخانەکەت",
        sub: "سکان بکە، بخوێنەوە، بە واتساپ داوا بکە.",
        demo: true,
      },
    ],
    caption:
      "مینیوی کاغەز کۆن دەبێت و نرخەکان دەگۆڕێن. 🍽️\nبە مینیوی QR خۆت نرخ و بەرهەمەکان نوێ دەکەیتەوە، بە ٣ زمان، و کڕیار ڕاستەوخۆ بە واتساپ داوا دەکات.\n\nلە $300ـەوە · ئامادە لە ٧–١٠ ڕۆژدا",
    captionAr:
      "قائمة QR لمطعمك بثلاث لغات، تحدّثها بنفسك، والطلب مباشرة عبر واتساب. ابتداءً من 300$.",
    script: [
      {
        time: "0–2s",
        visual: "Hand scans the QR sticker on a café table.",
        text: "سکان…",
        textEn: "Scan…",
      },
      {
        time: "2–6s",
        visual: "Menu opens on the phone; scroll the categories.",
        text: "مینیوکەت لەسەر مۆبایلی کڕیار",
        textEn: "Your menu on the customer's phone",
      },
      {
        time: "6–9s",
        visual: "Tap the language switch: Kurdish → Arabic → English.",
        text: "کوردی · عەرەبی · ئینگلیزی",
        textEn: "Kurdish · Arabic · English",
      },
      {
        time: "9–13s",
        visual: "Add two items, tap «Order on WhatsApp», the message opens pre-filled.",
        text: "داواکردن بە یەک کلیک",
        textEn: "Order in one tap",
      },
      {
        time: "13–16s",
        visual: "Owner changes a price in the admin panel; it updates on the menu.",
        text: "نرخەکان خۆت دەگۆڕیت",
        textEn: "You change the prices yourself",
      },
      { time: "16–18s", visual: "Beer logo + number.", text: "لە $300ـەوە", textEn: "From $300" },
    ],
    note: "Needs the café QR-menu demo.",
  },
  {
    n: 6,
    date: "Thu 10 Dec",
    slug: "what-100-gets-you",
    format: "Single image",
    size: "feed",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Checklist of the $100 Starter package.",
    slides: [
      {
        kind: "list",
        title: "بە $100 چی وەردەگریت؟",
        items: [
          "ماڵپەڕێکی یەک پەڕەیی، گونجاو بۆ مۆبایل",
          "دوگمەی واتساپ و پەیوەندی",
          "شوێنەکەت لەسەر نەخشەی گووگڵ",
          "بەستەری سۆشیال میدیا",
          "ئامادە لە ٥ ڕۆژدا",
        ],
        note: "پاکێجی دەستپێک · $100 – $150",
      },
    ],
    caption:
      "گەورەترین هەنگاو، یەکەم هەنگاوە. ✅\nبە $100 بزنسەکەت لەسەر ئینتەرنێت دەبێت، بە ماڵپەڕێکی جوان کە خەڵک دەتدۆزنەوە و پەیوەندیت پێوە دەکەن.",
    captionAr: "بـ 100$ يصبح لعملك موقع جميل يجدك من خلاله الناس ويتواصلون معك، جاهز خلال 5 أيام.",
  },
  {
    n: 7,
    date: "Sat 12 Dec",
    slug: "whatsapp-booking",
    format: "Reel",
    size: "tall",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Salon/clinic demo: services, prices, «Book on WhatsApp».",
    slides: [
      {
        kind: "hook",
        eyebrow: "بۆ سالۆن و کلینیک",
        title: "نۆرە گرتن بە واتساپ",
        sub: "ڕاستەوخۆ لە ماڵپەڕەکەتەوە.",
        demo: true,
      },
    ],
    caption:
      "کڕیار خزمەتگوزارییەکان و نرخەکان دەبینێت، کاتێک هەڵدەبژێرێت و بە یەک کلیک نۆرە دەگرێت. 💇‍♀️\nتۆش هەموو نۆرەکان لە واتساپ وەردەگریت.\n\nماڵپەڕی بزنس لە $250ـەوە",
    captionAr: "حجز المواعيد عبر واتساب مباشرة من موقعك. مواقع الأعمال ابتداءً من 250$.",
    script: [
      {
        time: "0–3s",
        visual: "Salon demo site opens on a phone: hero photo, services list.",
        text: "سالۆنەکەت لەسەر ئینتەرنێت",
        textEn: "Your salon, online",
      },
      {
        time: "3–7s",
        visual: "Scroll services and prices.",
        text: "خزمەتگوزاری و نرخ، ڕوون",
        textEn: "Services and prices, clear",
      },
      {
        time: "7–11s",
        visual: "Tap «Book on WhatsApp»; message pre-filled with service and day.",
        text: "نۆرە بە یەک کلیک",
        textEn: "Book in one tap",
      },
      {
        time: "11–14s",
        visual: "Owner's phone receives the booking message.",
        text: "نۆرەکان دەگەنە واتساپەکەت",
        textEn: "Bookings land in your WhatsApp",
      },
      { time: "14–16s", visual: "Beer logo + number.", text: "لە $250ـەوە", textEn: "From $250" },
    ],
    note: "Needs the salon/clinic demo.",
  },
  {
    n: 8,
    date: "Sun 13 Dec",
    slug: "control-it-yourself",
    format: "Reel",
    size: "tall",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "The Pro tier: the admin panel. Change a price and it's live instantly.",
    slides: [
      {
        kind: "screen",
        title: "ماڵپەڕێک کە خۆت کۆنترۆڵی دەکەیت",
        sub: "پانێڵی بەڕێوەبردن · لە $800ـەوە",
        shot: "admin-pricing",
      },
    ],
    caption:
      "چیتر پێویست ناکات بۆ هەر گۆڕانکارییەک چاوەڕێی کەس بکەیت. 🎛️\nلە پاکێجی پرۆدا پانێڵی بەڕێوەبردنت هەیە: نرخ، وێنە، دەق و داواکارییەکانی کڕیار، هەمووی خۆت.\n\nهەر بەم پانێڵەی ماڵپەڕی خۆمان بەڕێوە دەبەین.",
    captionAr:
      "موقع تتحكم فيه بنفسك: الأسعار والصور والنصوص وطلبات العملاء. باقة احترافي ابتداءً من 800$.",
    script: [
      {
        time: "0–3s",
        visual: "Screen recording: sign in to admin.beer.krd.",
        text: "پانێڵی بەڕێوەبردن",
        textEn: "Your admin panel",
      },
      {
        time: "3–8s",
        visual: "Open Page content → Pricing, change a package price, press Save.",
        text: "نرخێک دەگۆڕیت…",
        textEn: "You change a price…",
      },
      {
        time: "8–11s",
        visual: "Switch to the website on a phone; the new price is already there.",
        text: "…و یەکسەر لەسەر ماڵپەڕەکەیە",
        textEn: "…and it's live instantly",
      },
      {
        time: "11–15s",
        visual: "Leads inbox: a new message from the contact form.",
        text: "داواکارییەکانی کڕیار لە یەک شوێن",
        textEn: "Customer requests in one place",
      },
      {
        time: "15–17s",
        visual: "Beer logo + number.",
        text: "پرۆ · لە $800ـەوە",
        textEn: "Pro · from $800",
      },
    ],
    note: "Record the real beer.krd admin (hide lead names/phones before posting).",
  },

  // ── Week 3: bigger projects, trust and objections ───────────────
  {
    n: 10,
    date: "Wed 16 Dec",
    slug: "your-own-domain",
    format: "Carousel",
    size: "feed",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Your business's own name on the internet: a .com domain instead of an Instagram link.",
    slides: [
      {
        kind: "hook",
        eyebrow: "دۆمەین",
        title: "ناوی بزنسەکەت لەسەر ئینتەرنێت",
        sub: "ناوێکی تایبەت متمانە دروست دەکات.",
      },
      {
        kind: "split",
        title: "جیاوازییەکە",
        left: {
          label: "ئێستا",
          items: ["instagram.com/…_official2", "ژمارەی تەلەفۆن لە بایۆ", "«نرخ لە دایرێکت»"],
        },
        right: {
          label: "دوای ماڵپەڕ",
          items: ["yourbusiness.com", "info@yourbusiness.com", "هەموو زانیارییەک لە یەک لینک"],
        },
      },
      {
        kind: "list",
        title: "دۆمەینی تایبەت چی پێدەدات؟",
        items: [
          "ناوێک کە بە ئاسانی لەبیر دەمێنێت",
          "ئیمەیڵی پرۆفیشناڵ بە ناوی بزنسەکەت",
          "متمانەی زیاتر لە کڕیاران",
          "هی خۆتە، نەک هی پلاتفۆرمێک",
        ],
      },
      CTA,
    ],
    caption:
      "کڕیار «yourbusiness.com» زۆر ئاسانتر لەبیر دەمێنێت وەک ئەکاونتێکی ئینستاگرام. 🌐\nلەگەڵ هەموو ماڵپەڕێک، دۆمەینێک بە ناوی بزنسەکەت بۆت ڕێک دەخەین.",
    captionAr: "اسم نطاق خاص باسم عملك يبني الثقة ويسهل تذكّره. نجهّزه لك مع كل موقع.",
  },
  {
    n: 9,
    date: "Tue 15 Dec",
    slug: "process",
    format: "Carousel",
    size: "feed",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "The four-step process, from first message to launch.",
    slides: [
      {
        kind: "hook",
        eyebrow: "ڕێگای کارکردنمان",
        title: "لە نامەیەکەوە تا ماڵپەڕێکی ئامادە",
        sub: "چوار هەنگاو، بێ سەرئێشە.",
      },
      {
        kind: "steps",
        title: "چۆن کار دەکەین",
        steps: [
          { title: "ناسین", body: "نامەیەک دەنێریت، ١٥ خولەک قسە دەکەین." },
          { title: "ستراتیژی", body: "پلان و نرخێکی ڕوون و نووسراوت بۆ دەنێرین." },
          { title: "دروستکردن", body: "دیزاین و دروستی دەکەین، تۆ وەشانی یەکەم دەبینیت." },
          { title: "گەشەکردن", body: "ماڵپەڕەکەت بڵاو دەبێتەوە و پشتگیریت دەکەین." },
        ],
      },
      {
        kind: "big",
        value: "٧ ڕۆژ",
        title: "ماڵپەڕی بچووک",
        body: "سیستەم و فرۆشگا چەند هەفتەیەک دەخایەنن، بە پیشاندانی هەر قۆناغێک.",
      },
      CTA,
    ],
    caption:
      "زۆر کەس دەترسن کە دروستکردنی ماڵپەڕ قورس و درێژ بێت. 🧭\nلای ئێمە چوار هەنگاوە، و تۆ تەنها لە هەنگاوی یەکەم و سێیەمدا پێویستیت پێیە.",
    captionAr:
      "من رسالة واحدة إلى موقع جاهز في أربع خطوات واضحة. المواقع الصغيرة جاهزة خلال حوالي 7 أيام.",
  },
  {
    n: 11,
    date: "Fri 18 Dec",
    slug: "online-store",
    format: "Reel",
    size: "tall",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Online-store demo: products, cart, order, orders dashboard.",
    slides: [
      {
        kind: "hook",
        eyebrow: "فرۆشگای ئۆنلاین",
        title: "فرۆشگای خۆت، بێ کۆمیشن",
        sub: "واز لە وەرگرتنی داواکاری لە دایرێکت بهێنە.",
        demo: true,
      },
    ],
    caption:
      "داواکاری لە دایرێکت ون دەبێت، نرخ دووبارە دەپرسرێت و هیچ ڕاپۆرتێکت نییە. 🛒\nفرۆشگای ئۆنلاینی خۆت: بەرهەم، سەبەتە، داواکاری، ناوچەکانی گەیاندن و داشبۆردێک بۆ هەمووی.\n\nلە $1,500ـەوە · ڕاوێژی یەکەم بەخۆڕایی",
    captionAr:
      "متجرك الإلكتروني الخاص بدون عمولة: منتجات، سلة، طلبات، مناطق توصيل ولوحة تحكم. ابتداءً من 1,500$.",
    script: [
      {
        time: "0–3s",
        visual: "Messy Instagram DMs with orders.",
        text: "هێشتا داواکاری لە دایرێکت وەردەگریت؟",
        textEn: "Still taking orders in DMs?",
      },
      {
        time: "3–7s",
        visual: "Store demo: browse products, open one.",
        text: "فرۆشگای خۆت",
        textEn: "Your own store",
      },
      {
        time: "7–10s",
        visual: "Add to cart, checkout with delivery zone, cash on delivery.",
        text: "سەبەتە و گەیاندن",
        textEn: "Cart and delivery",
      },
      {
        time: "10–14s",
        visual: "Orders dashboard: new order appears with status.",
        text: "هەموو داواکارییەکان لە داشبۆردێکدا",
        textEn: "Every order in one dashboard",
      },
      {
        time: "14–16s",
        visual: "Beer logo + number.",
        text: "لە $1,500ـەوە · بێ کۆمیشن",
        textEn: "From $1,500 · no commission",
      },
    ],
    note: "Needs the online-store demo.",
  },
  {
    n: 12,
    date: "Sat 19 Dec",
    slug: "is-it-expensive",
    format: "Reel",
    size: "tall",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Objection: are websites expensive? $150 a year is about $0.40 a day.",
    slides: [
      {
        kind: "big",
        value: "$0.40",
        title: "ماڵپەڕ گرانە؟",
        body: "ماڵپەڕێکی $150 بۆ ساڵێک، ڕۆژانە کەمتر لە چایەک تێدەچێت.",
      },
    ],
    caption:
      "با بە ژمارە قسە بکەین. 🧮\n$150 بۆ ساڵێک = نزیکەی $0.40 بۆ ڕۆژێک.\nیەک کڕیاری نوێ لە مانگێکدا، تێچووی تەواوی ماڵپەڕەکە دەداتەوە.",
    captionAr: "هل المواقع غالية؟ موقع بـ 150$ للسنة يكلّف حوالي 0.40$ يومياً، أقل من كوب شاي.",
    script: [
      {
        time: "0–2s",
        visual: "Presenter (or text on screen) asks the question.",
        text: "ماڵپەڕ گرانە؟",
        textEn: "Are websites expensive?",
      },
      {
        time: "2–6s",
        visual: "Animated sum: $150 ÷ 365.",
        text: "$150 ÷ ٣٦٥ ڕۆژ",
        textEn: "$150 ÷ 365 days",
      },
      {
        time: "6–9s",
        visual: "Result appears next to a glass of tea.",
        text: "= $0.40 ڕۆژانە",
        textEn: "= $0.40 a day",
      },
      {
        time: "9–13s",
        visual: "One new customer a month, shown as a notification.",
        text: "یەک کڕیاری نوێ، تێچووەکەی دەداتەوە",
        textEn: "One new customer pays for it",
      },
      { time: "13–15s", visual: "Beer logo + number.", text: "لە $100ـەوە", textEn: "From $100" },
    ],
  },
  {
    n: 13,
    date: "Mon 21 Dec",
    slug: "faq",
    format: "Carousel",
    size: "feed",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Common questions: domain, languages, editing, support, paying in stages.",
    slides: [
      {
        kind: "hook",
        eyebrow: "پرسیار و وەڵام",
        title: "پرسیارە باوەکان",
        sub: "ئەوەی هەمووان دەیپرسن، لێرە وەڵامی دەدەینەوە.",
      },
      {
        kind: "qa",
        q: "دۆمەین و هۆستینگ چی؟",
        a: "پێش دەستپێکردن پێت دەڵێین چی لەناو نرخەکەدایە و نوێکردنەوەی ساڵانە چەندە. هیچ پارەیەکی شاراوە نییە.",
      },
      {
        kind: "qa",
        q: "بە کوردی، عەرەبی و ئینگلیزی دەبێت؟",
        a: "بەڵێ، تا ٣ زمان. کوردی و عەرەبی بە دروستی لە ڕاستەوە بۆ چەپ پیشان دەدرێن.",
      },
      {
        kind: "qa",
        q: "دەتوانم خۆم دەستکاری بکەم؟",
        a: "لە پاکێجی مینیو، پرۆ و سەرووتر پانێڵی بەڕێوەبردنت هەیە و هەموو شتێک خۆت دەگۆڕیت.",
      },
      {
        kind: "qa",
        q: "دوای بڵاوکردنەوە کێ پشتگیریم دەکات؟",
        a: "ئێمە. پلانی پشتگیری مانگانە یان ساڵانەمان هەیە بۆ پاراستن و نوێکردنەوە.",
      },
      {
        kind: "qa",
        q: "دەتوانم بە قۆناغ پارە بدەم؟",
        a: "بەڵێ، بۆ پڕۆژە گەورەکان: ٤٠٪ لە دەستپێک، ٤٠٪ کاتی پیشاندان، ٢٠٪ کاتی بڵاوکردنەوە.",
      },
      CTA,
    ],
    caption: "پرسیارێکی ترت هەیە؟ لە کۆمێنت یان نامەدا بینووسە، وەڵامت دەدەینەوە. 💬",
    captionAr:
      "أسئلة شائعة عن المواقع: النطاق والاستضافة، اللغات، التعديل، الدعم، والدفع على مراحل.",
  },
  {
    n: 14,
    date: "Tue 22 Dec",
    slug: "we-built-our-own",
    format: "Reel",
    size: "tall",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Behind the scenes: beer.krd in Kurdish, Arabic and English, plus the admin panel.",
    slides: [
      {
        kind: "phones",
        title: "ماڵپەڕی خۆمان بە ٣ زمان دروستکرد",
        sub: "beer.krd · کوردی · العربية · English",
        shots: ["web-ckb", "web-ar", "web-en"],
      },
    ],
    caption:
      "پێش ئەوەی بۆ کەسی تر دروستی بکەین، بۆ خۆمان دروستمان کرد. 🛠️\nbeer.krd بە کوردی، عەرەبی و ئینگلیزی، لەگەڵ پانێڵی بەڕێوەبردن و سندوقی داواکارییەکان.\n\nسەردانی بکە: beer.krd",
    captionAr: "بنينا موقعنا بثلاث لغات مع لوحة تحكم كاملة. هذا ما نصنعه لعملائنا أيضاً.",
    script: [
      {
        time: "0–3s",
        visual: "Time-lapse of code / design on screen.",
        text: "ماڵپەڕی خۆمان",
        textEn: "Our own website",
      },
      {
        time: "3–7s",
        visual: "beer.krd on a phone; tap the language switch ckb → ar → en.",
        text: "٣ زمان، ڕاست بۆ چەپ و چەپ بۆ ڕاست",
        textEn: "3 languages, RTL and LTR",
      },
      {
        time: "7–11s",
        visual: "Admin panel: content editor with Kurdish/English/Arabic tabs.",
        text: "پانێڵی بەڕێوەبردن",
        textEn: "Admin panel",
      },
      {
        time: "11–14s",
        visual: "Leads inbox + pricing page.",
        text: "ئەمە ئەوەیە کە بۆ تۆش دروستی دەکەین",
        textEn: "This is what we build for you too",
      },
      { time: "14–16s", visual: "Beer logo + beer.krd.", text: "beer.krd", textEn: "beer.krd" },
    ],
  },

  // ── Week 4: systems, urgency, 2027 ──────────────────────────────
  {
    n: 15,
    date: "Thu 24 Dec",
    slug: "custom-systems",
    format: "Carousel",
    size: "feed",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Custom systems: booking, delivery dashboards, staff panels, reports.",
    slides: [
      {
        kind: "hook",
        eyebrow: "بۆ کۆمپانیاکان",
        title: "سیستەمی تایبەت بۆ کۆمپانیاکەت",
        sub: "کارەکانت لە ئێکسڵ و واتساپەوە بگوازەرەوە بۆ یەک سیستەم.",
      },
      {
        kind: "reason",
        n: 1,
        title: "نۆرەگرتن بۆ کلینیک و سالۆن",
        body: "نۆرەی ئۆنلاین، ئاگادارکردنەوە و لیستی ڕۆژانە بۆ هەر لقێک.",
      },
      {
        kind: "reason",
        n: 2,
        title: "داشبۆردی گەیاندن",
        body: "داواکاری، شۆفێر و ناوچەکان، هەمووی لە یەک شاشەدا.",
      },
      {
        kind: "reason",
        n: 3,
        title: "پانێڵی کارمەندان",
        body: "ئەرک، دەسەڵات و ڕاپۆرتی ڕۆژانە بۆ هەر کارمەندێک.",
      },
      {
        kind: "reason",
        n: 4,
        title: "ڕاپۆرت و ئامار",
        body: "فرۆشتن، کڕیار و گەشە، بە ژمارەی ڕوون و نەخشەی ئاسان.",
      },
      { kind: "cta", title: "لە $3,000ـەوە", sub: "یەکەم ڕاوێژ بەخۆڕاییە · نامە بنێرە" },
    ],
    caption:
      "ئەگەر کۆمپانیاکەت هێشتا بە ئێکسڵ و گرووپی واتساپ بەڕێوە دەچێت، کاتی سیستەمە. ⚙️\nسیستەمێک کە بە تایبەتی بۆ شێوازی کارکردنی تۆ دروست دەکرێت.\n\nلە دیسەمبەردا ڕاوێژی یەکەم بەخۆڕاییە.",
    captionAr:
      "نظام مخصّص لشركتك: حجوزات، لوحات توصيل، لوحات للموظفين وتقارير. ابتداءً من 3,000$، والاستشارة الأولى مجانية.",
  },
  {
    n: 16,
    date: "Fri 25 Dec",
    slug: "10-places",
    format: "Single image",
    size: "feed",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Only 10 places in December for packages 1–3; free consultation for 4–6.",
    slides: [
      {
        kind: "big",
        value: "١٠",
        title: "تەنها ١٠ شوێن بۆ دیسەمبەر",
        body: "نرخی ئێستا بۆ پاکێجەکانی دەستپێک، بزنس و مینیو. بۆ پڕۆژە گەورەکان: ڕاوێژی بەخۆڕایی، دەستپێک لە ٢٠٢٧.",
      },
    ],
    caption:
      "بۆ ئەوەی هەر پڕۆژەیەک بە کوالیتی تەواو بێت، لە دیسەمبەردا تەنها ١٠ ماڵپەڕ وەردەگرین. ⏳\nشوێنی ماوە: [X] (update daily in Stories)",
    captionAr:
      "فقط 10 أماكن في ديسمبر للباقات الصغيرة. للمشاريع الكبيرة: استشارة مجانية والبدء في 2027.",
    note: "Keep the number honest: update «[X] places left» in the caption and Stories.",
  },
  {
    n: 17,
    date: "Sun 27 Dec",
    slug: "case-study",
    format: "Carousel",
    size: "feed",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Case study. Uses beer.krd itself; swap in a December client if one agrees.",
    slides: [
      {
        kind: "hook",
        eyebrow: "پڕۆژەی یەکەم",
        title: "یەکەم کڕیارمان: خۆمان",
        sub: "چۆن beer.krd مان دروست کرد.",
      },
      {
        kind: "split",
        title: "پێویستی و ئەنجام",
        left: {
          label: "پێویستی",
          items: ["ماڵپەڕ بە ٣ زمان", "گۆڕینی ناوەڕۆک بێ پرۆگرامەر", "وەرگرتنی داواکاری کڕیار"],
        },
        right: {
          label: "ئەنجام",
          items: [
            "کوردی، عەرەبی، ئینگلیزی",
            "پانێڵی بەڕێوەبردن",
            "سندوقی داواکاری + ئاگادارکردنەوە",
          ],
        },
      },
      {
        kind: "phones",
        title: "beer.krd",
        sub: "سەر مۆبایل، بە هەر سێ زمان",
        shots: ["web-ckb", "web-ar", "web-en"],
      },
      {
        kind: "screen",
        title: "پانێڵی بەڕێوەبردن",
        sub: "هەموو دەق و نرخێک لێرەوە دەگۆڕدرێت",
        shot: "admin-pricing",
      },
      CTA,
    ],
    caption:
      "باشترین بەڵگە ئەوەیە کە بۆ خۆمان دروستمان کرد. 📐\nbeer.krd: ٣ زمان، پانێڵی بەڕێوەبردن و سندوقی داواکاری، هەمان ئەوەی بۆ تۆی دروست دەکەین.",
    captionAr: "أفضل دليل: موقعنا الذي بنيناه لأنفسنا بثلاث لغات مع لوحة تحكم وصندوق طلبات.",
    note: "If a December client agrees, replace the slides with their before/after and a short quote.",
  },
  {
    n: 18,
    date: "Mon 28 Dec",
    slug: "start-2027",
    format: "Reel",
    size: "tall",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Fast montage of all the demos with a 2027 countdown.",
    slides: [
      {
        kind: "hook",
        eyebrow: "٢٠٢٧",
        title: "ساڵی نوێ بە ماڵپەڕەوە دەست پێبکە",
        sub: "هێشتا کات ماوە، بەڵام شوێن کەمە.",
      },
    ],
    caption:
      "ساڵی نوێ، دەستپێکی نوێ. 🎆\nبا ٢٠٢٧ ئەو ساڵە بێت کە بزنسەکەت لەسەر ئینتەرنێت دەبینرێت.\n\nلە $100 تا $5,000 · نامە بنێرە",
    captionAr: "ابدأ 2027 بموقع لعملك. من 100$ إلى 5,000$.",
    script: [
      {
        time: "0–2s",
        visual: "Countdown 5…4…3 over dark green.",
        text: "٢٠٢٧ نزیکە…",
        textEn: "2027 is coming…",
      },
      {
        time: "2–9s",
        visual: "Fast cuts (1s each): menu demo, salon demo, admin panel, store demo, beer.krd.",
        text: "مینیو · نۆرەگرتن · پانێڵ · فرۆشگا",
        textEn: "Menu · booking · panel · store",
      },
      {
        time: "9–12s",
        visual: "«2027» appears with the B mark.",
        text: "ساڵی نوێ بە ماڵپەڕەوە دەست پێبکە",
        textEn: "Start the new year with a website",
      },
      {
        time: "12–15s",
        visual: "Beer logo + number.",
        text: "لە $100 تا $5,000",
        textEn: "From $100 to $5,000",
      },
    ],
  },
  {
    n: 19,
    date: "Wed 30 Dec",
    slug: "which-package",
    format: "Carousel",
    size: "feed",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Decision guide: which package fits which business.",
    slides: [
      {
        kind: "hook",
        eyebrow: "ڕێنمایی",
        title: "بزنسەکەت کام پاکێجی پێویستە؟",
        sub: "وەڵامی ئەم پرسیارانە بدەرەوە.",
      },
      { kind: "choice", q: "تەنها دەتەوێت بتدۆزنەوە و پەیوەندیت پێوە بکەن؟", tier: 0 },
      { kind: "choice", q: "چەند پەڕەیەکت دەوێت بۆ ناساندنی کارەکەت؟", tier: 1 },
      { kind: "choice", q: "چێشتخانە یان دووکانیت و مینیو یان کەتەلۆگت دەوێت؟", tier: 2 },
      { kind: "choice", q: "دەتەوێت هەموو شتێک خۆت بگۆڕیت؟", tier: 3 },
      { kind: "choice", q: "بە ئۆنلاین دەفرۆشیت؟", tier: 4 },
      { kind: "choice", q: "کارمەند و لقت هەیە؟", tier: 5 },
      CTA,
    ],
    caption: "هێشتا دڵنیا نیت؟ تەنها بنووسە «کامیان؟» و یارمەتیت دەدەین. 🤝",
    captionAr: "أي باقة تناسب عملك؟ أجب عن هذه الأسئلة، أو راسلنا وسنساعدك مجاناً.",
  },
  {
    n: 20,
    date: "Thu 31 Dec",
    slug: "last-day",
    format: "Single image",
    size: "feed",
    ad: "Auto-promoted (≈$5 while it's the newest post)",
    about: "Last day for December prices. Also share it to your Story.",
    slides: [
      {
        kind: "hook",
        eyebrow: "دوایین ڕۆژ",
        title: "ئەمڕۆ دوایین ڕۆژی نرخی دیسەمبەرە",
        sub: "شوێنی ماوە: [X] · نامە بنێرە 👇",
      },
    ],
    caption: "ئەمڕۆ دوایین ڕۆژە. ⏰ ئەگەر بڕیارت داوە، ئێستا نامە بنێرە.",
    captionAr: "اليوم آخر يوم لأسعار ديسمبر. راسلنا الآن.",
    note: "Replace [X] with the real number before rendering or posting. When sharing to Stories, add a «Message» sticker.",
  },
];

/** Posting order: the 20 feed posts by number, with the extra Story (n = 0) after post 2. */
export const posts: Post[] = [...allPosts].sort((a, b) => (a.n || 2.5) - (b.n || 2.5));
