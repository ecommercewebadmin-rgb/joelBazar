import { CONFIG } from './constants.js';

export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: CONFIG.CURRENCY,
  }).format(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
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

export function showNotification(message, type = 'info', duration = 3000) {
  const event = new CustomEvent('showNotification', {
    detail: { message, type, duration },
  });
  window.dispatchEvent(event);
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showNotification('Copiado al portapapeles', 'success', 2000);
  } catch {
    showNotification('Error al copiar', 'error');
  }
}

export function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}
