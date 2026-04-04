import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, business_type, most_useful_demo, heard_from, confidence_level, kannada_helped, topic_next, want_setup, follow_up_method, contact_detail, extra_message } = body;

    if (!business_type) {
      return NextResponse.json({ error: "Business type is required" }, { status: 400 });
    }

    const { error } = await supabase.from("post_responses").insert([{
      name: name || null,
      business_type,
      most_useful_demo: most_useful_demo || null,
      heard_from: heard_from || null,
      confidence_level: confidence_level || null,
      kannada_helped: kannada_helped || null,
      topic_next: topic_next || null,
      want_setup: want_setup || null,
      follow_up_method: follow_up_method || null,
      contact_detail: contact_detail || null,
      extra_message: extra_message || null,
    }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Post-survey error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
