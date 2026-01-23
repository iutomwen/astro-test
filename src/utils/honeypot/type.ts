export interface LeadSubmission {
  firstName: string;
  lastName: string;
  company?: string;
  phoneNumber?: string;
  email: string;

  mouseMovements: number;
  keystrokes: number;
  submissionTime: number;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;

  GCLID?: string;
  MSCLKID?: string;

  pageUrl?: string;
  locale?: string;
}