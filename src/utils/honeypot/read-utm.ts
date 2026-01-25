// lib/utm/read.ts
import { cookies } from "next/headers";

export function readUTMs() {
  const store = cookies();

  return {
    utmSource: store.get("utm_source")?.value,
    utmMedium: store.get("utm_medium")?.value,
    utmCampaign: store.get("utm_campaign")?.value,
    utmTerm: store.get("utm_term")?.value,
    utmContent: store.get("utm_content")?.value,
  };
}