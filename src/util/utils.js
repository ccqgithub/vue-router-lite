// warning
export function warning(message) {
  if (!console || !console.warn) return;
  console.warn(`[vue-router-lite] ${message}`);
}

// copyJson
export function copyJson(data) {
  return JSON.parse(JSON.stringify(data));
}