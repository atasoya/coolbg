export function ensureNonEmpty(value, message) {
  if (value == null || String(value).trim() === '') return message;
}

export function ensureFiniteNumber(value, message) {
  const num = Number(value);
  if (!Number.isFinite(num)) return message;
}

export function ensureNonNegativeNumber(value, message) {
  const num = Number(value);
  if (num < 0) return message;
}

export function ensureInRange(value, min, max, message) {
  const num = Number(value);
  if (num < min || num > max) return message;
}

export function ensureRelativePath(value, message) {
  if (!value || value[0] !== '.') return message;
}

export function ensureImageExtension(filePath, message) {
  if (!/(\.png|\.jpg|\.jpeg)$/i.test(filePath)) return message;
}

export function ensureValidHexColor(value, message) {
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(String(value))) return message;
}

export function ensureArrayLength(arr, expectedLength, message) {
  if (!Array.isArray(arr) || arr.length !== expectedLength) return message;
}

