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

export function createUser(
  name: string,
  email: string,
  passwordHash: string
): User {
  const db = getDB();
  const stmt = db.prepare(
    `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`
  );
  const result = stmt.run(name, email, passwordHash);
  const row = db
    .prepare(`SELECT * FROM users WHERE id = ?`)
    .get(result.lastInsertRowid) as UserRow;
  return rowToUser(row);
}

export function findUserByEmail(email: string): User | null {
  const db = getDB();
  const row = db
    .prepare(`SELECT * FROM users WHERE email = ?`)
    .get(email) as UserRow | undefined;
  return row ? rowToUser(row) : null;
}

export function findUserById(id: number): User | null {
  const db = getDB();
  const row = db
    .prepare(`SELECT * FROM users WHERE id = ?`)
    .get(id) as UserRow | undefined;
  return row ? rowToUser(row) : null;
}

export function updateUserName(id: number, name: string): User {
  const db = getDB();
  db.prepare(
    `UPDATE users SET name = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(name, id);
  const row = db
    .prepare(`SELECT * FROM users WHERE id = ?`)
    .get(id) as UserRow;
  return rowToUser(row);
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
