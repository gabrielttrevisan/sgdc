export default function getSafeListId(value) {
  if (!value || typeof value !== "string") return "";

  return value.replace(/[^a-z0-9-:]/gi, "");
}