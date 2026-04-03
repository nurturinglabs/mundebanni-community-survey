"use client";

import { useEffect, useState, useRef, ReactNode } from "react";

interface KPICardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  isNumeric?: boolean;
  color?: string;
}

export default function KPICard({ label, value, icon, isNumeric = false, color = "#D97757" }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(isNumeric ? 0 : value);
  const prevValueRef = useRef<number>(0);

  useEffect(() => {
    if (!isNumeric || typeof value !== "number") {
      setDisplayValue(value);
      return;
    }

    const startValue = prevValueRef.current;
    const endValue = value;
    prevValueRef.current = endValue;

    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isNumeric]);

  return (
    <div className="bg-white border border-[#E8E0D0] rounded-xl px-4 py-3 flex items-center gap-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 min-w-0">
          <span style={{ color }} className="shrink-0">{icon}</span>
          <div className="min-w-0">
            <p className={`text-xl font-bold leading-none ${isNumeric ? "" : "text-sm"}`}
               style={{ color: "#1A1714", fontFamily: isNumeric ? "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" : "var(--font-outfit), sans-serif" }}>
              {displayValue}
            </p>
            <p className="text-[9px] uppercase tracking-widest mt-0.5 truncate" style={{ color: "#8C8579" }}>
              {label}
            </p>
          </div>
        </div>
        <svg width="48" height="20" viewBox="0 0 48 20" fill="none" className="shrink-0 hidden xl:block">
          <path
            d="M0 15 L7 12 L14 14 L21 9 L28 11 L35 6 L42 8 L48 3"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}
