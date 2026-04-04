"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  LabelList,
} from "recharts";
import { supabase } from "@/lib/supabase";
import { generateCSV } from "@/lib/csv";
import KPICard from "./KPICard";

interface Registration {
  id: number;
  created_at: string;
  name: string;
  whatsapp: string | null;
  city: string | null;
  business_type: string | null;
  team_size: string | null;
  biggest_pain: string | null;
  ai_experience: string | null;
  language_preference: string | null;
  automate_wish: string | null;
  demo_request: string | null;
}

function countBy(arr: Registration[], key: keyof Registration): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  arr.forEach((item) => {
    const val = item[key] as string;
    if (val) {
      counts[val] = (counts[val] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function getTopValue(arr: Registration[], key: keyof Registration): string {
  const counted = countBy(arr, key);
  return counted.length > 0 ? counted[0].name : "N/A";
}

const BRAND = {
  bg: "#F5F0E8",
  card: "#FFFFFF",
  border: "#E8E0D0",
  text: "#1A1714",
  muted: "#8C8579",
  subtle: "#B5AFA6",
  primary: "#D97757",
  primaryHover: "#C26644",
  accent1: "#C96442",
  accent2: "#A47764",
  accent3: "#788C5D",
  accent4: "#5B8A9A",
  accent5: "#9B7CB8",
};

const AI_ORDER = [
  "Never heard of it",
  "Heard but never tried",
  "Tried once or twice",
  "Use it sometimes",
  "Use it regularly",
];

const AI_COLORS = [BRAND.subtle, BRAND.accent2, BRAND.primary, BRAND.accent3, BRAND.accent4];
const PIE_COLORS = [BRAND.primary, BRAND.accent3, BRAND.accent4, BRAND.accent5, BRAND.accent2];

const CITY_ALIASES: Record<string, string> = {
  bangalore: "Bengaluru",
  banglore: "Bengaluru",
  bengaluru: "Bengaluru",
  blr: "Bengaluru",
  mysore: "Mysuru",
  mysuru: "Mysuru",
  hubli: "Hubballi",
  hubballi: "Hubballi",
  mangalore: "Mangaluru",
  mangaluru: "Mangaluru",
  belgaum: "Belagavi",
  belagavi: "Belagavi",
  shimoga: "Shivamogga",
  shivamogga: "Shivamogga",
  tumkur: "Tumakuru",
  tumakuru: "Tumakuru",
  davangere: "Davanagere",
  davanagere: "Davanagere",
};

const AnthropicTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg px-3 py-2 shadow-lg" style={{ borderColor: BRAND.border }}>
        <p className="text-xs font-medium" style={{ color: BRAND.text }}>{label}</p>
        <p className="text-sm font-bold" style={{ color: BRAND.primary }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function TimeSince({ since }: { since: Date }) {
  const [secondsAgo, setSecondsAgo] = useState(0);
  useEffect(() => {
    setSecondsAgo(0);
    const timer = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - since.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [since]);
  return <span>Updated {secondsAgo}s ago</span>;
}

export default function DashboardPre() {
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      setError("");
      const { data: registrations, error: fetchError } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setData(registrations || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data from Supabase. Check your configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleDownloadCSV = () => {
    const csv = generateCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `presurvey_registrations_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // KPI calculations
  const todayCount = data.filter((r) => {
    const today = new Date().toDateString();
    return new Date(r.created_at).toDateString() === today;
  }).length;

  const uniqueCities = new Set(
    data.map((r) => r.city?.trim().toLowerCase()).filter(Boolean)
  ).size;

  const filledAll = data.filter(
    (r) => r.name && r.city && r.business_type && r.biggest_pain && r.ai_experience
  ).length;
  const completionRate = data.length > 0 ? Math.round((filledAll / data.length) * 100) : 0;

  // Chart data
  const businessData = countBy(data, "business_type").slice(0, 8);
  const painData = countBy(data, "biggest_pain").slice(0, 7);

  const cityData = (() => {
    const counts: Record<string, number> = {};
    data.forEach((r) => {
      if (!r.city) return;
      const key = r.city.trim().toLowerCase();
      const normalized = CITY_ALIASES[key] || r.city.trim();
      counts[normalized] = (counts[normalized] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  })();

  const aiData = AI_ORDER.map((level) => ({
    name: level.length > 18 ? level.slice(0, 16) + "..." : level,
    fullName: level,
    count: data.filter((r) => r.ai_experience === level).length,
  }));

  const langData = countBy(data, "language_preference");

  // Error state
  if (error && !data.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: BRAND.bg }}>
        <div className="bg-white border rounded-xl p-8 max-w-md text-center" style={{ borderColor: BRAND.border }}>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="text-white font-semibold rounded-lg px-6 py-2 transition-colors"
            style={{ backgroundColor: BRAND.primary }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const ShimmerCard = () => (
    <div className="bg-white border rounded-xl p-3" style={{ borderColor: BRAND.border }}>
      <div className="h-3 rounded animate-pulse mb-3 w-16" style={{ backgroundColor: BRAND.border }} />
      <div className="h-6 rounded animate-pulse w-12" style={{ backgroundColor: BRAND.border }} />
    </div>
  );

  const ShimmerChart = () => (
    <div className="bg-white border rounded-xl p-4" style={{ borderColor: BRAND.border }}>
      <div className="h-3 rounded animate-pulse mb-3 w-32" style={{ backgroundColor: BRAND.border }} />
      <div className="h-full min-h-[120px] rounded animate-pulse" style={{ backgroundColor: BRAND.bg }} />
    </div>
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: BRAND.bg }}>
      {/* Action bar */}
      <div className="shrink-0 px-5 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: BRAND.primary }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M13.827 3.52L21.18 20.48H17.25L15.645 16.71H8.355L6.75 20.48H2.82L10.173 3.52H13.827ZM14.508 13.74L12 7.8L9.492 13.74H14.508Z" fill="white"/>
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-xl leading-none" style={{ color: BRAND.text, fontFamily: "var(--font-outfit), 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
              Pre-Survey Dashboard
            </h1>
            <p className="text-[10px] mt-0.5" style={{ color: BRAND.muted }}>
              <TimeSince since={lastUpdated} /> &middot; Auto-refreshes every 60s
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="border rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-white"
            style={{ borderColor: BRAND.border, color: BRAND.muted }}
          >
            &#8635; Refresh
          </button>
          <button
            onClick={handleDownloadCSV}
            className="text-white rounded-lg px-3 py-1.5 text-xs transition-colors font-medium"
            style={{ backgroundColor: BRAND.primary }}
          >
            CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-5 mb-2 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-600 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchData} className="underline ml-4">Retry</button>
        </div>
      )}

      {/* Dashboard content */}
      <div className="flex-1 flex flex-col px-5 pb-4 gap-3 min-h-0">
        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-5 gap-3 shrink-0">
            {[1, 2, 3, 4, 5].map((i) => <ShimmerCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-3 shrink-0">
            <KPICard
              label="Total Registrations"
              value={data.length}
              isNumeric
              color={BRAND.primary}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />
            <KPICard
              label="Today"
              value={todayCount}
              isNumeric
              color={BRAND.accent4}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
            />
            <KPICard
              label="Completion Rate"
              value={`${completionRate}%`}
              color={BRAND.accent3}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
            />
            <KPICard
              label="Unique Cities"
              value={uniqueCities}
              isNumeric
              color={BRAND.accent2}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
              }
            />
            <KPICard
              label="Top Business"
              value={getTopValue(data, "business_type")}
              color={BRAND.accent5}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
                </svg>
              }
            />
          </div>
        )}

        {/* Row 1: Business Types (2/3) + Language Preference (1/3) */}
        {loading ? (
          <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
            <div className="col-span-2"><ShimmerChart /></div>
            <ShimmerChart />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
            <div className="col-span-2 bg-white rounded-xl p-4 border flex flex-col" style={{ borderColor: BRAND.border }}>
              <h3 className="text-[10px] uppercase tracking-widest font-semibold mb-2 shrink-0" style={{ color: BRAND.muted }}>
                Business Types
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={businessData} margin={{ left: 10, right: 20, top: 2, bottom: 2 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 10, fill: BRAND.muted }} axisLine={false} tickLine={false} />
                    <Tooltip content={<AnthropicTooltip />} cursor={{ fill: "rgba(217,119,87,0.06)" }} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                      {businessData.map((_, index) => (
                        <Cell key={index} fill={index === 0 ? BRAND.primary : index === 1 ? BRAND.accent1 : BRAND.border} />
                      ))}
                      <LabelList dataKey="count" position="right" style={{ fontSize: 10, fill: BRAND.muted, fontWeight: 600 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border flex flex-col" style={{ borderColor: BRAND.border }}>
              <h3 className="text-[10px] uppercase tracking-widest font-semibold mb-2 shrink-0" style={{ color: BRAND.muted }}>
                Language Preference
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={langData}
                      cx="50%"
                      cy="42%"
                      innerRadius="35%"
                      outerRadius="60%"
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="name"
                      strokeWidth={0}
                    >
                      {langData.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<AnthropicTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      iconSize={8}
                      formatter={(value: string) => (
                        <span style={{ color: BRAND.muted, fontSize: 10 }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Row 2: Pain Points + Cities + AI Experience */}
        {loading ? (
          <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
            <ShimmerChart />
            <ShimmerChart />
            <ShimmerChart />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
            {/* Biggest Challenges */}
            <div className="bg-white rounded-xl p-4 border flex flex-col" style={{ borderColor: BRAND.border }}>
              <h3 className="text-[10px] uppercase tracking-widest font-semibold mb-2 shrink-0" style={{ color: BRAND.muted }}>
                Biggest Challenges
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={painData} margin={{ left: 10, right: 10, top: 2, bottom: 2 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 9, fill: BRAND.muted }} axisLine={false} tickLine={false} />
                    <Tooltip content={<AnthropicTooltip />} cursor={{ fill: "rgba(217,119,87,0.06)" }} />
                    <Bar dataKey="count" fill={BRAND.accent3} radius={[0, 6, 6, 0]} barSize={14}>
                      <LabelList dataKey="count" position="right" style={{ fontSize: 9, fill: BRAND.muted, fontWeight: 600 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cities */}
            <div className="bg-white rounded-xl p-4 border flex flex-col" style={{ borderColor: BRAND.border }}>
              <h3 className="text-[10px] uppercase tracking-widest font-semibold mb-2 shrink-0" style={{ color: BRAND.muted }}>
                Cities
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={cityData} margin={{ left: 10, right: 10, top: 2, bottom: 2 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 9, fill: BRAND.muted }} axisLine={false} tickLine={false} />
                    <Tooltip content={<AnthropicTooltip />} cursor={{ fill: "rgba(217,119,87,0.06)" }} />
                    <Bar dataKey="count" fill={BRAND.accent4} radius={[0, 6, 6, 0]} barSize={14}>
                      <LabelList dataKey="count" position="right" style={{ fontSize: 9, fill: BRAND.muted, fontWeight: 600 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Experience */}
            <div className="bg-white rounded-xl p-4 border flex flex-col" style={{ borderColor: BRAND.border }}>
              <h3 className="text-[10px] uppercase tracking-widest font-semibold mb-2 shrink-0" style={{ color: BRAND.muted }}>
                AI Experience Level
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={aiData} margin={{ left: 10, right: 10, top: 2, bottom: 2 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 9, fill: BRAND.muted }} axisLine={false} tickLine={false} />
                    <Tooltip content={<AnthropicTooltip />} cursor={{ fill: "rgba(217,119,87,0.06)" }} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={14}>
                      {aiData.map((_, index) => (
                        <Cell key={index} fill={AI_COLORS[index]} />
                      ))}
                      <LabelList dataKey="count" position="right" style={{ fontSize: 9, fill: BRAND.muted, fontWeight: 600 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Summary Bar with Registrant Names */}
        {!loading && (
          <div className="shrink-0 bg-white rounded-xl border px-5 py-3 flex items-center gap-6"
               style={{ borderColor: BRAND.border }}>
            {/* Key stats */}
            <div className="flex items-center gap-8 shrink-0">
              <div className="text-center">
                <p className="text-lg font-bold leading-none" style={{ color: BRAND.primary, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>{data.length}</p>
                <p className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: BRAND.subtle }}>Registrations</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold leading-none" style={{ color: BRAND.accent4, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>{uniqueCities}</p>
                <p className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: BRAND.subtle }}>Cities</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold leading-none" style={{ color: BRAND.accent3, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>{completionRate}%</p>
                <p className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: BRAND.subtle }}>Complete</p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-10 shrink-0" style={{ backgroundColor: BRAND.border }} />

            {/* All Registrants name pills */}
            <div className="flex-1 min-w-0">
              <p className="text-[9px] uppercase tracking-widest mb-1.5 font-semibold" style={{ color: BRAND.subtle }}>All Registrants</p>
              <div className="flex flex-wrap gap-1.5 max-h-[40px] overflow-y-auto">
                {data.map((r) => (
                  <span
                    key={r.id}
                    className="bg-white border rounded-full px-3 py-1 text-xs whitespace-nowrap"
                    style={{ borderColor: BRAND.border, color: BRAND.muted }}
                  >
                    {r.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
