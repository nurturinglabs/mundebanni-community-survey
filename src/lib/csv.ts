// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateCSV(data: any[]): string {
  const headers = ["Registered At", "Name", "WhatsApp", "City", "Business Type", "Team Size", "Biggest Pain", "AI Experience", "Language"];
  const rows = data.map(r => [
    new Date(r.created_at as string).toLocaleString(),
    r.name as string,
    (r.whatsapp as string) || "",
    (r.city as string) || "",
    (r.business_type as string) || "",
    (r.team_size as string) || "",
    (r.biggest_pain as string) || "",
    (r.ai_experience as string) || "",
    (r.language_preference as string) || ""
  ]);
  return [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
}
