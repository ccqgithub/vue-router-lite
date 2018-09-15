// warning
export function warning(message) {
  if (!console || !console.warn) return;
  console.warn(message);
}

// copyJson
export function copyJson(data) {
  return JSON.parse(JSON.stringify(data));
}