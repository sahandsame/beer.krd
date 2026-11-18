import type { Localized } from "@beer/i18n";
import type { SiteSettings } from "@beer/validators";
import type { BlockDataMap } from "./content";

const L = (ckb: string, en: string, ar: string): Localized => ({ ckb, en, ar });

export const seedServices = [
  {
    slug: "web-software",
    icon: "code",
    sort: 10,
    name: L(
      "ماڵپەڕ، سیستەم و نەرمەکاڵا",
      "Websites, Systems & Software",
      "المواقع والأنظمة والبرمجيات",
    ),
    summary: L(
      "ماڵپەڕی خێرا، سیستەمی تایبەت و ئەپڵیکەیشن کە کارەکانت ئاسان دەکەن.",
      "Fast websites, custom systems and apps that make your business run smoother.",
      "مواقع سريعة وأنظمة مخصّصة وتطبيقات تجعل عملك أسهل.",
    ),
    body: L(
      "لە ماڵپەڕی ناساندنەوە تا سیستەمی بەڕێوەبردن و فرۆشتنی ئۆنلاین، نەرمەکاڵا دروست دەکەین کە خێرا، پارێزراو و ئاسان بۆ بەکارهێنانن. هەموو پڕۆژەیەک بۆ مۆبایل ئامادەیە و دەتوانێت بە کوردی، عەرەبی و ئینگلیزی کار بکات.",
      "From company websites to management systems and online stores, we build software that is fast, secure and easy to use. Every project is mobile-ready and can ship in Kurdish, Arabic and English.",
      "من المواقع التعريفية إلى أنظمة الإدارة والمتاجر الإلكترونية، نبني برمجيات سريعة وآمنة وسهلة الاستخدام. كل مشروع متوافق مع الجوال ويدعم الكردية والعربية والإنجليزية.",
    ),
    deliverables: L(
      "ماڵپەڕی کۆمپانیا\nفرۆشگای ئۆنلاین\nسیستەمی بەڕێوەبردن و داشبۆرد\nئەپی مۆبایل و وێب\nهۆستینگ و چاککردنەوە",
      "Company websites\nOnline stores\nManagement systems & dashboards\nWeb & mobile apps\nHosting & maintenance",
      "مواقع الشركات\nالمتاجر الإلكترونية\nأنظمة الإدارة ولوحات التحكم\nتطبيقات الويب والجوال\nالاستضافة والصيانة",
    ),
  },
  {
    slug: "social-media",
    icon: "megaphone",
    sort: 20,
    name: L("بەڕێوەبردنی سۆشیال میدیا", "Social Media Management", "إدارة وسائل التواصل الاجتماعي"),
    summary: L(
      "ناوەڕۆکی بەردەوام و داهێنەرانە کە جەماوەرەکەت دەکاتە کڕیار.",
      "Consistent, creative content that turns your audience into customers.",
      "محتوى مستمر ومبدع يحوّل جمهورك إلى عملاء.",
    ),
    body: L(
      "پلانی ناوەڕۆک دادەنێین، پۆست و ڕیڵز دروست دەکەین، بڵاویان دەکەینەوە و وەڵامی کۆمێنت و نامەکان دەدەینەوە. هەر مانگێک ڕاپۆرتێکی ڕوون وەردەگریت لەسەر گەشە و ئەنجامەکان.",
      "We plan your content calendar, create posts and reels, publish them and manage comments and messages. Every month you get a clear report on growth and results.",
      "نخطّط تقويم المحتوى، ونصنع المنشورات والريلز، وننشرها، وندير التعليقات والرسائل. وتحصل كل شهر على تقرير واضح عن النمو والنتائج.",
    ),
    deliverables: L(
      "پلانی ناوەڕۆکی مانگانە\nدیزاینی پۆست و ستۆری\nڕیڵز و ڤیدیۆی کورت\nبەڕێوەبردنی کۆمێنت و نامە\nڕاپۆرتی مانگانە",
      "Monthly content calendar\nPost & story design\nReels & short video\nComment & inbox management\nMonthly reporting",
      "تقويم محتوى شهري\nتصميم المنشورات والستوري\nريلز وفيديوهات قصيرة\nإدارة التعليقات والرسائل\nتقارير شهرية",
    ),
  },
  {
    slug: "branding",
    icon: "palette",
    sort: 30,
    name: L("براندینگ و دیزاین", "Branding & Design", "الهوية التجارية والتصميم"),
    summary: L(
      "ناسنامەیەکی بینراو کە لە بیر ناچێتەوە.",
      "A visual identity people remember.",
      "هوية بصرية لا تُنسى.",
    ),
    body: L(
      "لۆگۆ، ڕەنگ، فۆنت و ڕێنمایی براند دروست دەکەین کە کەسایەتی کارەکەت دەردەخات و لە هەموو شوێنێک یەکگرتوو دەبێت، لە کارتی بزنسەوە تا تابلۆ و پاکێجینگ.",
      "We craft logos, colour palettes, typography and brand guidelines that express your personality — consistently, from business cards to signage and packaging.",
      "نصمّم الشعارات والألوان والخطوط ودليل الهوية بما يعكس شخصية علامتك، بشكل متناسق من بطاقات العمل إلى اللافتات والتغليف.",
    ),
    deliverables: L(
      "لۆگۆ و ناسنامەی بینراو\nڕێنمایی براند\nدیزاینی چاپ و تابلۆ\nپاکێجینگ\nتەمپلەیتی سۆشیال میدیا",
      "Logo & visual identity\nBrand guidelines\nPrint & signage\nPackaging\nSocial media templates",
      "الشعار والهوية البصرية\nدليل الهوية\nالمطبوعات واللافتات\nالتغليف\nقوالب وسائل التواصل",
    ),
  },
  {
    slug: "paid-ads",
    icon: "target",
    sort: 40,
    name: L("ڕیکلامی پارەدار", "Paid Advertising", "الإعلانات المموّلة"),
    summary: L(
      "ڕیکلامی ئامانجدار لە مێتا، گووگڵ و تیکتۆک کە بودجەکەت بە فیڕۆ نادات.",
      "Targeted Meta, Google and TikTok campaigns that don't waste your budget.",
      "حملات موجّهة على ميتا وجوجل وتيك توك لا تهدر ميزانيتك.",
    ),
    body: L(
      "کەمپەینەکان بە وردی ئامانج دەکەین، ڕیکلامەکان تاقی دەکەینەوە و بودجە بەرەو ئەو ڕیکلامانە دەبەین کە باشترین ئەنجام دەدەن. هەموو دینارێک دەپێورێت.",
      "We target campaigns precisely, test creatives and move budget toward what performs best. Every dinar is measured.",
      "نستهدف الحملات بدقة، ونختبر الإعلانات، ونوجّه الميزانية نحو الأفضل أداءً. كل دينار يُقاس.",
    ),
    deliverables: L(
      "ڕیکلامی فەیسبووک و ئینستاگرام\nڕیکلامی گووگڵ\nڕیکلامی تیکتۆک\nپیکسڵ و بەدواداچوونی گۆڕانکاری\nڕاپۆرتی ئەنجام",
      "Facebook & Instagram ads\nGoogle Ads\nTikTok ads\nPixel & conversion tracking\nPerformance reports",
      "إعلانات فيسبوك وإنستغرام\nإعلانات جوجل\nإعلانات تيك توك\nالبكسل وتتبّع التحويلات\nتقارير الأداء",
    ),
  },
  {
    slug: "photo-video",
    icon: "camera",
    sort: 50,
    name: L("بەرهەمهێنانی وێنە و ڤیدیۆ", "Photo & Video Production", "إنتاج الصور والفيديو"),
    summary: L(
      "وێنە و ڤیدیۆی پرۆفیشناڵ کە چیرۆکی براندەکەت دەگێڕنەوە.",
      "Professional photo and video that tells your brand's story.",
      "صور وفيديوهات احترافية تروي قصة علامتك.",
    ),
    body: L(
      "لە وێنەگرتنی بەرهەم و خواردنەوە تا ڤیدیۆی ڕیکلام و ڕیڵز، هەموو قۆناغەکان بەڕێوە دەبەین: بیرۆکە، سیناریۆ، وێنەگرتن، مۆنتاژ و موشن گرافیک.",
      "From product and food photography to ad films and reels, we handle every stage: concept, script, shoot, edit and motion graphics.",
      "من تصوير المنتجات والطعام إلى الأفلام الإعلانية والريلز، ندير كل المراحل: الفكرة والسيناريو والتصوير والمونتاج والموشن جرافيك.",
    ),
    deliverables: L(
      "وێنەگرتنی بەرهەم\nڤیدیۆی ڕیکلام\nڕیڵز و ناوەڕۆکی کورت\nموشن گرافیک\nمۆنتاژ و ڕەنگکاری",
      "Product photography\nAd films\nReels & short-form content\nMotion graphics\nEditing & colour grading",
      "تصوير المنتجات\nالأفلام الإعلانية\nريلز ومحتوى قصير\nموشن جرافيك\nالمونتاج وتصحيح الألوان",
    ),
  },
];

