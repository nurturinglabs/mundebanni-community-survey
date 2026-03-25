"use client";

import { useEffect, useState, useRef } from "react";

interface KPICardProps {
  label: string;
  value: string | number;
  isNumeric?: boolean;
}

export default function KPICard({ label, value, isNumeric = false }: KPICardProps) {
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
      // ease-out
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
    <div className="bg-white border border-[#E8E6DC] rounded-xl p-5 border-t-[3px] border-t-[#D97757]">
      <p className="text-[10px] uppercase tracking-widest text-[#B0AEA5] mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold text-[#141413] font-outfit ${isNumeric ? "font-mono" : ""}`}>
        {displayValue}
      </p>
    </div>
  );
}
