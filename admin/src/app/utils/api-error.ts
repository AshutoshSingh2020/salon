type ApiErrorItem = { field?: string; message?: string };

const normalizeField = (value: string): string => value.replace(/^body\./, "").trim();

const extractErrorItems = (err: any): ApiErrorItem[] => {
  const payload = err?.error || {};
  const rawItems = payload?.errors || payload?.details;
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .map((item: any) => ({
      field: item?.field ? normalizeField(String(item.field)) : "",
      message: item?.message ? String(item.message) : ""
    }))
    .filter((item) => !!item.message);
};

export const getApiFieldErrors = (err: any): Record<string, string[]> => {
  const map: Record<string, string[]> = {};
  const items = extractErrorItems(err);
  for (const item of items) {
    const key = item.field || "_";
    if (!map[key]) map[key] = [];
    map[key].push(item.message || "Invalid value");
  }
  return map;
};

export const getApiErrorMessage = (err: any, fallback = "Request failed."): string => {
  const items = extractErrorItems(err);
  if (items.length) {
    const formatted = items.map((item) => (item.field ? `${item.field}: ${item.message}` : item.message));
    return formatted.slice(0, 3).join(" | ");
  }
  const text = err?.error?.message || err?.error?.error || err?.message;
  if (typeof text === "string" && text.trim()) return text;
  return fallback;
};
