"use client";

import { useState } from "react";

interface PasswordGateProps {
  onAuthenticated: () => void;
}

export default function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("dash_auth", "true");
        onAuthenticated();
      } else {
        setError("Incorrect password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="w-full max-w-sm">
        <div className="bg-white border border-[#E8E0D0] rounded-xl p-8 text-center">
          <svg
            className="mx-auto mb-4"
            style={{ color: "#8C8579" }}
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <h2 className="font-outfit font-semibold text-xl mb-6" style={{ color: "#1A1714" }}>
            Dashboard Access
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 border border-[#E8E0D0] rounded-lg px-4 text-sm bg-white focus:border-[#D97757] focus:outline-none focus:ring-1 focus:ring-[#D97757]"
              style={{ color: "#1A1714" }}
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#D97757" }}
            >
              {loading ? "Checking..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
