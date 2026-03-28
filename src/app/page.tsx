"use client";

import { useState } from "react";
import RegistrationForm from "@/components/RegistrationForm";

type Lang = "en" | "kn";

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <main className="min-h-screen w-screen dot-grid flex lg:h-screen lg:overflow-hidden">
      {/* Left panel — branding */}
      <div className="relative z-10 hidden lg:flex flex-col justify-between w-[360px] shrink-0 bg-[#141413] text-white p-8">
        <div>
          <span className="inline-block bg-[#D97757] text-white rounded-full px-3 py-1 text-xs font-medium mb-6">
            Free · Kannada · April 2026
          </span>
          <h1 className="font-outfit font-extrabold text-[32px] leading-tight mb-1">
            SuperPower for<br />your Business
          </h1>
          <p className="text-sm text-white/70 mb-1">
            How Claude AI can automate your business tasks
          </p>
          <p className="text-sm text-white/40 font-kannada mb-3">
            ನಿಮ್ಮ business ಗೆ AI superpower ಕೊಡಿ
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-base">📅</span>
              <span className="text-sm text-white/80">Saturday, April 4, 2026</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base">🕕</span>
              <span className="text-sm text-white/80">11:00 AM IST</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
              ಏನು ಕಲಿಯುತ್ತೀರಿ · What you will learn
            </p>

            <p className="text-[10px] uppercase tracking-widest text-[#D97757] mb-1.5">Claude Chat — Live Demos</p>
            <div className="space-y-1 mb-3">
              <div className="flex items-start gap-2">
                <span className="text-[#D97757] text-xs mt-0.5">✓</span>
                <span className="text-xs text-white/70">Validate a business idea instantly</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#D97757] text-xs mt-0.5">✓</span>
                <span className="text-xs text-white/70">Do market research in 30 seconds</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#D97757] text-xs mt-0.5">✓</span>
                <span className="text-xs text-white/70">Generate recipes, flyers & 30-day plans</span>
              </div>
            </div>

            <p className="text-[10px] uppercase tracking-widest text-[#D97757] mb-1.5">Claude Cowork — Live Demos</p>
            <div className="space-y-1 mb-3">
              <div className="flex items-start gap-2">
                <span className="text-[#D97757] text-xs mt-0.5">✓</span>
                <span className="text-xs text-white/70">Turn messy invoices into spend dashboards</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#D97757] text-xs mt-0.5">✓</span>
                <span className="text-xs text-white/70">Get sales insights and business recommendations</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#D97757] text-xs mt-0.5">✓</span>
                <span className="text-xs text-white/70">Automate payment reminders in Kannada</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#D97757] text-xs mt-0.5">✓</span>
                <span className="text-xs text-white/70">Build interactive analytics dashboards</span>
              </div>
            </div>

          </div>
        </div>

        <p className="text-xs text-white/30">
          Hosted by Munde Banni · <span className="font-kannada">ಮುಂದೆ ಬನ್ನಿ</span>
        </p>
      </div>

      {/* Right panel — form fills entire remaining space */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 lg:p-6 overflow-y-auto">
        <div className="w-full max-w-[860px] bg-white border border-[#E8E6DC] rounded-xl p-5 lg:p-8 flex flex-col lg:h-full">
          {/* Header */}
          <div className="mb-4 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-outfit font-semibold text-lg text-[#141413]">
                  {lang === "en" ? "Tell us about your business" : "ನಿಮ್ಮ business ಬಗ್ಗೆ ಹೇಳಿ"}
                </h2>
                <p className="font-inter text-[12px] text-[#B0AEA5]">
                  {lang === "en"
                    ? <><span className="font-kannada">ನಿಮ್ಮ business ಬಗ್ಗೆ ಹೇಳಿ</span> · Helps us tailor the webinar for you.</>
                    : "ನಿಮಗಾಗಿ webinar plan ಮಾಡಲು ಸಹಾಯ ಆಗುತ್ತೆ."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLang(lang === "en" ? "kn" : "en")}
                  className="flex items-center gap-1.5 border border-[#E8E6DC] rounded-full px-3 py-1 text-xs font-medium text-[#141413] hover:border-[#D97757] transition-colors"
                >
                  <span className="text-sm">🌐</span>
                  {lang === "en" ? "ಕನ್ನಡ" : "English"}
                </button>
                <span className="lg:hidden inline-block bg-[#D97757] text-white rounded-full px-3 py-1 text-[10px] font-medium">
                  Free · April 2026
                </span>
              </div>
            </div>
          </div>

          {/* Form takes remaining space */}
          <div className="flex-1">
            <RegistrationForm lang={lang} />
          </div>
        </div>
      </div>
    </main>
  );
}
