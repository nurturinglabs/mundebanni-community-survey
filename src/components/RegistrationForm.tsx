"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Lang = "en" | "kn";

const t = {
  en: {
    toggleLabel: "ಕನ್ನಡ",
    toggleLabelAlt: "English",
    name: "Your name *",
    namePlaceholder: "Your name",
    city: "Your city",
    cityPlaceholder: "Bengaluru, Mysuru, Hubli...",
    businessType: "Business type *",
    selectDefault: "-- Select --",
    biggestPain: "Biggest daily challenge?",
    automate: "What do you want to automate using AI? (select all that apply)",
    teamSize: "Team size",
    aiExperience: "Used AI tools before?",
    languagePref: "Preferred language",
    demoRequest: "What demo would you like to see in the webinar?",
    demoPlaceholder: "e.g. invoice automation, WhatsApp bot, social media posts...",
    submit: "Submit →",
    submitting: "Registering...",
    footer: "Takes 30 seconds. Helps us plan a better session for you.",
    errorName: "Please enter your name",
    errorBusiness: "Please select your business type",
    errorGeneric: "Something went wrong — please try again.",
    businessTypes: [
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
    ],
    painPoints: [
      "Too many calls to handle",
      "Chasing payments from customers",
      "Writing content, posts, menus",
      "Tracking bills and expenses",
      "No time for planning or growth",
      "Managing staff and schedules",
      "Finding new customers",
    ],
    automateOptions: [
      "Invoices & billing",
      "Payment reminders",
      "Social media content",
      "Customer follow-ups",
      "Sales reports",
      "Staff scheduling",
      "Menu / catalogue updates",
      "Answering customer calls",
      "Not sure yet",
    ],
    teamSizes: ["Just me", "2–5", "6–20", "20+"],
    aiLevels: [
      "Never heard of it",
      "Heard but never tried",
      "Tried once or twice",
      "Use it sometimes",
      "Use it regularly",
    ],
    languages: ["ಕನ್ನಡ ಮಾತ್ರ", "English", "Both"],
  },
  kn: {
    toggleLabel: "English",
    toggleLabelAlt: "ಕನ್ನಡ",
    name: "ನಿಮ್ಮ ಹೆಸರು *",
    namePlaceholder: "ನಿಮ್ಮ ಹೆಸರು",
    city: "ನಿಮ್ಮ ಊರು",
    cityPlaceholder: "ಬೆಂಗಳೂರು, ಮೈಸೂರು, ಹುಬ್ಬಳ್ಳಿ...",
    businessType: "ವ್ಯಾಪಾರದ ವಿಧ *",
    selectDefault: "-- ಆಯ್ಕೆ ಮಾಡಿ --",
    biggestPain: "ದಿನನಿತ್ಯದ ದೊಡ್ಡ ಸಮಸ್ಯೆ?",
    automate: "AI ಬಳಸಿ ಏನನ್ನು automate ಮಾಡಬೇಕು? (ಎಲ್ಲಾ ಆಯ್ಕೆ ಮಾಡಿ)",
    teamSize: "ಎಷ್ಟು ಜನ ಇದ್ದಾರೆ?",
    aiExperience: "ಮೊದಲು AI tools ಬಳಸಿದ್ದೀರಾ?",
    languagePref: "ಆದ್ಯತೆಯ ಭಾಷೆ",
    demoRequest: "Webinar ನಲ್ಲಿ ಯಾವ demo ನೋಡಬೇಕು ಅಂತ ಇಷ್ಟಪಡ್ತೀರಿ?",
    demoPlaceholder: "ಉದಾ: invoice automation, WhatsApp bot, social media posts...",
    submit: "ಸಲ್ಲಿಸಿ →",
    submitting: "ನೋಂದಣಿ ಆಗ್ತಿದೆ...",
    footer: "30 ಸೆಕೆಂಡ್ ಸಾಕು. ನಿಮಗಾಗಿ ಉತ್ತಮ session plan ಮಾಡಲು ಸಹಾಯ ಆಗುತ್ತೆ.",
    errorName: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ",
    errorBusiness: "ದಯವಿಟ್ಟು ವ್ಯಾಪಾರದ ವಿಧ ಆಯ್ಕೆ ಮಾಡಿ",
    errorGeneric: "ಏನೋ ತಪ್ಪಾಯ್ತೆ — ದಯವಿಟ್ಟು ಮತ್ತೆ try ಮಾಡಿ.",
    businessTypes: [
      "ಕಿರಾಣಿ / ರಿಟೇಲ್ ಅಂಗಡಿ",
      "ರೆಸ್ಟೋರೆಂಟ್ / ಕ್ಲೌಡ್ ಕಿಚನ್ / ಟಿಫಿನ್",
      "ಬುಟೀಕ್ / ಬಟ್ಟೆ / ಫ್ಯಾಷನ್",
      "ಹೋಲ್‌ಸೇಲ್ / ವಿತರಣೆ",
      "ಫಾರ್ಮಸಿ / ಮೆಡಿಕಲ್ ಸ್ಟೋರ್",
      "ಕೋಚಿಂಗ್ / ಟ್ಯೂಷನ್ / ಶಿಕ್ಷಣ",
      "ಫ್ರೀಲಾನ್ಸರ್ / ಕನ್ಸಲ್ಟೆಂಟ್",
      "ಕೃಷಿ / ಬೇಸಾಯ",
      "ವ್ಯಾಪಾರ ಶುರು ಮಾಡಬೇಕು ಅಂತ ಯೋಚನೆ ಇದೆ",
      "ಇತರೆ",
    ],
    painPoints: [
      "ತುಂಬಾ calls, handle ಮಾಡೋಕೆ ಕಷ್ಟ",
      "ಗ್ರಾಹಕರಿಂದ ಹಣ ವಸೂಲಿ ಕಷ್ಟ",
      "Content, posts, menu ಬರೆಯೋದು",
      "Bills ಮತ್ತು ಖರ್ಚು track ಮಾಡೋದು",
      "Planning / growth ಗೆ ಸಮಯ ಇಲ್ಲ",
      "Staff ಮತ್ತು schedule manage ಮಾಡೋದು",
      "ಹೊಸ ಗ್ರಾಹಕರನ್ನ ಹುಡುಕೋದು",
    ],
    automateOptions: [
      "ಇನ್‌ವಾಯ್ಸ್ & ಬಿಲ್ಲಿಂಗ್",
      "ಪಾವತಿ ರಿಮೈಂಡರ್",
      "ಸೋಶಿಯಲ್ ಮೀಡಿಯಾ ಕಂಟೆಂಟ್",
      "ಗ್ರಾಹಕರ ಫಾಲೋ-ಅಪ್",
      "ಮಾರಾಟ ವರದಿಗಳು",
      "Staff scheduling",
      "ಮೆನು / ಕ್ಯಾಟಲಾಗ್ ಅಪ್‌ಡೇಟ್",
      "ಗ್ರಾಹಕರ calls ಗೆ ಉತ್ತರ",
      "ಇನ್ನೂ ಗೊತ್ತಿಲ್ಲ",
    ],
    teamSizes: ["ನಾನೊಬ್ಬನೇ", "2–5", "6–20", "20+"],
    aiLevels: [
      "ಕೇಳಿಲ್ಲ",
      "ಕೇಳಿದ್ದೇನೆ, ಬಳಸಿಲ್ಲ",
      "ಒಂದೆರಡು ಸಲ try ಮಾಡಿದ್ದೇನೆ",
      "ಆಗಾಗ ಬಳಸ್ತೇನೆ",
      "ನಿಯಮಿತವಾಗಿ ಬಳಸ್ತೇನೆ",
    ],
    languages: ["ಕನ್ನಡ ಮಾತ್ರ", "English", "ಎರಡೂ"],
  },
};

