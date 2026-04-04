"use client";

import PostSurveyForm from "@/components/PostSurveyForm";

export default function Home() {
  return (
    <main className="min-h-screen w-screen dot-grid flex lg:h-screen lg:overflow-hidden">
      {/* Left panel — branding */}
      <div className="relative z-10 hidden lg:flex flex-col justify-between w-[380px] shrink-0 bg-[#1A1A1A] text-white p-8">
        <div>
          <span className="inline-block bg-[#D97757] text-white rounded-full px-3 py-1 text-xs font-medium mb-6">
            Post-Webinar · April 4, 2026
          </span>
          <h1 className="font-outfit font-extrabold text-[32px] leading-tight mb-3">
            Claude - SuperPower for your Business
          </h1>
          <p className="text-sm text-white/35 font-kannada mb-5">
            ನಿಮ್ಮ feedback ಕೊಡಿ · ಧನ್ಯವಾದಗಳು
          </p>

          <div className="border-t border-white/10 pt-5">
            <p className="text-[10px] uppercase tracking-widest text-[#D97757] mb-3">
              WHAT YOU UNLOCK
            </p>

            <div className="bg-[rgba(217,119,87,0.1)] border border-[rgba(217,119,87,0.25)] rounded-[10px] p-4 mb-6">
              <p className="text-[13px] font-bold text-[#D97757] mb-2">
                🔓 Survey ಮಾಡಿದ ನಂತರ
              </p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-[#D97757] text-xs mt-0.5">●</span>
                  <span className="text-xs text-white/70">3 Claude Chat prompts</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#D97757] text-xs mt-0.5">●</span>
                  <span className="text-xs text-white/70">3 Claude Cowork prompts</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#D97757] text-xs mt-0.5">●</span>
                  <span className="text-xs text-white/70">English + Kannada versions</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#D97757] text-xs mt-0.5">●</span>
                  <span className="text-xs text-white/70">One-click copy for each</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] uppercase tracking-widest text-[#D97757] mb-3">
              TODAY&apos;S SESSION
            </p>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="text-[#D97757] text-xs mt-0.5">●</span>
                <span className="text-xs text-white/70">Claude Chat — Live Demos</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#D97757] text-xs mt-0.5">●</span>
                <span className="text-xs text-white/70">Claude Cowork — Live Demos</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#D97757] text-xs mt-0.5">●</span>
                <span className="text-xs text-white/70">Claude Code — What you can build</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/25">
          Hosted by Munde Banni · <span className="font-kannada">ಮುಂದೆ ಬನ್ನಿ</span>
        </p>
      </div>

      {/* Right panel — form */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="w-full max-w-[860px] mx-auto bg-white border border-[#E8E6DC] rounded-xl p-5 lg:p-8">
          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-outfit font-semibold text-lg text-[#141413]">
                  Tell us about your experience
                </h2>
                <p className="font-inter text-[12px] text-[#B0AEA5]">
                  <span className="font-kannada">ನಿಮ್ಮ ಅನುಭವ ಹೇಳಿ</span> · Your feedback unlocks all prompts.
                </p>
              </div>
              <span className="lg:hidden inline-block bg-[#D97757] text-white rounded-full px-3 py-1 text-[10px] font-medium">
                Post-Webinar
              </span>
            </div>
          </div>

          {/* Form */}
          <PostSurveyForm />
        </div>
      </div>
    </main>
  );
}
