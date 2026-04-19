import bcrypt from "bcryptjs";
import { PublicUser, createUser, findUserByEmail, findUserById, updateUserName, toPublicUser } from "./user-repository";
import { createSession } from "./session";
import {
  RegisterData,
  LoginData,
  validateRegisterData,
  validateLoginData,
  validateProfileUpdate,
} from "./auth-validators";

export interface AuthResult {
  success: boolean;
  user?: PublicUser;
  token?: string;
  errors?: Record<string, string>;
}

const SALT_ROUNDS = 10;
const GENERIC_CREDENTIALS_ERROR = "Email o contraseña incorrectos";

export async function registerUser(input: RegisterData): Promise<AuthResult> {
  const validation = validateRegisterData(input);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  const existing = findUserByEmail(input.email);
  if (existing) {
    return {
      success: false,
      errors: { email: "Este email ya está registrado" },
    };
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = createUser(input.name, input.email, passwordHash);
  const publicUser = toPublicUser(user);
  const token = await createSession({ userId: user.id, email: user.email });

  return { success: true, user: publicUser, token };
}

export async function loginUser(input: LoginData): Promise<AuthResult> {
  const validation = validateLoginData(input);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  const user = findUserByEmail(input.email);
  if (!user) {
    return {
      success: false,
      errors: { credentials: GENERIC_CREDENTIALS_ERROR },
    };
  }

  const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatch) {
    return {
      success: false,
      errors: { credentials: GENERIC_CREDENTIALS_ERROR },
    };
  }

  const publicUser = toPublicUser(user);
  const token = await createSession({ userId: user.id, email: user.email });

  return { success: true, user: publicUser, token };
}

export async function updateProfile(
  userId: number,
  name: string
): Promise<AuthResult> {
  const validation = validateProfileUpdate({ name });
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  const existing = findUserById(userId);
  if (!existing) {
    return {
      success: false,
      errors: { user: "Usuario no encontrado" },
    };
  }

  const updated = updateUserName(userId, name);
  const publicUser = toPublicUser(updated);

  return { success: true, user: publicUser };
}
