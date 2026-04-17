import { tours } from "./data";

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface CheckoutRequest {
  tourSlug: string;
  fullName: string;
  email: string;
  phone: string;
  tourDate: string;
  numberOfPeople: number;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTML_TAG_REGEX = /<[^>]*>/g;
// eslint-disable-next-line no-control-regex
const CONTROL_CHAR_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

const validSlugs = new Set(tours.map((t) => t.slug));

export function sanitizeString(input: string): string {
  return input.replace(HTML_TAG_REGEX, "").replace(CONTROL_CHAR_REGEX, "");
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function isValidFutureDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
}

export function isValidNumberOfPeople(n: number): boolean {
  return Number.isInteger(n) && n >= 1 && n <= 20;
}

export function validateCheckoutData(data: CheckoutRequest): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || !data.fullName.trim()) {
    errors.fullName = "Campo requerido";
  }

  if (!data.email || !data.email.trim()) {
    errors.email = "Campo requerido";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Formato de email inválido";
  }

  if (!data.phone || !data.phone.trim()) {
    errors.phone = "Campo requerido";
  }

  if (!data.tourDate || !data.tourDate.trim()) {
    errors.tourDate = "Campo requerido";
  } else if (!isValidFutureDate(data.tourDate)) {
    errors.tourDate = "La fecha debe ser futura";
  }

  if (data.numberOfPeople == null) {
    errors.numberOfPeople = "Campo requerido";
  } else if (!isValidNumberOfPeople(data.numberOfPeople)) {
    errors.numberOfPeople = "Entre 1 y 20 personas";
  }

  if (!data.tourSlug || !data.tourSlug.trim()) {
    errors.tourSlug = "Campo requerido";
  } else if (!validSlugs.has(data.tourSlug)) {
    errors.tourSlug = "Tour no encontrado";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