export const seedBlocks: BlockDataMap = {
  "home.hero": {
    eyebrow: L("ئاژانسی بیر · هەولێر", "Beer Agency · Erbil", "وكالة بير · أربيل"),
    title: L(
      "بۆ ئەوانەی بە قووڵی بیر دەکەنەوە.",
      "For those who think deeply.",
      "لمن يفكّرون بعمق.",
    ),
    subtitle: L(
      "ستراتیژی، دیزاین و تەکنەلۆژیا تێکەڵ دەکەین بۆ ئەوەی براندەکەت گەشە بکات، لە ماڵپەڕ و سیستەمەوە تا سۆشیال میدیا و ڕیکلام.",
      "We blend strategy, design and technology to grow your brand — from websites and software to social media and ads.",
      "نمزج الاستراتيجية والتصميم والتكنولوجيا لننمّي علامتك التجارية، من المواقع والبرمجيات إلى وسائل التواصل والإعلانات.",
    ),
    primaryCta: L("دەست پێبکەین", "Start a project", "ابدأ مشروعك"),
    secondaryCta: L("خزمەتگوزارییەکان", "Our services", "خدماتنا"),
  },
  "home.intro": {
    title: L("بیر واتە بیرکردنەوە.", "Beer means thought.", "«بير» تعني الفكر."),
    body: L(
      "لە کوردیدا «بیر» واتای بیرکردنەوە و هزر دەدات. هەموو پڕۆژەیەکمان بە پرسیارێک دەست پێدەکات: چی بە ڕاستی بۆ ئەم براندە کار دەکات؟ پاشان بە وردی دروستی دەکەین.",
      "In Kurdish, “Beer” (بیر) means thought — the mind. Every project starts with one question: what will genuinely work for this brand? Then we build it with care.",
      "في اللغة الكردية تعني «بير» الفكر والعقل. كل مشروع يبدأ بسؤال واحد: ما الذي سينجح فعلاً لهذه العلامة؟ ثم نبنيه بعناية.",
    ),
  },
  "home.process": {
    title: L("چۆن بیر دەکەینەوە", "How we think", "كيف نفكّر"),
    steps: [
      {
        title: L("ناسین", "Discover", "الاكتشاف"),
        body: L(
          "گوێ دەگرین، بازاڕ و ڕکابەرەکانت شی دەکەینەوە و ئامانجەکان ڕوون دەکەینەوە.",
          "We listen, study your market and competitors, and define clear goals.",
          "نستمع وندرس سوقك ومنافسيك ونحدّد أهدافاً واضحة.",
        ),
      },
      {
        title: L("ستراتیژی", "Strategy", "الاستراتيجية"),
        body: L(
          "پلانێکی ڕوون دادەنێین: پەیام، کەناڵ، بودجە و پێوەرەکانی سەرکەوتن.",
          "We set a clear plan: message, channels, budget and success metrics.",
          "نضع خطة واضحة: الرسالة والقنوات والميزانية ومؤشرات النجاح.",
        ),
      },
      {
        title: L("دروستکردن", "Create", "الإنشاء"),
        body: L(
          "دیزاین، ناوەڕۆک، ماڵپەڕ و سیستەم بە کوالیتییەکی بەرز دروست دەکەین.",
          "We design and build content, websites and systems to a high standard.",
          "نصمّم وننتج المحتوى والمواقع والأنظمة بجودة عالية.",
        ),
      },
      {
        title: L("گەشەکردن", "Grow", "النمو"),
        body: L(
          "ئەنجامەکان دەپێوین، فێر دەبین و بەردەوام باشتری دەکەین.",
          "We measure results, learn and keep improving.",
          "نقيس النتائج ونتعلّم ونواصل التحسين.",
        ),
      },
    ],
  },
  "home.stats": {
    items: [
      { value: "5", label: L("خزمەتگوزاری", "Services", "خدمات") },
      { value: "3", label: L("زمان", "Languages", "لغات") },
      { value: "24h", label: L("کاتی وەڵامدانەوە", "Reply time", "وقت الرد") },
    ],
  },
  "home.cta": {
    title: L("پڕۆژەیەکت لە بیرە؟", "Have a project in mind?", "لديك مشروع في بالك؟"),
    body: L(
      "پێمان بڵێ چیت دەوێت. لە ماوەی ٢٤ کاتژمێردا وەڵامت دەدەینەوە.",
      "Tell us what you need. We reply within 24 hours.",
      "أخبرنا بما تحتاجه. نردّ خلال 24 ساعة.",
    ),
    button: L("پەیوەندیمان پێوە بکە", "Contact us", "تواصل معنا"),
  },
  "about.story": {
    title: L("چیرۆکی بیر", "The Beer story", "قصة بير"),
    body: L(
      "بیر ئاژانسێکی مارکێتینگ و تەکنەلۆژیایە لە هەولێر. باوەڕمان وایە باشترین کار لە بیرکردنەوەی قووڵەوە دێت: تێگەیشتن لە خەڵک، لە بازاڕ و لە ئامانجی ڕاستەقینەی هەر براندێک.\n\nتیمەکەمان دیزاینەر، گەشەپێدەر، دروستکەری ناوەڕۆک و پسپۆڕی ڕیکلام کۆدەکاتەوە، بۆ ئەوەی هەموو شتێک لە یەک شوێندا بێت: لە ناسنامەی براندەوە تا ماڵپەڕ، سیستەم، سۆشیال میدیا و ڕیکلام.",
      "Beer is a marketing and technology agency based in Erbil. We believe the best work comes from thinking deeply: understanding people, markets and the real goal behind every brand.\n\nOur team brings designers, developers, content creators and ad specialists together, so everything lives under one roof — from brand identity to websites, systems, social media and advertising.",
      "بير وكالة تسويق وتكنولوجيا مقرّها أربيل. نؤمن بأن أفضل الأعمال تأتي من التفكير العميق: فهم الناس والأسواق والهدف الحقيقي وراء كل علامة تجارية.\n\nيجمع فريقنا مصممين ومطوّرين وصنّاع محتوى ومتخصصين في الإعلانات، ليكون كل شيء تحت سقف واحد: من الهوية التجارية إلى المواقع والأنظمة ووسائل التواصل والإعلانات.",
    ),
  },
  "about.values": {
    title: L("بەهاکانمان", "What we value", "قيمنا"),
    items: [
      {
        title: L("قووڵی", "Depth", "العمق"),
        body: L(
          "پێش ئەوەی دروستی بکەین، تێدەگەین.",
          "We understand before we build.",
          "نفهم قبل أن نبني.",
        ),
      },
      {
        title: L("ڕوونی", "Clarity", "الوضوح"),
        body: L(
          "پلانی ڕوون، نرخی ڕوون، ڕاپۆرتی ڕوون.",
          "Clear plans, clear pricing, clear reporting.",
          "خطط واضحة وأسعار واضحة وتقارير واضحة.",
        ),
      },
      {
        title: L("ئەنجام", "Results", "النتائج"),
        body: L(
          "کارەکانمان بە ئەنجامی ڕاستەقینە دەپێوین.",
          "We measure our work by real outcomes.",
          "نقيس عملنا بنتائج حقيقية.",
        ),
      },
    ],
  },
  "contact.intro": {
    title: L("با قسە بکەین", "Let's talk", "لنتحدّث"),
    body: L(
      "فۆرمەکە پڕ بکەرەوە یان ڕاستەوخۆ پەیوەندیمان پێوە بکە. خۆشحاڵ دەبین بە بیستنی بیرۆکەکەت.",
      "Fill in the form or reach us directly. We'd love to hear your idea.",
      "املأ النموذج أو تواصل معنا مباشرة. يسعدنا سماع فكرتك.",
    ),
  },
  "seo.default": {
    title: L(
      "ئاژانسی بیر | مارکێتینگ، دیزاین و نەرمەکاڵا لە هەولێر",
      "Beer Agency | Marketing, Design & Software in Erbil",
      "وكالة بير | تسويق وتصميم وبرمجيات في أربيل",
    ),
    description: L(
      "بیر ئاژانسێکی مارکێتینگ و تەکنەلۆژیایە لە هەولێر: ماڵپەڕ و نەرمەکاڵا، سۆشیال میدیا، براندینگ، ڕیکلام و بەرهەمهێنانی وێنە و ڤیدیۆ.",
      "Beer is a marketing and technology agency in Erbil: websites & software, social media, branding, paid ads and photo & video production.",
      "بير وكالة تسويق وتكنولوجيا في أربيل: مواقع وبرمجيات، وسائل التواصل، هوية تجارية، إعلانات مموّلة، وإنتاج الصور والفيديو.",
    ),
  },
};

export const defaultSettings: SiteSettings = {
  phone: "+964 773 418 7963",
  whatsapp: "+9647734187963",
  viber: "+9647734187963",
  email: "",
  instagram: "",
  facebook: "https://www.facebook.com/profile.php?id=61573316705238",
  city: L("هەولێر، کوردستان", "Erbil, Kurdistan", "أربيل، كردستان"),
  address: L("", "", ""),
  showMap: false,
  mapEmbedUrl: "",
  workSectionEnabled: false,
  discordWebhookUrl: "",
};
