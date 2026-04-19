import { ValidationResult, isValidEmail, sanitizeString } from "../validators";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function isValidPassword(password: string): boolean {
  return PASSWORD_REGEX.test(password);
}

export function validateRegisterData(data: RegisterData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    errors.name = "Campo requerido";
  }

  if (!data.email || !data.email.trim()) {
    errors.email = "Campo requerido";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Formato de email inválido";
  }

  if (!data.password) {
    errors.password = "Campo requerido";
  } else if (!isValidPassword(data.password)) {
    errors.password =
      "Mínimo 8 caracteres, una mayúscula, una minúscula y un número";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginData(data: LoginData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.email || !data.email.trim()) {
    errors.email = "Campo requerido";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Formato de email inválido";
  }

  if (!data.password) {
    errors.password = "Campo requerido";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateProfileUpdate(data: { name: string }): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    errors.name = "Campo requerido";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function parseRegisterData(raw: unknown): RegisterData {
  const obj = raw as Record<string, unknown>;
  return {
    name: sanitizeString(String(obj.name ?? "")),
    email: sanitizeString(String(obj.email ?? "")).trim().toLowerCase(),
    password: String(obj.password ?? ""),
  };
}

export function serializeRegisterData(data: RegisterData): string {
  return JSON.stringify({
    name: data.name,
    email: data.email,
    password: data.password,
  });
}
