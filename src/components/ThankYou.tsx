"use client";

import Link from "next/link";

export default function ThankYou() {
  const handleShare = () => {
    const text = encodeURIComponent(
      "SuperPower for your Business — Free Kannada AI Webinar on April 4, 11AM. Fill the quick survey: " +
        window.location.origin
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen dot-grid flex items-center justify-center px-4 py-12">
      <div className="relative z-10 w-full max-w-[480px]">
        <div className="bg-white border border-[#E8E6DC] rounded-xl p-8 text-center">
          {/* Checkmark circle */}
          <div className="w-16 h-16 rounded-full bg-[#D97757] flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="font-outfit font-extrabold text-[28px] text-[#141413] mb-1">
            ಧನ್ಯವಾದಗಳು! 🎉
          </h1>
          <p className="font-outfit text-base text-[#141413]">Thank you for sharing!</p>

          {/* Details box */}
          <div className="bg-[#FEF3EE] border-l-4 border-[#D97757] rounded-xl p-5 mt-6 text-left">
            <p className="text-sm text-[#141413] font-medium mb-2">Webinar details:</p>
            <div className="flex items-center gap-2 text-sm mb-2">
              <span>📅</span>
              <span>Saturday, April 4, 2026</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>🕕</span>
              <span>11:00 AM IST</span>
            </div>
          </div>

          {/* Note */}
          <p className="font-inter italic text-sm text-[#B0AEA5] text-center mt-6 font-kannada">
            ನಿಮ್ಮ inputs ನಮಗೆ webinar plan ಮಾಡೋಕೆ ತುಂಬಾ help ಆಗ್ತೆ. ಸಮಯಕ್ಕೆ ಬನ್ನಿ!
          </p>

          {/* WhatsApp share button */}
          <button
            onClick={handleShare}
            className="w-full h-12 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold rounded-lg mt-6 transition-colors"
          >
            Share with a friend →
          </button>

          {/* Submit another */}
          <Link
            href="/"
            className="inline-block text-sm text-[#B0AEA5] underline mt-4"
          >
            ← Submit another response
          </Link>
        </div>
      </div>
    </div>
  );
}
