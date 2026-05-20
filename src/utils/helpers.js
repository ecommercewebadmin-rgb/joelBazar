// Helpers generales del proyecto
export function formatCurrency(amount) {
  // Se implementará cuando se necesite
  return amount;
}

export function formatDate(date) {
  // Se implementará cuando se necesite
  return date;
}

export function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}
