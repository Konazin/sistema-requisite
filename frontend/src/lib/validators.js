const onlyDigits = (value) => value.replace(/\D/g, "");
export function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
export function isValidCpfFormat(value) {
    return /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(value);
}
export function normalizeCpf(value) {
    return onlyDigits(value).slice(0, 11);
}
export function normalizePhone(value) {
    return onlyDigits(value).slice(0, 11);
}
