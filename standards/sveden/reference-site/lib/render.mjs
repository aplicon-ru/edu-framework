// Общие правила рендера — источник standards/sveden/vocab/_global.yaml
// (rules.missing_value, patterns.no_root/with_root).
export const MISSING_VALUE = "отсутствует";

export function renderText(value) {
  if (value == null) return MISSING_VALUE;
  if (typeof value === "string") return value.trim() || MISSING_VALUE;
  if (typeof value === "object" && "text" in value) return value.text?.trim() || MISSING_VALUE;
  return String(value);
}

export function hrefOf(value) {
  return typeof value === "object" && value ? value.href : undefined;
}
