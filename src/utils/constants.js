// Variables de entorno importadas
export const CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'joelBazar',
  CURRENCY: import.meta.env.VITE_CURRENCY || 'ARS',
  CURRENCY_SYMBOL: import.meta.env.VITE_CURRENCY_SYMBOL || '$',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '5000'),
};

// Métodos de pago
export const PAYMENT_METHODS = {
  MERCADOPAGO: 'mercadopago',
  TRANSFER_BBVA: 'transferencia_bbva',
  TRANSFER_GALICIA: 'transferencia_galicia',
};

// Estados de órdenes
export const ORDER_STATUS = {
  PENDING: 'pendiente',
  PAID: 'pagado',
  SHIPPED: 'enviado',
  DELIVERED: 'entregado',
  CANCELLED: 'cancelado',
};

// URLs de API (construidas dinámicamente en servicios)
export const API_ENDPOINTS = {
  PRODUCTS: 'https://api.airtable.com/v0/{baseId}/Productos',
  CATEGORIES: 'https://api.airtable.com/v0/{baseId}/Categorias',
  ORDERS: 'https://api.airtable.com/v0/{baseId}/Ordenes',
};