export default function RegistrationForm({ lang }: { lang: Lang }) {
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
  const [demoRequest, setDemoRequest] = useState("");

  const l = t[lang];

  const toggleAutomate = (option: string) => {
    setAutomateWish((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError(l.errorName);
      return;
    }
    if (!businessType) {
      setError(l.errorBusiness);
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
          demo_request: demoRequest,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/thank-you");
      } else {
        setError(l.errorGeneric);
      }
    } catch {
      setError(l.errorGeneric);
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
          <label className={labelClass}>{l.name}</label>
          <input
            type="text"
            required
            placeholder={l.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{l.city}</label>
          <input
            type="text"
            placeholder={l.cityPlaceholder}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Row 2: Business Type + Biggest Pain */}
        <div>
          <label className={labelClass}>{l.businessType}</label>
          <select
            required
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className={`${inputClass} appearance-none`}
          >
            <option value="">{l.selectDefault}</option>
            {l.businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{l.biggestPain}</label>
          <select
            value={biggestPain}
            onChange={(e) => setBiggestPain(e.target.value)}
            className={`${inputClass} appearance-none`}
          >
            <option value="">{l.selectDefault}</option>
            {l.painPoints.map((pain) => (
              <option key={pain} value={pain}>
                {pain}
              </option>
            ))}
          </select>
        </div>

        {/* Row 3: Automate with AI (pick 2, 4 cols) */}
        <div className="col-span-2">
          <label className={labelClass}>{l.automate}</label>
          <div className="grid grid-cols-4 gap-2">
            {l.automateOptions.map((option) => (
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
          <label className={labelClass}>{l.teamSize}</label>
          <div className="grid grid-cols-4 gap-2">
            {l.teamSizes.map((size) => (
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

        {/* Row 5: AI Experience */}
        <div className="col-span-2">
          <label className={labelClass}>{l.aiExperience}</label>
          <div className="grid grid-cols-5 gap-2">
            {l.aiLevels.map((level) => (
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

        {/* Row 6: Language Preference (3 across) */}
        <div className="col-span-2">
          <label className={labelClass}>{l.languagePref}</label>
          <div className="grid grid-cols-3 gap-2">
            {l.languages.map((langOption) => (
              <button
                key={langOption}
                type="button"
                onClick={() => setLanguagePreference(langOption)}
                className={radioClass(languagePreference === langOption)}
              >
                {langOption}
              </button>
            ))}
          </div>
        </div>

        {/* Row 7: Demo Request (new question) */}
        <div className="col-span-2">
          <label className={labelClass}>{l.demoRequest}</label>
          <input
            type="text"
            placeholder={l.demoPlaceholder}
            value={demoRequest}
            onChange={(e) => setDemoRequest(e.target.value)}
            className={inputClass}
          />
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
              {l.submitting}
            </>
          ) : (
            l.submit
          )}
        </button>

        <p className="text-[11px] text-[#B0AEA5] text-center mt-2">
          {l.footer}
        </p>
      </div>
    </form>
  );
}
