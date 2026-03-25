"use client";

import { useState, useEffect } from "react";
import PasswordGate from "@/components/PasswordGate";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("dash_auth");
    if (auth === "true") {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen dot-grid flex items-center justify-center">
        <div className="relative z-10 animate-spin h-8 w-8 border-4 border-[#E8E6DC] border-t-[#D97757] rounded-full" />
      </div>
    );
  }

  if (!authenticated) {
    return <PasswordGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  return <Dashboard />;
}
