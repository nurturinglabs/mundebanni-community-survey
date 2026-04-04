"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PromptsPage from "@/components/PromptsPage";

export default function Prompts() {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const val = sessionStorage.getItem("prompts_unlocked");
      if (val) {
        setUnlocked(true);
      } else {
        router.replace("/");
      }
    }
  }, [router]);

  if (!unlocked) return null;

  return <PromptsPage />;
}
