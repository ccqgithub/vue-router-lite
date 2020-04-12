export function getSymbol(str) {
  if (typeof Symbol === 'function') {
    return Symbol(str);
  }
  return `vue-router-lite-symbol-${str}`;
}

export const route = getSymbol('route');
export const router = getSymbol('router');
