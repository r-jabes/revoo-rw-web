/**
 * Client-side enquiry validation. Shared rules for the Contact form.
 * No invented server — prototype mode still never leaves the browser.
 */

export type EnquiryValues = {
  name: string;
  email: string;
  phone: string;
  model: string;
  message: string;
  testRide: boolean;
  /** Honeypot: must stay empty */
  company: string;
};

export type EnquiryErrors = Partial<Record<keyof EnquiryValues | "form", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
/** Digits-only (after strip): Rwanda 07… / +2507…, or general 8–15 digit international */
const PHONE_RE = /^(?:\+?250)?0?7\d{8}$|^\+?\d{8,15}$/;

export function emptyEnquiry(): EnquiryValues {
  return {
    name: "",
    email: "",
    phone: "",
    model: "",
    message: "",
    testRide: true,
    company: "",
  };
}

export function readEnquiry(fd: FormData): EnquiryValues {
  return {
    name: String(fd.get("name") ?? "").trim(),
    email: String(fd.get("email") ?? "").trim(),
    phone: String(fd.get("phone") ?? "").trim().replace(/\s+/g, " "),
    model: String(fd.get("model") ?? "").trim(),
    message: String(fd.get("message") ?? "").trim(),
    testRide: fd.get("testRide") === "on" || fd.get("testRide") === "true",
    company: String(fd.get("company") ?? "").trim(),
  };
}

export function validateEnquiry(v: EnquiryValues): EnquiryErrors {
  // Bots that fill the honeypot: fail silently at the caller (treat as success, drop).
  if (v.company) return { form: "spam" };

  const errors: EnquiryErrors = {};

  if (!v.name) errors.name = "Enter your full name.";
  else if (v.name.length < 2) errors.name = "Name looks too short.";
  else if (v.name.length > 80) errors.name = "Keep the name under 80 characters.";

  if (!v.email && !v.phone) {
    errors.email = "Add an email or a phone number.";
    errors.phone = "Add a phone number or an email.";
  } else {
    if (v.email && !EMAIL_RE.test(v.email)) errors.email = "Enter a valid email address.";
    if (v.phone) {
      const digits = v.phone.replace(/[^\d+]/g, "");
      if (!PHONE_RE.test(digits)) errors.phone = "Enter a valid phone number.";
    }
  }

  if (!v.model) errors.model = "Choose a model, or select “Not sure yet”.";

  if (v.message.length > 1000) errors.message = "Keep the message under 1000 characters.";

  if (Object.keys(errors).length) {
    errors.form = "Please fix the highlighted fields and try again.";
  }

  return errors;
}
