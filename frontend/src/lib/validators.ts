const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidCpfFormat(value: string) {
  return /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(value);
}

export function normalizeCpf(value: string) {
  return onlyDigits(value).slice(0, 11);
}

export function normalizePhone(value: string) {
  return onlyDigits(value).slice(0, 11);
}
