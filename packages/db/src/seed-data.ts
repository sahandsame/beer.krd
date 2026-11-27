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
  "pricing.intro": {
    title: L(
      "ماڵپەڕ و سیستەم، لە $100 تا $5,000",
      "Websites and systems, from $100 to $5,000",
      "مواقع وأنظمة، من $100 إلى $5,000",
    ),
    lead: L(
      "پاکێجێک هەڵبژێرە یان پێمان بڵێ چیت دەوێت. بۆ پڕۆژە گەورەکان، یەکەم ڕاوێژ بەخۆڕاییە.",
      "Pick a package or tell us what you need. For bigger projects, the first consultation is free.",
      "اختر باقة أو أخبرنا بما تحتاجه. للمشاريع الكبيرة، الاستشارة الأولى مجانية.",
    ),
  },
  "pricing.packages": {
    items: [
      {
        name: L("دەستپێک", "Starter", "البداية"),
        price: L("$100 – $150", "$100 – $150", "$100 – $150"),
        delivery: L("٥ ڕۆژ", "5 days", "5 أيام"),
        summary: L(
          "ماڵپەڕێکی یەک پەڕەیی بۆ ئەوەی خەڵک بتدۆزنەوە و پەیوەندیت پێوە بکەن.",
          "A one-page site so people can find and contact you.",
          "موقع من صفحة واحدة ليجدك الناس ويتواصلوا معك.",
        ),
        features: L(
          "یەک پەڕە، گونجاو بۆ مۆبایل\nدوگمەی واتساپ و پەیوەندی\nشوێنەکەت لەسەر نەخشەی گووگڵ\nبەستەری سۆشیال میدیا\nیەک زمان",
          "One page, mobile-friendly\nWhatsApp and call buttons\nYour location on Google Maps\nSocial media links\nOne language",
          "صفحة واحدة متوافقة مع الجوال\nأزرار واتساب واتصال\nموقعك على خرائط جوجل\nروابط وسائل التواصل\nلغة واحدة",
        ),
        budget: "lt500",
        featured: "",
      },
      {
        name: L("بزنس", "Business", "الأعمال"),
        price: L("$250 – $500", "$250 – $500", "$250 – $500"),
        delivery: L("٧–١٠ ڕۆژ", "7–10 days", "7–10 أيام"),
        summary: L(
          "ماڵپەڕێکی بچووکی کۆمپانیا بۆ ناساندنی کار و خزمەتگوزارییەکانت.",
          "A small company website that presents your work and services.",
          "موقع صغير لشركتك يعرض أعمالك وخدماتك.",
        ),
        features: L(
          "تا ٥ پەڕە\nکوردی لەگەڵ عەرەبی یان ئینگلیزی\nفۆرمی پەیوەندی\nڕێکخستنی گووگڵ\nدوگمەی واتساپ",
          "Up to 5 pages\nKurdish plus Arabic or English\nContact form\nGoogle setup\nWhatsApp button",
          "حتى 5 صفحات\nالكردية مع العربية أو الإنجليزية\nنموذج تواصل\nإعداد جوجل\nزر واتساب",
        ),
        budget: "lt500",
        featured: "",
      },
      {
        name: L("مینیو / کەتەلۆگ", "Menu / Catalog", "قائمة / كتالوج"),
        price: L("$300 – $600", "$300 – $600", "$300 – $600"),
        delivery: L("٧–١٠ ڕۆژ", "7–10 days", "7–10 أيام"),
        summary: L(
          "مینیوی QR یان کەتەلۆگی بەرهەم کە خۆت نوێی دەکەیتەوە.",
          "A QR menu or product catalog you update yourself.",
          "قائمة QR أو كتالوج منتجات تحدّثه بنفسك.",
        ),
        features: L(
          "مینیوی QR یان کەتەلۆگ\nخۆت نرخ و بەرهەمەکان دەگۆڕیت\nداواکردن بە واتساپ\nتا ٣ زمان\nگونجاو بۆ مۆبایل",
          "QR menu or catalog\nEdit prices and products yourself\nOrders via WhatsApp\nUp to 3 languages\nMobile-friendly",
          "قائمة QR أو كتالوج\nتعدّل الأسعار والمنتجات بنفسك\nالطلب عبر واتساب\nحتى 3 لغات\nمتوافق مع الجوال",
        ),
        budget: "lt500",
        featured: "",
      },
      {
        name: L("پرۆ", "Pro", "احترافي"),
        price: L("لە $800ـەوە", "From $800", "من $800"),
        delivery: L("٢–٤ هەفتە", "2–4 weeks", "2–4 أسابيع"),
        summary: L(
          "ماڵپەڕێکی تەواوی کۆمپانیا لەگەڵ پانێڵی بەڕێوەبردن، هەموو شتێک خۆت دەگۆڕیت.",
          "A complete company website with an admin panel, so you can change everything yourself.",
          "موقع متكامل لشركتك مع لوحة تحكم لتعدّل كل شيء بنفسك.",
        ),
        features: L(
          "تا ١٥ پەڕە\nکوردی، عەرەبی و ئینگلیزی\nپانێڵی بەڕێوەبردن\nسندوقی داواکارییەکان\nپۆرتفۆلیۆ یان بلۆگ\nڕێکخستنی SEO",
          "Up to 15 pages\nKurdish, Arabic and English\nAdmin panel\nLeads inbox\nPortfolio or blog\nSEO setup",
          "حتى 15 صفحة\nالكردية والعربية والإنجليزية\nلوحة تحكم\nصندوق الطلبات\nمعرض أعمال أو مدونة\nإعداد SEO",
        ),
        budget: "500-2000",
        featured: "yes",
      },
      {
        name: L("فرۆشگای ئۆنلاین", "Online Store", "متجر إلكتروني"),
        price: L("لە $1,500ـەوە", "From $1,500", "من $1,500"),
        delivery: L("٤–٦ هەفتە", "4–6 weeks", "4–6 أسابيع"),
        summary: L(
          "فرۆشگایەکی ئۆنلاینی تەواو بۆ فرۆشتنی بەرهەمەکانت، بێ کۆمیشن.",
          "A full online store to sell your products, with no commission.",
          "متجر إلكتروني متكامل لبيع منتجاتك، بدون عمولة.",
        ),
        features: L(
          "بەرهەم و پۆلەکان\nسەبەتەی کڕین\nداشبۆردی داواکارییەکان\nناوچەکانی گەیاندن\nپارەدان لە کاتی گەیاندن\nپارەدانی ئۆنلاین (ئەگەر بەردەست بێت)",
          "Products and categories\nShopping cart\nOrders dashboard\nDelivery zones\nCash on delivery\nOnline payment (where available)",
          "المنتجات والفئات\nسلة التسوق\nلوحة الطلبات\nمناطق التوصيل\nالدفع عند الاستلام\nالدفع الإلكتروني (حيث يتوفر)",
        ),
        budget: "2000-5000",
        featured: "",
      },
      {
        name: L("سیستەمی تایبەت", "Custom System", "نظام مخصّص"),
        price: L("لە $3,000ـەوە", "From $3,000", "من $3,000"),
        delivery: L("٦–١٠ هەفتە", "6–10 weeks", "6–10 أسابيع"),
        summary: L(
          "سیستەمێک کە بە تایبەتی بۆ شێوازی کارکردنی کۆمپانیاکەت دروست دەکرێت.",
          "A system built around the way your company works.",
          "نظام يُبنى حول طريقة عمل شركتك.",
        ),
        features: L(
          "سیستەمی نۆرەگرتن\nداشبۆردی کارمەند و لقەکان\nڕاپۆرت و ئامار\nپۆرتاڵی کڕیاران\nبەستنەوە بە سیستەمەکانی تر",
          "Booking systems\nStaff and branch dashboards\nReports and analytics\nCustomer portals\nIntegrations with other systems",
          "أنظمة الحجز\nلوحات للموظفين والفروع\nتقارير وإحصائيات\nبوابات للعملاء\nربط مع أنظمة أخرى",
        ),
        budget: "2000-5000",
        featured: "",
      },
    ],
  },
  "pricing.notes": {
    title: L("باشە بزانیت", "Good to know", "معلومات مهمة"),
    items: [
      {
        title: L("دۆمەین و هۆستینگ", "Domain and hosting", "النطاق والاستضافة"),
        body: L(
          "پێش دەستپێکردن پێت دەڵێین چی لەناو نرخەکەدایە و نوێکردنەوەی ساڵانە چەندە. هیچ پارەیەکی شاراوە نییە.",
          "Before we start, we tell you exactly what's included and what the yearly renewal costs. No hidden fees.",
          "قبل البدء نوضّح لك ما يشمله السعر وتكلفة التجديد السنوي. لا رسوم مخفية.",
        ),
      },
      {
        title: L("پارەدان بە قۆناغ", "Pay in stages", "الدفع على مراحل"),
        body: L(
          "بۆ پرۆ، فرۆشگای ئۆنلاین و سیستەمی تایبەت: ٤٠٪ لە دەستپێک، ٤٠٪ کاتی پیشاندانی یەکەم وەشان، ٢٠٪ کاتی بڵاوکردنەوە.",
          "For Pro, Online Store and Custom System: 40% to start, 40% at the first preview, 20% at launch.",
          "لباقات الاحترافي والمتجر والنظام المخصّص: 40% عند البدء، 40% عند عرض النسخة الأولى، 20% عند الإطلاق.",
        ),
      },
      {
        title: L("پشتگیری دوای بڵاوکردنەوە", "Support after launch", "الدعم بعد الإطلاق"),
        body: L(
          "پلانی پشتگیری مانگانە یان ساڵانە ماڵپەڕەکەت پارێزراو و نوێ دەهێڵێتەوە.",
          "Monthly or yearly support plans keep your site secure and up to date.",
          "خطط دعم شهرية أو سنوية تحافظ على موقعك آمناً ومحدّثاً.",
        ),
      },
      {
        title: L("ڕاوێژی بەخۆڕایی", "Free consultation", "استشارة مجانية"),
        body: L(
          "دڵنیا نیت کام پاکێج گونجاوە؟ نامەمان بۆ بنێرە، بەخۆڕایی ڕێنماییت دەکەین.",
          "Not sure which package fits? Message us and we'll recommend one, for free.",
          "لست متأكداً أي باقة تناسبك؟ راسلنا وسنرشدك مجاناً.",
        ),
      },
    ],
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
