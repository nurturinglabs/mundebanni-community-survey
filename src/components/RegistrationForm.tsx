"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BUSINESS_TYPES = [
  "",
  "Retail Shop / Kirana Store",
  "Restaurant / Cloud Kitchen / Tiffin",
  "Boutique / Clothing / Fashion",
  "Wholesale / Distribution",
  "Pharmacy / Medical Store",
  "Coaching / Tuition / Education",
  "Freelancer / Consultant",
  "Agriculture / Farming",
  "I am thinking of starting a business",
  "Other",
];

const TEAM_SIZES = ["Just me", "2–5", "6–20", "20+"];

const PAIN_POINTS = [
  "",
  "Too many calls to handle",
  "Chasing payments from customers",
  "Writing content, posts, menus",
  "Tracking bills and expenses",
  "No time for planning or growth",
  "Managing staff and schedules",
  "Finding new customers",
];

const AI_EXPERIENCE = [
  "Never heard of it",
  "Heard but never tried",
  "Tried once or twice",
  "Use it sometimes",
  "Use it regularly",
];

const AUTOMATE_OPTIONS = [
  "Invoices & billing",
  "Payment reminders",
  "Social media content",
  "Customer follow-ups",
  "Sales reports",
  "Staff scheduling",
  "Menu / catalogue updates",
  "Answering customer calls",
];

const LANGUAGES = ["ಕನ್ನಡ ಮಾತ್ರ", "English", "Both"];

export default function RegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [biggestPain, setBiggestPain] = useState("");
  const [aiExperience, setAiExperience] = useState("");
  const [automateWish, setAutomateWish] = useState<string[]>([]);
  const [languagePreference, setLanguagePreference] = useState("");

  const toggleAutomate = (option: string) => {
    setAutomateWish((prev) => {
      if (prev.includes(option)) return prev.filter((o) => o !== option);
      if (prev.length >= 2) return [prev[1], option];
      return [...prev, option];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!businessType) {
      setError("Please select your business type");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          city,
          business_type: businessType,
          team_size: teamSize,
          biggest_pain: biggestPain,
          ai_experience: aiExperience,
          automate_wish: automateWish.join(", "),
          language_preference: languagePreference,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/thank-you");
      } else {
        setError("ಏನೋ ತಪ್ಪಾಯ್ತೆ — ದಯವಿಟ್ಟು ಮತ್ತೆ try ಮಾಡಿ.");
      }
    } catch {
      setError("ಏನೋ ತಪ್ಪಾಯ್ತೆ — ದಯವಿಟ್ಟು ಮತ್ತೆ try ಮಾಡಿ.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-10 border border-[#E8E6DC] rounded-lg px-3 text-sm bg-white focus:border-[#D97757] focus:outline-none focus:ring-1 focus:ring-[#D97757] text-[#141413]";
  const labelClass = "text-xs font-medium text-[#141413] mb-1 block";
  const radioClass = (selected: boolean) =>
    `border rounded-lg py-2 px-2 cursor-pointer text-center text-xs transition-colors ${
      selected
        ? "border-[#D97757] bg-[#FEF3EE] text-[#141413] font-medium"
        : "border-[#E8E6DC] bg-white text-[#141413] hover:border-[#D97757]"
    }`;

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      {/* All fields in a grid */}
      <div className="flex-1 grid grid-cols-2 gap-x-5 gap-y-3 content-start">
        {/* Row 1: Name + City */}
        <div>
          <label className={labelClass}>Your name *</label>
          <input
            type="text"
            required
            placeholder="ನಿಮ್ಮ ಹೆಸರು"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Your city</label>
          <input
            type="text"
            placeholder="Bengaluru, Mysuru, Hubli..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Row 2: Business Type + Biggest Pain */}
        <div>
          <label className={labelClass}>Business type *</label>
          <select
            required
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className={`${inputClass} appearance-none`}
          >
            <option value="">-- Select --</option>
            {BUSINESS_TYPES.filter(Boolean).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Biggest daily challenge?</label>
          <select
            value={biggestPain}
            onChange={(e) => setBiggestPain(e.target.value)}
            className={`${inputClass} appearance-none`}
          >
            <option value="">-- Select --</option>
            {PAIN_POINTS.filter(Boolean).map((pain) => (
              <option key={pain} value={pain}>
                {pain}
              </option>
            ))}
          </select>
        </div>

        {/* Row 3: Automate with AI (pick 2, 4 cols) */}
        <div className="col-span-2">
          <label className={labelClass}>Pick two things you want to automate using AI</label>
          <div className="grid grid-cols-4 gap-2">
            {AUTOMATE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleAutomate(option)}
                className={radioClass(automateWish.includes(option))}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Team Size (4 across) */}
        <div className="col-span-2">
          <label className={labelClass}>Team size</label>
          <div className="grid grid-cols-4 gap-2">
            {TEAM_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setTeamSize(size)}
                className={radioClass(teamSize === size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: AI Experience */}
        <div className="col-span-2">
          <label className={labelClass}>Used AI tools before?</label>
          <div className="grid grid-cols-5 gap-2">
            {AI_EXPERIENCE.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setAiExperience(level)}
                className={radioClass(aiExperience === level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Row 5: Language Preference (3 across) */}
        <div className="col-span-2">
          <label className={labelClass}>Preferred language</label>
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguagePreference(lang)}
                className={radioClass(languagePreference === lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section — error + submit */}
      <div className="shrink-0 pt-4">
        {error && (
          <p className="text-red-600 text-xs text-center mb-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#D97757] hover:bg-[#C26644] text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Registering...
            </>
          ) : (
            "Submit →"
          )}
        </button>

        <p className="text-[11px] text-[#B0AEA5] text-center mt-2">
          Takes 30 seconds. Helps us plan a better session for you.
        </p>
      </div>
    </form>
  );
}
