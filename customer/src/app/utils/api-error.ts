type ApiErrorItem = { field?: string; message?: string };

const normalizeField = (value: string): string => value.replace(/^body\./, "").trim();

const normalizeMessage = (message: string): string => {
  const text = (message || "").trim();
  if (!text) return "Something went wrong. Please try again.";

  if (/String must contain at least (\d+) character\(s\)/i.test(text)) {
    const match = text.match(/String must contain at least (\d+) character\(s\)/i);
    return `Must be at least ${match?.[1] || "required"} characters.`;
  }
  if (/Number must be greater than 0/i.test(text)) {
    return "Please enter a valid number greater than 0.";
  }
  if (/Invalid date format/i.test(text)) {
    return "Please enter a valid date.";
  }
  if (/Invalid time format/i.test(text)) {
    return "Please select a valid time.";
  }
  if (/Invalid email/i.test(text)) {
    return "Please enter a valid email address.";
  }
  if (/Invalid credentials/i.test(text)) {
    return "Please check your login details and try again.";
  }
  if (/Invalid or expired token/i.test(text)) {
    return "Your session expired. Please log in again.";
  }
  if (text === "Validation failed") {
    return "Please check your input and try again.";
  }
  if (/ER_[A-Z_]+|SQL|database/i.test(text)) {
    return "Something went wrong. Please try again.";
  }
  return text;
};

const extractErrorItems = (err: any): ApiErrorItem[] => {
  const payload = err?.error || {};
  const raw = payload?.errors || payload?.details;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item: any) => ({
      field: item?.field ? normalizeField(String(item.field)) : "",
      message: item?.message ? normalizeMessage(String(item.message)) : ""
    }))
    .filter((item) => !!item.message);
};

export const getCustomerApiFieldErrors = (
  err: any,
  aliases?: Record<string, string>
): Record<string, string[]> => {
  const out: Record<string, string[]> = {};
  const items = extractErrorItems(err);
  for (const item of items) {
    const source = item.field || "_";
    const key = aliases?.[source] || source;
    if (!out[key]) out[key] = [];
    out[key].push(item.message || "Invalid value.");
  }
  return out;
};

export const getCustomerApiErrorMessage = (err: any, fallback = "Request failed."): string => {
  const items = extractErrorItems(err);
  if (items.length) {
    const first = items[0];
    if (first.field) return `${first.field}: ${first.message}`;
    return first.message || fallback;
  }
  const text = err?.error?.message || err?.error?.error || err?.message || "";
  const normalized = normalizeMessage(String(text));
  if (normalized && normalized !== "Validation failed") return normalized;
  return fallback;
};
