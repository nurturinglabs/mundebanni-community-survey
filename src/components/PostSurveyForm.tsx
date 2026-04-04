"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostSurveyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [mostUsefulDemo, setMostUsefulDemo] = useState<string[]>([]);
  const [heardFrom, setHeardFrom] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [kannadaHelped, setKannadaHelped] = useState("");
  const [topicNext, setTopicNext] = useState("");
  const [wantSetup, setWantSetup] = useState("");
  const [followUpMethod, setFollowUpMethod] = useState("");
  const [contactDetail, setContactDetail] = useState("");
  const [extraMessage, setExtraMessage] = useState("");

  const businessTypes = [
    "Retail Shop / Kirana Store",
    "Restaurant / Cloud Kitchen / Tiffin",
    "Wholesale / Distribution",
    "Pharmacy / Medical Store",
    "Coaching / Tuition / Education",
    "Freelancer / Consultant",
    "Agriculture / Farming",
    "I am thinking of starting a business",
    "Other",
  ];

  const demoOptions = [
    "Find First Client",
    "Business Idea Validator",
    "Weekly Menu Generator",
    "Invoice Dashboard",
    "Payment Tracker",
    "Staff Scheduling",
  ];

  const heardFromOptions = [
    "Twitter",
    "Linkedin",
    "Whatsapp group",
    "Friend referred",
    "Other",
  ];

  const confidenceOptions = [
    "Very confident — start today",
    "Somewhat — need more practice",
    "Not yet — need more guidance",
    "Still confused — please help",
  ];

  const kannadaOptions = [
    "Yes — much clearer",
    "Somewhat — mix worked well",
    "English was enough for me",
    "Need more Kannada — less English",
  ];

  const topicOptions = [
    "AI for Marketing — social media, ads",
    "AI for Customer Service — WhatsApp",
    "Claude Code — build your own app",
    "AI for Education — help your kids",
    "Voice AI — phone agents for business",
  ];

  const setupOptions = [
    "Yes — please reach out to me",
    "Maybe — I want to see a demo first",
    "No — I will set it up myself",
  ];

  const followUpOptions = [
    "WhatsApp",
    "Email",
    "Phone call",
    "Not interested in follow-up",
  ];

  const showFollowUp =
    wantSetup === "Yes — please reach out to me" ||
    wantSetup === "Maybe — I want to see a demo first";

  const toggleDemo = (option: string) => {
    setMostUsefulDemo((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!businessType) {
      setError("Please select your business type.");
      return;
    }
    if (mostUsefulDemo.length === 0) {
      setError("Please select at least one demo that was useful.");
      return;
    }
    if (!heardFrom) {
      setError("Please tell us how you heard about this webinar.");
      return;
    }
    if (!confidenceLevel) {
      setError("Please select your confidence level.");
      return;
    }
    if (!kannadaHelped) {
      setError("Please tell us if Kannada explanations helped.");
      return;
    }
    if (!topicNext) {
      setError("Please select a topic for the next session.");
      return;
    }
    if (!wantSetup) {
      setError("Please tell us if you want Claude setup for your business.");
      return;
    }
    if (showFollowUp && !followUpMethod) {
      setError("Please select your preferred follow-up method.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/post-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          business_type: businessType,
          most_useful_demo: mostUsefulDemo.join(", "),
          heard_from: heardFrom,
          confidence_level: confidenceLevel,
          kannada_helped: kannadaHelped,
          topic_next: topicNext,
          want_setup: wantSetup,
          follow_up_method: showFollowUp ? followUpMethod : null,
          contact_detail: showFollowUp ? contactDetail : null,
          extra_message: showFollowUp ? extraMessage : null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("prompts_unlocked", "true");
        router.push("/prompts");
      } else {
        setError("Something went wrong — please try again.");
      }
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-10 border border-[#E8E6DC] rounded-lg px-3 text-sm bg-white focus:border-[#D97757] focus:outline-none focus:ring-1 focus:ring-[#D97757] text-[#141413]";
  const labelClass = "text-xs font-medium text-[#141413] mb-1 block";
  const subLabelClass = "text-[11px] text-[#B0AEA5] font-kannada mb-2 block";

  const chipClass = (selected: boolean) =>
    `border-[1.5px] rounded-lg px-4 py-2 cursor-pointer text-sm transition-colors ${
      selected
        ? "border-[#D97757] bg-[#FEF3EE] text-[#D97757] font-semibold"
        : "border-[#E0DDD8] bg-white text-[#141413] hover:border-[#D97757]"
    }`;

  const chipClassWrap = (selected: boolean) =>
    `border-[1.5px] rounded-lg px-4 py-2 cursor-pointer text-sm transition-colors text-left ${
      selected
        ? "border-[#D97757] bg-[#FEF3EE] text-[#D97757] font-semibold"
        : "border-[#E0DDD8] bg-white text-[#141413] hover:border-[#D97757]"
    }`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-0">
      {/* ROW 1: Name + Business Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
        <div>
          <label className={labelClass}>Your name</label>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Business type *</label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className={`${inputClass} appearance-none`}
          >
            <option value="">-- Select --</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-[#ECEAE5] my-5" />

      {/* ROW 2: Most useful demo (multi-select, full width) */}
      <div>
        <label className={labelClass}>Which demo was most useful today? *</label>
        <span className={subLabelClass}>ಇವತ್ತು ಯಾವ demo ಹೆಚ್ಚು useful ಆಯ್ತು?</span>
        <div className="flex flex-wrap gap-2">
          {demoOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleDemo(option)}
              className={chipClass(mostUsefulDemo.includes(option))}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-[#ECEAE5] my-5" />

      {/* ROW 3: Heard from + Confidence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
        <div>
          <label className={labelClass}>How did you hear about this webinar? *</label>
          <span className={subLabelClass}>ಈ webinar ಬಗ್ಗೆ ಹೇಗೆ ತಿಳಿಯಿತು?</span>
          <div className="flex flex-col gap-1.5">
            {heardFromOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setHeardFrom(option)}
                className={chipClassWrap(heardFrom === option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>How confident do you feel using Claude now? *</label>
          <span className={subLabelClass}>Claude ಉಪಯೋಗಿಸಲು ಎಷ್ಟು confident ಅನಿಸ್ತಿದೆ?</span>
          <div className="flex flex-col gap-1.5">
            {confidenceOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setConfidenceLevel(option)}
                className={chipClassWrap(confidenceLevel === option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-[#ECEAE5] my-5" />

      {/* ROW 4: Kannada helped + Topic next */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
        <div>
          <label className={labelClass}>Did Kannada explanations help? *</label>
          <span className={subLabelClass}>Kannada ನಲ್ಲಿ explain ಆಯ್ತಾ?</span>
          <div className="flex flex-col gap-1.5">
            {kannadaOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setKannadaHelped(option)}
                className={chipClassWrap(kannadaHelped === option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Topic for next session? *</label>
          <span className={subLabelClass}>ಮುಂದಿನ session ಗೆ topic?</span>
          <div className="flex flex-col gap-1.5">
            {topicOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTopicNext(option)}
                className={chipClassWrap(topicNext === option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-[#ECEAE5] my-5" />

      {/* ROW 5: Want setup */}
      <div>
        <label className={labelClass}>Would you like us to set up Claude or do AI Automations for your business? *</label>
        <span className={subLabelClass}>ನಿಮ್ಮ business ಗೆ Claude setup ಅಥವಾ AI automation ಮಾಡಿಕೊಡಲಾ?</span>
        <div className="flex flex-wrap gap-2">
          {setupOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setWantSetup(option)}
              className={chipClass(wantSetup === option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* DIVIDER + ROW 6: Follow-up (conditional) */}
      {showFollowUp && (
        <>
          <div className="border-t border-[#ECEAE5] my-5" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
            <div>
              <label className={labelClass}>Best way to reach you for follow-up? *</label>
              <span className={subLabelClass}>Follow-up ಗೆ ಹೇಗೆ contact ಮಾಡಲಿ?</span>
              <div className="flex flex-col gap-1.5">
                {followUpOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFollowUpMethod(option)}
                    className={chipClassWrap(followUpMethod === option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div>
                <label className={labelClass}>Your WhatsApp or Email</label>
                <span className={subLabelClass}>ನಿಮ್ಮ WhatsApp number ಅಥವಾ Email (optional)</span>
                <input
                  type="text"
                  placeholder="+91 98765 43210 or name@email.com"
                  value={contactDetail}
                  onChange={(e) => setContactDetail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="mt-3">
                <label className={labelClass}>Any message for us?</label>
                <textarea
                  placeholder="Kannada or English..."
                  value={extraMessage}
                  onChange={(e) => setExtraMessage(e.target.value)}
                  className="w-full min-h-[72px] border border-[#E8E6DC] rounded-lg px-3 py-2 text-sm bg-white focus:border-[#D97757] focus:outline-none focus:ring-1 focus:ring-[#D97757] text-[#141413] resize-y"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Submit */}
      <div className="pt-6">
        {error && (
          <p className="text-red-600 text-xs text-center mb-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#D97757] hover:bg-[#C26644] text-white font-bold rounded-[10px] py-4 text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </>
          ) : (
            "Submit & Unlock Prompts →"
          )}
        </button>

        <p className="text-xs text-[#999] text-center mt-2 font-kannada">
          ನಿಮ್ಮ feedback ಕೊಟ್ಟ ತಕ್ಷಣ ಎಲ್ಲಾ prompts unlock ಆಗ್ತವೆ
        </p>
      </div>
    </form>
  );
}
