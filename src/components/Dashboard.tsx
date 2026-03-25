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

function relativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    }
    return `Yesterday ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  if (diffHours < 48) {
    return `Yesterday ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  return date.toLocaleDateString();
}

const AI_ORDER = [
  "Never heard of it",
  "Heard but never tried",
  "Tried once or twice",
  "Use it sometimes",
  "Use it regularly",
];

const AI_COLORS = ["#E8E6DC", "#D4D2C8", "#B0AEA5", "#C26644", "#D97757"];
const PIE_COLORS = ["#D97757", "#788C5D", "#B0AEA5"];

export default function Dashboard() {
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);

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
      setSecondsAgo(0);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  const handleDownloadCSV = () => {
    const csv = generateCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `webinar_registrations_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const todayCount = data.filter((r) => {
    const today = new Date().toDateString();
    return new Date(r.created_at).toDateString() === today;
  }).length;

  const businessData = countBy(data, "business_type");
  const painData = countBy(data, "biggest_pain");

  const aiData = AI_ORDER.map((level) => ({
    name: level,
    count: data.filter((r) => r.ai_experience === level).length,
  }));

  const langData = countBy(data, "language_preference");

  const recentRows = data.slice(0, 25);

  if (error && !data.length) {
    return (
      <div className="min-h-screen dot-grid flex items-center justify-center px-4">
        <div className="relative z-10 bg-white border border-[#E8E6DC] rounded-xl p-8 max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-[#D97757] hover:bg-[#C26644] text-white font-semibold rounded-lg px-6 py-2 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dot-grid">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
          <div className="flex items-center gap-3">
            <h1 className="font-outfit font-bold text-xl text-[#141413]">Webinar Dashboard</h1>
            <span className="bg-[#D97757] text-white rounded-full px-3 py-1 text-xs font-medium font-mono">
              {data.length}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="border border-[#E8E6DC] rounded-lg px-4 py-2 text-sm hover:bg-[#EDE8E0] transition-colors"
            >
              ↻ Refresh
            </button>
            <button
              onClick={handleDownloadCSV}
              className="bg-[#D97757] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#C26644] transition-colors"
            >
              ⬇ Download CSV
            </button>
          </div>
        </div>

        <p className="text-xs text-[#B0AEA5] mb-8">
          Last updated {secondsAgo} seconds ago · Auto-refreshes every 60s
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm text-red-600 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchData} className="underline ml-4">Retry</button>
          </div>
        )}

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-[#E8E6DC] rounded-xl p-5 border-t-[3px] border-t-[#D97757]">
                <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-20" />
                <div className="h-8 bg-gray-200 rounded animate-pulse w-12" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <KPICard label="Total Registrations" value={data.length} isNumeric />
            <KPICard label="Registered Today" value={todayCount} isNumeric />
            <KPICard label="Top Business Type" value={getTopValue(data, "business_type")} />
            <KPICard label="Top Pain Point" value={getTopValue(data, "biggest_pain")} />
          </div>
        )}

        {/* Charts */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-[#E8E6DC] rounded-xl p-5">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-40" />
                <div className="h-[260px] bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Chart 1 - Business types */}
            <div className="bg-white border border-[#E8E6DC] rounded-xl p-5">
              <h3 className="font-outfit font-semibold text-sm text-[#141413] mb-4">
                What businesses registered?
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={businessData} margin={{ left: 20, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#D97757" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2 - Pain points */}
            <div className="bg-white border border-[#E8E6DC] rounded-xl p-5">
              <h3 className="font-outfit font-semibold text-sm text-[#141413] mb-4">
                What are their biggest challenges?
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={painData} margin={{ left: 20, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#B0AEA5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 3 - AI experience */}
            <div className="bg-white border border-[#E8E6DC] rounded-xl p-5">
              <h3 className="font-outfit font-semibold text-sm text-[#141413] mb-4">
                AI experience level
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aiData} margin={{ bottom: 60 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, angle: -30, textAnchor: "end" }} interval={0} height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {aiData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={AI_COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 4 - Language preference */}
            <div className="bg-white border border-[#E8E6DC] rounded-xl p-5">
              <h3 className="font-outfit font-semibold text-sm text-[#141413] mb-4">
                Language preference
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={langData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                    label
                  >
                    {langData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Registrations Table */}
        <div className="bg-white border border-[#E8E6DC] rounded-xl p-5">
          <h3 className="font-outfit font-semibold text-base text-[#141413] mb-4">
            Recent Registrations
          </h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#E8E6DC]">
                    <th className="text-xs uppercase text-[#B0AEA5] pb-3 pr-4 font-medium tracking-wider">Time</th>
                    <th className="text-xs uppercase text-[#B0AEA5] pb-3 pr-4 font-medium tracking-wider">Name</th>
                    <th className="text-xs uppercase text-[#B0AEA5] pb-3 pr-4 font-medium tracking-wider">City</th>
                    <th className="text-xs uppercase text-[#B0AEA5] pb-3 pr-4 font-medium tracking-wider">Business Type</th>
                    <th className="text-xs uppercase text-[#B0AEA5] pb-3 pr-4 font-medium tracking-wider">Pain</th>
                    <th className="text-xs uppercase text-[#B0AEA5] pb-3 font-medium tracking-wider">AI Level</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRows.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`text-sm ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"}`}
                    >
                      <td className="py-2.5 pr-4 text-[#B0AEA5] whitespace-nowrap text-xs">
                        {relativeTime(row.created_at)}
                      </td>
                      <td className="py-2.5 pr-4 font-medium text-[#141413]">{row.name}</td>
                      <td className="py-2.5 pr-4 text-[#141413]">{row.city || "—"}</td>
                      <td className="py-2.5 pr-4 text-[#141413]">{row.business_type || "—"}</td>
                      <td className="py-2.5 pr-4 text-[#141413]">{row.biggest_pain || "—"}</td>
                      <td className="py-2.5 text-[#141413]">{row.ai_experience || "—"}</td>
                    </tr>
                  ))}
                  {recentRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#B0AEA5]">
                        No registrations yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
