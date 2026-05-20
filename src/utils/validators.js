// Validadores para formularios
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePhone(phone) {
  const regex = /^[0-9]{7,15}$/;
  return regex.test(phone);
}

export function validateRequired(value) {
  return value && value.trim().length > 0;
}

export function validateMinLength(value, min) {
  return value && value.length >= min;
}

export function validateAddress(address) {
  return address && address.trim().length >= 10;
}
