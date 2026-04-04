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
import KPICard from "./KPICard";

interface PostResponse {
  id: number;
  created_at: string;
  name: string | null;
  business_type: string | null;
  most_useful_demo: string | null;
  heard_from: string | null;
  confidence_level: string | null;
  kannada_helped: string | null;
  topic_next: string | null;
  need_one_on_one: string | null;
  want_setup: string | null;
  follow_up_method: string | null;
  contact_detail: string | null;
  extra_message: string | null;
}

const BRAND = {
  bg: "#F5F0E8",
  card: "#FFFFFF",
  border: "#E8E0D0",
  text: "#1A1714",
  muted: "#8C8579",
  subtle: "#B5AFA6",
  primary: "#D97757",
  accent1: "#C96442",
  accent2: "#A47764",
  accent3: "#788C5D",
  accent4: "#5B8A9A",
  accent5: "#9B7CB8",
};

const PIE_COLORS = [BRAND.primary, BRAND.accent3, BRAND.accent4, BRAND.accent5, BRAND.accent2, BRAND.accent1];

function countBy(arr: PostResponse[], key: keyof PostResponse): { name: string; count: number }[] {
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

function countByMulti(arr: PostResponse[], key: keyof PostResponse): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  arr.forEach((item) => {
    const val = item[key] as string;
    if (val) {
      val.split(",").forEach((v) => {
        const trimmed = v.trim();
        if (trimmed) {
          counts[trimmed] = (counts[trimmed] || 0) + 1;
        }
      });
    }
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

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

function generatePostCSV(data: PostResponse[]): string {
  const headers = [
    "Submitted At", "Name", "Business Type", "Most Useful Demo", "Heard From",
    "Confidence Level", "Kannada Helped", "Topic Next", "Need One-on-One",
    "Want Setup", "Follow-up Method", "Contact Detail", "Extra Message",
  ];
  const rows = data.map((r) => [
    new Date(r.created_at).toLocaleString(),
    r.name || "",
    r.business_type || "",
    r.most_useful_demo || "",
    r.heard_from || "",
    r.confidence_level || "",
    r.kannada_helped || "",
    r.topic_next || "",
    r.need_one_on_one || "",
    r.want_setup || "",
    r.follow_up_method || "",
    r.contact_detail || "",
    r.extra_message || "",
  ]);
  return [headers.join(","), ...rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))].join("\n");
}

export default function DashboardPost() {
  const [data, setData] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      setError("");
      const { data: responses, error: fetchError } = await supabase
        .from("post_responses")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setData(responses || []);
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
    const csv = generatePostCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `post_survey_responses_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // KPI calculations
  const needOneOnOneCount = data.filter((r) => r.need_one_on_one?.startsWith("Yes")).length;
  const wantSetupCount = data.filter((r) => r.want_setup?.startsWith("Yes") || r.want_setup?.startsWith("Maybe")).length;
  const veryConfidentCount = data.filter((r) => r.confidence_level?.startsWith("Very confident")).length;

  // Chart data
  const demoData = countByMulti(data, "most_useful_demo");
  const heardFromData = countBy(data, "heard_from");
  const confidenceData = countBy(data, "confidence_level");
  const kannadaData = countBy(data, "kannada_helped");
  const topicData = countBy(data, "topic_next");
  const oneOnOneData = countBy(data, "need_one_on_one");
  const wantSetupData = countBy(data, "want_setup");

  // Hot leads
  const hotLeads = data.filter(
    (r) =>
      r.want_setup === "Yes — please reach out to me" ||
      r.need_one_on_one === "Yes — I need hands-on help"
  );

  const barHeight = (items: number) => Math.max(items * 36, 120);

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
      <div className="h-[200px] rounded animate-pulse" style={{ backgroundColor: BRAND.bg }} />
    </div>
  );

  const HorizontalBarCard = ({
    title,
    chartData,
    color,
    yWidth = 160,
  }: {
    title: string;
    chartData: { name: string; count: number }[];
    color: string;
    yWidth?: number;
  }) => (
    <div className="bg-white rounded-xl p-4 border flex flex-col" style={{ borderColor: BRAND.border }}>
      <h3
        className="text-[10px] uppercase tracking-widest font-semibold mb-2 shrink-0"
        style={{ color: BRAND.muted }}
      >
        {title}
      </h3>
      <div style={{ height: barHeight(chartData.length) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={chartData} margin={{ left: 10, right: 30, top: 2, bottom: 2 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={yWidth}
              tick={{ fontSize: 10, fill: BRAND.muted }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<AnthropicTooltip />} cursor={{ fill: "rgba(217,119,87,0.06)" }} />
            <Bar dataKey="count" fill={color} radius={[0, 6, 6, 0]} barSize={16}>
              <LabelList dataKey="count" position="right" style={{ fontSize: 10, fill: BRAND.muted, fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.bg }}>
      <div className="max-w-7xl mx-auto px-5 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: BRAND.primary }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13.827 3.52L21.18 20.48H17.25L15.645 16.71H8.355L6.75 20.48H2.82L10.173 3.52H13.827ZM14.508 13.74L12 7.8L9.492 13.74H14.508Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1
                  className="font-bold text-2xl leading-none"
                  style={{
                    color: BRAND.text,
                    fontFamily: "var(--font-outfit), 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                  }}
                >
                  Post-Survey Dashboard
                </h1>
                {!loading && (
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: BRAND.primary, color: "#FFFFFF" }}
                  >
                    {data.length}
                  </span>
                )}
              </div>
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
              disabled={loading || !data.length}
              className="text-white rounded-lg px-3 py-1.5 text-xs transition-colors font-medium disabled:opacity-40"
              style={{ backgroundColor: BRAND.primary }}
            >
              CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-600 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchData} className="underline ml-4">
              Retry
            </button>
          </div>
        )}

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            <KPICard
              label="Total Responses"
              value={data.length}
              isNumeric
              color={BRAND.primary}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />
            <KPICard
              label="Need One-on-One"
              value={needOneOnOneCount}
              isNumeric
              color={BRAND.accent1}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
            <KPICard
              label="Want Setup"
              value={wantSetupCount}
              isNumeric
              color={BRAND.accent4}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              }
            />
            <KPICard
              label="Very Confident"
              value={veryConfidentCount}
              isNumeric
              color={BRAND.accent3}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
            />
          </div>
        )}

        {/* Charts */}
        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ShimmerChart />
              <ShimmerChart />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ShimmerChart />
              <ShimmerChart />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Row 1: Most Useful Demo + Heard From */}
            <div className="grid grid-cols-2 gap-4">
              <HorizontalBarCard title="Most Useful Demo" chartData={demoData} color={BRAND.primary} yWidth={180} />
              <HorizontalBarCard title="Heard From" chartData={heardFromData} color={BRAND.accent4} yWidth={160} />
            </div>

            {/* Row 2: Confidence Level + Kannada Helped */}
            <div className="grid grid-cols-2 gap-4">
              <HorizontalBarCard title="Confidence Level" chartData={confidenceData} color={BRAND.accent3} yWidth={180} />
              <HorizontalBarCard title="Kannada Helped" chartData={kannadaData} color={BRAND.accent5} yWidth={180} />
            </div>

            {/* Row 3: Topic Next + Need One-on-One (pie) */}
            <div className="grid grid-cols-2 gap-4">
              <HorizontalBarCard title="Topic Next" chartData={topicData} color={BRAND.accent2} yWidth={180} />

              {/* Need One-on-One — donut */}
              <div className="bg-white rounded-xl p-4 border flex flex-col" style={{ borderColor: BRAND.border }}>
                <h3
                  className="text-[10px] uppercase tracking-widest font-semibold mb-2 shrink-0"
                  style={{ color: BRAND.muted }}
                >
                  Need One-on-One
                </h3>
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={oneOnOneData}
                        cx="50%"
                        cy="45%"
                        innerRadius="35%"
                        outerRadius="60%"
                        paddingAngle={4}
                        dataKey="count"
                        nameKey="name"
                        strokeWidth={0}
                      >
                        {oneOnOneData.map((_, index) => (
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

            {/* Row 4: Want Setup — full width */}
            <HorizontalBarCard title="Want Setup" chartData={wantSetupData} color={BRAND.primary} yWidth={220} />

            {/* Hot Leads Table */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: BRAND.border }}>
              <div className="mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: BRAND.text }}>
                  <span
                    className="inline-block w-1 h-5 rounded-full"
                    style={{ backgroundColor: BRAND.primary }}
                  />
                  Hot Leads
                  {hotLeads.length > 0 && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full ml-1"
                      style={{ backgroundColor: BRAND.primary, color: "#FFFFFF" }}
                    >
                      {hotLeads.length}
                    </span>
                  )}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: BRAND.muted }}>
                  Respondents who want setup help or one-on-one guidance
                </p>
              </div>

              {hotLeads.length === 0 ? (
                <p className="text-sm py-8 text-center" style={{ color: BRAND.subtle }}>
                  No hot leads yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${BRAND.border}` }}>
                        {["Name", "Business Type", "Want Setup", "Need One-on-One", "Follow-up Method", "Contact Detail", "Submitted At"].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left py-2 px-3 text-[10px] uppercase tracking-widest font-semibold"
                              style={{ color: BRAND.muted }}
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {hotLeads.map((lead, idx) => {
                        const bothYes =
                          lead.want_setup?.includes("Yes") && lead.need_one_on_one?.includes("Yes");
                        return (
                          <tr
                            key={lead.id}
                            style={{
                              backgroundColor: bothYes
                                ? "#FEF3EE"
                                : idx % 2 === 0
                                ? "#FFFFFF"
                                : BRAND.bg,
                              borderBottom: `1px solid ${BRAND.border}`,
                            }}
                          >
                            <td className="py-2 px-3 font-medium" style={{ color: BRAND.text }}>
                              {lead.name || "—"}
                            </td>
                            <td className="py-2 px-3" style={{ color: BRAND.text }}>
                              {lead.business_type || "—"}
                            </td>
                            <td className="py-2 px-3" style={{ color: BRAND.text }}>
                              {lead.want_setup || "—"}
                            </td>
                            <td className="py-2 px-3" style={{ color: BRAND.text }}>
                              {lead.need_one_on_one || "—"}
                            </td>
                            <td className="py-2 px-3" style={{ color: BRAND.text }}>
                              {lead.follow_up_method || "—"}
                            </td>
                            <td className="py-2 px-3" style={{ color: BRAND.text }}>
                              {lead.contact_detail || "—"}
                            </td>
                            <td className="py-2 px-3 whitespace-nowrap" style={{ color: BRAND.muted }}>
                              {new Date(lead.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
