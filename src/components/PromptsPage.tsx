"use client";

import { useState, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Prompt {
  id: string;
  title: string;
  tag: string;
  en: string;
  kn: string;
  type: "chat" | "cowork";
}

const chatPrompts: Prompt[] = [
  {
    id: "Chat \u00b7 01",
    title: "Find Your First Client",
    tag: "For consultants and freelancers",
    type: "chat",
    en: `I am an AI consultant in Bengaluru targeting pharmacy owners in Jayanagar as my first clients.

Help me:
1. Define exactly who my ideal client is
2. Write a WhatsApp outreach message in Kannada (under 60 words, friendly, mentions one pain point)
3. Give me 3 questions to ask in the first meeting
4. Tell me what to demonstrate in the first 5 minutes to win their trust`,
    kn: `\u0CA8\u0CBE\u0CA8\u0CC1 Bengaluru \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF AI consultant. Jayanagar \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF pharmacy owners \u0CA8\u0CCD\u0CA8\u0CC1 \u0CAE\u0CCA\u0CA6\u0CB2 clients \u0C86\u0C97\u0CBF approach \u0CAE\u0CBE\u0CA1\u0CAC\u0CC7\u0C95\u0CC1.

Help \u0CAE\u0CBE\u0CA1\u0CBF:
1. \u0CA8\u0CA8\u0CCD\u0CA8 ideal client \u0CAF\u0CBE\u0CB0\u0CC1 \u0C85\u0C82\u0CA4 exactly define \u0CAE\u0CBE\u0CA1\u0CBF
2. Kannada \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF WhatsApp message \u0CAC\u0CB0\u0CC6\u0CAF\u0CBF (60 words \u0C92\u0CB3\u0C97\u0CC6, friendly, one pain point)
3. First meeting \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0C95\u0CC7\u0CB3\u0CAC\u0CC7\u0C95\u0CBE\u0CA6 3 questions \u0C95\u0CCA\u0CA1\u0CBF
4. First 5 minutes \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF trust \u0C97\u0CC6\u0CB2\u0CCD\u0CB2\u0CCB\u0C95\u0CC6 \u0C8F\u0CA8\u0CC1 demonstrate \u0CAE\u0CBE\u0CA1\u0CB2\u0CBF`,
  },
  {
    id: "Chat \u00b7 02",
    title: "Business Idea Validator",
    tag: "For aspiring entrepreneurs",
    type: "chat",
    en: `I am thinking of starting a home-based pickle and papad business in Bengaluru targeting working women and NRI families. I have \u20B950,000 to invest.

Tell me:
1. Is this a good idea? Be honest.
2. What are the top 3 risks?
3. What licences do I need in Karnataka?
4. How should I price my products?
5. Where should I sell \u2014 Instagram, WhatsApp, or Swiggy?

Give me crisp answers in table format.`,
    kn: `\u0CA8\u0CBE\u0CA8\u0CC1 Bengaluru \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF home-based pickle \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 papad business \u0CB6\u0CC1\u0CB0\u0CC1 \u0CAE\u0CBE\u0CA1\u0CAC\u0CC7\u0C95\u0CC1 \u2014 working women \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 NRI families \u0C97\u0CC6. \u20B950,000 invest \u0CAE\u0CBE\u0CA1\u0CB2\u0CBF\u0C95\u0CCD\u0C95\u0CC6 \u0C87\u0CA6\u0CC6.

\u0CB9\u0CC7\u0CB3\u0CBF:
1. \u0C87\u0CA6\u0CC1 \u0C92\u0CB3\u0CCD\u0CB3\u0CC6 idea \u0CA8\u0CBE? Honest \u0C86\u0C97\u0CBF \u0CB9\u0CC7\u0CB3\u0CBF.
2. Top 3 risks \u0C8F\u0CA8\u0CC1?
3. Karnataka \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0CAF\u0CBE\u0CB5 licences \u0CAC\u0CC7\u0C95\u0CC1?
4. Pricing \u0CB9\u0CC7\u0C97\u0CC6 \u0CAE\u0CBE\u0CA1\u0CAC\u0CC7\u0C95\u0CC1?
5. \u0C8E\u0CB2\u0CCD\u0CB2\u0CBF sell \u0CAE\u0CBE\u0CA1\u0CB2\u0CBF \u2014 Instagram, WhatsApp, \u0C85\u0CA5\u0CB5\u0CBE Swiggy?

Table format \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF crisp \u0C86\u0C97\u0CBF \u0CB9\u0CC7\u0CB3\u0CBF.`,
  },
  {
    id: "Chat \u00b7 03",
    title: "Weekly Menu Generator",
    tag: "For restaurant and food businesses",
    type: "chat",
    en: `I run a small restaurant in Bengaluru that changes its menu every week. This week's theme: Street Food from Around the World

Give me 3 street food recipes from 3 countries I can make in an Indian kitchen. For each: country, dish name in local language, ingredients available in Bengaluru, cooking steps, why customers will love it, price in \u20B9, chef tips, one fun fact.

Format as a self-contained HTML page with warm earthy theme, click-to-open recipe cards. Save as weekly_menu.html`,
    kn: `\u0CA8\u0CBE\u0CA8\u0CC1 Bengaluru \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0C92\u0C82\u0CA6\u0CC1 restaurant run \u0CAE\u0CBE\u0CA1\u0CCD\u0CA4\u0CC0\u0CA8\u0CBF. \u0CAA\u0CCD\u0CB0\u0CA4\u0CBF \u0CB5\u0CBE\u0CB0 menu \u0CAC\u0CA6\u0CB2\u0CBE\u0C97\u0CCD\u0CA4\u0CC6. \u0C88 \u0CB5\u0CBE\u0CB0\u0CA6 theme: \u0CA6\u0CC1\u0CA8\u0CBF\u0CAF\u0CBE\u0CA6 Street Food

3 countries \u0CA8\u0CBF\u0C82\u0CA6 3 recipes \u0C95\u0CCA\u0CA1\u0CBF \u2014 Indian kitchen \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0CAE\u0CBE\u0CA1\u0CAC\u0CB9\u0CC1\u0CA6\u0CBE\u0CA6\u0CB5\u0CC1. \u0CAA\u0CCD\u0CB0\u0CA4\u0CBF recipe \u0C97\u0CC6: country, dish name local language \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF, Bengaluru ingredients, cooking steps, customers \u0CAF\u0CBE\u0C95\u0CC6 love, \u20B9 price, chef tips, fun fact.

Warm earthy theme, click cards \u0CB8\u0CB9\u0CBF\u0CA4 HTML page \u0C86\u0C97\u0CBF save \u0CAE\u0CBE\u0CA1\u0CBF: weekly_menu.html`,
  },
];

const coworkPrompts: Prompt[] = [
  {
    id: "Cowork \u00b7 01",
    title: "Vendor Invoice Dashboard",
    tag: "Reads all PDFs \u00b7 builds dashboard",
    type: "cowork",
    en: `Read all PDF invoices inside subfolder "invoices_demo".

For each extract: vendor name, date, category, total amount.

Build HTML dashboard with:
- 4 KPI cards: Total Spend, No. of Invoices, Top Category, Biggest Vendor
- Donut chart: Spend by Category
- Bar chart: Monthly trend
- Sortable invoice table

Save as vendor_dashboard_march2026.html`,
    kn: `"invoices_demo" subfolder \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF\u0CB0\u0CCB \u0C8E\u0CB2\u0CCD\u0CB2\u0CBE PDF invoices \u0C93\u0CA6\u0CBF.

\u0CAA\u0CCD\u0CB0\u0CA4\u0CBF invoice \u0CA8\u0CBF\u0C82\u0CA6: vendor \u0CB9\u0CC6\u0CB8\u0CB0\u0CC1, date, category, total amount \u0CA4\u0CC6\u0C97\u0CC6.

HTML dashboard build \u0CAE\u0CBE\u0CA1\u0CBF:
- 4 KPI cards: Total Spend, Invoices, Top Category, Biggest Vendor
- Donut chart: Category wise spend
- Bar chart: Monthly trend
- Sortable invoice table

vendor_dashboard_march2026.html \u0C86\u0C97\u0CBF save \u0CAE\u0CBE\u0CA1\u0CBF`,
  },
  {
    id: "Cowork \u00b7 02",
    title: "Overdue Payment Tracker",
    tag: "Dashboard \u00b7 Kannada reminders \u00b7 recovery plan",
    type: "cowork",
    en: `Read payments_register.csv in subfolder "overdue".

TASK 1: Build colour-coded HTML dashboard \u2014 yellow/orange/red by overdue weeks, KPIs, bar chart.

TASK 2: Draft Kannada WhatsApp reminder for every customer with balance > 0 \u2014 polite, personalised, name + amount + days + UPI: yourupi@upi

TASK 3: Write recovery action plan \u2014 who to call first, at-risk customers, prevention tips.

Save as: overdue_payments.html, overdue_reminders.txt, payment_summary.txt`,
    kn: `"overdue" folder \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF\u0CB0\u0CCB payments_register.csv \u0C93\u0CA6\u0CBF.

TASK 1: Colour-coded HTML dashboard \u0CAE\u0CBE\u0CA1\u0CBF \u2014 yellow/orange/red by weeks.

TASK 2: Balance > 0 \u0C87\u0CB0\u0CCB \u0CAA\u0CCD\u0CB0\u0CA4\u0CBF customer \u0C97\u0CC6 Kannada WhatsApp message \u0CAC\u0CB0\u0CC6 \u2014 polite, personalised, \u0CB9\u0CC6\u0CB8\u0CB0\u0CC1 + amount + days + UPI: yourupi@upi

TASK 3: Recovery action plan \u0CAC\u0CB0\u0CC6 \u2014 \u0CAF\u0CBE\u0CB0\u0CBF\u0C97\u0CC6 \u0CAE\u0CCA\u0CA6\u0CB2\u0CC1 call, at-risk customers.

Save \u0CAE\u0CBE\u0CA1\u0CBF: overdue_payments.html, overdue_reminders.txt, payment_summary.txt`,
  },
  {
    id: "Cowork \u00b7 03",
    title: "Monday Weekly Plan",
    tag: "For restaurants \u00b7 runs every Monday 9AM",
    type: "cowork",
    en: `Read last_week_orders.csv and customer_reviews.txt.

Build this week's plan:
1. Recommended menu \u2014 keep top 5 sellers, drop bottom 3, suggest 2 new items based on reviews
2. Raw material order list with exact quantities
3. Pricing tips \u2014 which items to price higher this week

Write a Kannada WhatsApp message to my supplier with the full order.

Save as: weekly_plan_monday.html, supplier_order.txt
/schedule Monday 9AM`,
    kn: `last_week_orders.csv \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 customer_reviews.txt \u0C93\u0CA6\u0CBF.

\u0C88 \u0CB5\u0CBE\u0CB0\u0CA6 plan \u0CAE\u0CBE\u0CA1\u0CBF:
1. Menu \u2014 top 5 \u0C87\u0C9F\u0CCD\u0C95\u0CCB, bottom 3 \u0CA4\u0CC6\u0C97\u0CC6, reviews \u0CA8\u0CCB\u0CA1\u0CBF 2 new items suggest \u0CAE\u0CBE\u0CA1\u0CC1
2. Raw material order list \u2014 exact quantities \u0CB8\u0CAE\u0CC7\u0CA4
3. Pricing tips \u2014 \u0CAF\u0CBE\u0CB5 items \u0C88 \u0CB5\u0CBE\u0CB0 \u0C9C\u0CBE\u0CB8\u0CCD\u0CA4\u0CBF price \u0CB9\u0CBE\u0C95\u0CAC\u0CB9\u0CC1\u0CA6\u0CC1

Supplier \u0C97\u0CC6 Kannada WhatsApp message \u0CAC\u0CB0\u0CC6 \u2014 full order \u0CB8\u0CAE\u0CC7\u0CA4.

Save \u0CAE\u0CBE\u0CA1\u0CBF: weekly_plan_monday.html, supplier_order.txt
/schedule Monday 9AM`,
  },
];

/* ------------------------------------------------------------------ */
/*  PromptCard                                                         */
/* ------------------------------------------------------------------ */

function PromptCard({ prompt }: { prompt: Prompt }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"en" | "kn">("en");
  const [copied, setCopied] = useState(false);

  const text = tab === "en" ? prompt.en : prompt.kn;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <div className="bg-white border border-[#E8E6DC] rounded-[14px] overflow-hidden mb-4">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full bg-[#141F2E] px-5 py-4 cursor-pointer flex justify-between items-center text-left"
      >
        <div>
          <p className="font-mono text-xs text-[#D97757]/60">{prompt.id}</p>
          <p className="text-white text-base font-semibold">{prompt.title}</p>
          <p className="italic text-xs text-white/40">{prompt.tag}</p>
        </div>
        <span className="text-white text-xl leading-none select-none">
          {open ? "\u00d7" : "+"}
        </span>
      </button>

      {/* Body */}
      {open && (
        <div className="p-5">
          {/* Tabs */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setTab("en")}
              className={`pb-1 text-sm font-medium ${
                tab === "en"
                  ? "border-b-2 border-[#D97757] text-[#1A1A1A]"
                  : "text-[#888]"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setTab("kn")}
              className={`pb-1 text-sm font-medium font-kannada ${
                tab === "kn"
                  ? "border-b-2 border-[#D97757] text-[#1A1A1A]"
                  : "text-[#888]"
              }`}
            >
              &#x0C95;&#x0CA8;&#x0CCD;&#x0CA8;&#x0CA1;
            </button>
          </div>

          {/* Code block */}
          <div className="relative bg-[#05101F] rounded-lg p-5">
            <button
              onClick={handleCopy}
              className={`absolute top-3 right-3 text-xs px-2 py-1 rounded ${
                copied
                  ? "text-green-400"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {copied ? "Copied \u2713" : "Copy"}
            </button>
            <pre className="font-mono text-xs text-white/80 whitespace-pre-wrap leading-relaxed">
              {text}
            </pre>
          </div>

          {/* Claude link — chat only */}
          {prompt.type === "chat" && (
            <a
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D97757] text-sm mt-3 inline-block hover:underline"
            >
              Try on claude.ai &rarr;
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

function Section({
  badge,
  title,
  hint,
  prompts,
}: {
  badge: string;
  title: string;
  hint: string;
  prompts: Prompt[];
}) {
  return (
    <section className="mb-14">
      <span className="inline-block bg-[#1A1A1A] text-[#D97757] border border-[#D97757] font-mono text-xs rounded-full px-3 py-1">
        {badge}
      </span>
      <h2 className="font-playfair text-2xl font-semibold mt-3">{title}</h2>
      <p className="italic text-sm text-[#888]">{hint}</p>
      <hr className="border-[#E8E6DC] my-4" />
      {prompts.map((p) => (
        <PromptCard key={p.id} prompt={p} />
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PromptsPage                                                        */
/* ------------------------------------------------------------------ */

export default function PromptsPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      {/* Header */}
      <header className="bg-[#1A1A1A] text-center" style={{ padding: "52px 40px" }}>
        <p className="font-mono text-xs tracking-widest uppercase text-[#D97757] mb-4">
          &#x0CAE;&#x0CC1;&#x0C82;&#x0CA6;&#x0CC6; &#x0CAC;&#x0CA8;&#x0CCD;&#x0CA8;&#x0CBF; &middot; Prompts Unlocked
        </p>
        <h1 className="font-playfair text-white" style={{ fontSize: 48 }}>
          Your prompts.
          <br />
          <span className="italic text-[#D97757]">Ready to use.</span>
        </h1>
        <p className="text-white/50 italic text-sm mt-3">
          Copy &middot; paste into Claude &middot; watch it work
        </p>
      </header>

      {/* Body */}
      <main className="max-w-[880px] mx-auto px-8 py-14">
        <Section
          badge="Claude Chat"
          title="Chat Prompts"
          hint="Open claude.ai \u00b7 paste \u00b7 run \u2014 no setup needed"
          prompts={chatPrompts}
        />
        <Section
          badge="Claude Cowork"
          title="Cowork Prompts"
          hint="Paste into Claude Cowork \u00b7 let it run \u00b7 come back to results"
          prompts={coworkPrompts}
        />
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] py-8 text-center">
        <p className="font-kannada text-[15px] text-white/30">
          &#x0CAE;&#x0CC1;&#x0C82;&#x0CA6;&#x0CC6; &#x0CAC;&#x0CA8;&#x0CCD;&#x0CA8;&#x0CBF; &middot;{" "}
          <span className="text-[#D97757] font-bold">AI for Your Business</span>{" "}
          &middot; &#x0CA7;&#x0CA8;&#x0CCD;&#x0CAF;&#x0CB5;&#x0CBE;&#x0CA6;&#x0C97;&#x0CB3;&#x0CC1;
        </p>
      </footer>
    </div>
  );
}
