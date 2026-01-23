import { LeadSubmission } from "@/lib/types/lead";
import { looksRandom, emailRisk } from "./utils";

export interface BotDetectionResult {
  isSpam: boolean;
  score: number;
  reasons: string[];
}

export function scoreLead(data: LeadSubmission): BotDetectionResult {
  let score = 0;
  const reasons: string[] = [];

  // ---- Behavior signals ----

  if (data.mouseMovements === 0) {
    score += 25;
    reasons.push("No mouse movement");
  }

  if (data.keystrokes > 100 && data.submissionTime < 8000) {
    score += 20;
    reasons.push("High keystrokes in short time");
  }

  if (data.submissionTime < 4000) {
    score += 15;
    reasons.push("Form submitted too fast");
  }

  // ---- Name / company entropy ----

  if (looksRandom(data.firstName)) {
    score += 15;
    reasons.push("Random-looking first name");
  }

  if (looksRandom(data.lastName)) {
    score += 15;
    reasons.push("Random-looking last name");
  }

  if (data.company && looksRandom(data.company)) {
    score += 15;
    reasons.push("Random-looking company");
  }

  // ---- Email risk (SOFT scoring) ----

  const emailScore = emailRisk(data.email);
  if (emailScore > 0) {
    score += emailScore;
    reasons.push("Email risk signals");
  }

  // ---- Traffic attribution sanity ----

  if (
    data.utmSource === "(organic)" &&
    data.utmMedium === "(not set)" &&
    !data.GCLID &&
    !data.MSCLKID
  ) {
    score += 10;
    reasons.push("Unattributed traffic source");
  }

  // ---- Page intent mismatch ----

  if (data.pageUrl?.includes("case-studies")) {
    score += 10;
    reasons.push("Low-intent page");
  }

  return {
    isSpam: score >= 50,
    score,
    reasons,
  };
}