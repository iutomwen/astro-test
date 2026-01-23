export function looksRandom(value: string): boolean {
  if (!value || value.length < 3) return true;

  // High consonant ratio
  const consonants = value.replace(/[aeiou]/gi, "").length;
  if (consonants / value.length > 0.75) return true;

  // No vowels at all
  if (!/[aeiou]/i.test(value)) return true;

  // Long alphanumeric junk
  if (/^[a-z0-9]{10,}$/i.test(value)) return true;

  return false;
}

export function emailRisk(email: string): number {
  if (!email.includes("@")) return 20;

  const [local, domain] = email.split("@");
  let risk = 0;

  // Generic role-based emails (SOFT signal)
  if (/^(test|admin|info|contact)/i.test(local)) {
    risk += 5;
  }

  // Excessive dots or numbers
  if ((local.match(/\./g) || []).length > 3) risk += 5;
  if ((local.match(/\d/g) || []).length > 4) risk += 5;

  // Free email + random local part
  if (
    ["gmail.com", "yahoo.com", "outlook.com"].includes(domain) &&
    looksRandom(local)
  ) {
    risk += 10;
  }

  return risk;
}