import { getDB } from "./db";

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
): Promise<User> {
  const db = getDB();
  const { data, error } = await db
    .from("users")
    .insert({ name, email, password_hash: passwordHash })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToUser(data as UserRow);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = getDB();
  const { data, error } = await db
    .from("users")
    .select()
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return rowToUser(data as UserRow);
}

export async function findUserById(id: number): Promise<User | null> {
  const db = getDB();
  const { data, error } = await db
    .from("users")
    .select()
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return rowToUser(data as UserRow);
}

export async function updateUserName(id: number, name: string): Promise<User> {
  const db = getDB();
  const { data, error } = await db
    .from("users")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToUser(data as UserRow);
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
