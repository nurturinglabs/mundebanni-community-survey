import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, whatsapp, city, business_type, team_size, biggest_pain, ai_experience, language_preference, demo_request } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!business_type) {
      return NextResponse.json({ error: "Business type is required" }, { status: 400 });
    }

    const { error } = await supabase.from("registrations").insert([
      {
        name: name.trim(),
        whatsapp: whatsapp || null,
        city: city || null,
        business_type,
        team_size: team_size || null,
        biggest_pain: biggest_pain || null,
        ai_experience: ai_experience || null,
        language_preference: language_preference || null,
        demo_request: demo_request || null,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save registration" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
