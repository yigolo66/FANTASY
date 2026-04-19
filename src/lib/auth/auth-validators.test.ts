import {
  RegisterData,
  LoginData,
  validateRegisterData,
  validateLoginData,
  validateProfileUpdate,
  isValidPassword,
  parseRegisterData,
  serializeRegisterData,
} from "./auth-validators";

describe("isValidPassword", () => {
  it("returns true for a valid password", () => {
    expect(isValidPassword("Abcdef1x")).toBe(true);
  });

  it("returns false when shorter than 8 characters", () => {
    expect(isValidPassword("Ab1cdef")).toBe(false);
  });

  it("returns false when missing uppercase", () => {
    expect(isValidPassword("abcdefg1")).toBe(false);
  });

  it("returns false when missing lowercase", () => {
    expect(isValidPassword("ABCDEFG1")).toBe(false);
  });

  it("returns false when missing digit", () => {
    expect(isValidPassword("Abcdefgh")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isValidPassword("")).toBe(false);
  });
});

describe("validateRegisterData", () => {
  const validData: RegisterData = {
    name: "Juan Pérez",
    email: "juan@example.com",
    password: "Password1",
  };

  it("returns valid for correct data", () => {
    const result = validateRegisterData(validData);
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it("returns error for empty name", () => {
    const result = validateRegisterData({ ...validData, name: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("returns error for empty email", () => {
    const result = validateRegisterData({ ...validData, email: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("returns error for invalid email format", () => {
    const result = validateRegisterData({ ...validData, email: "not-an-email" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBe("Formato de email inválido");
  });

  it("returns error for empty password", () => {
    const result = validateRegisterData({ ...validData, password: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.password).toBeDefined();
  });

  it("returns error for weak password", () => {
    const result = validateRegisterData({ ...validData, password: "weak" });
    expect(result.valid).toBe(false);
    expect(result.errors.password).toContain("Mínimo 8 caracteres");
  });

  it("returns multiple errors for multiple invalid fields", () => {
    const result = validateRegisterData({ name: "", email: "", password: "" });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThanOrEqual(3);
  });
});

describe("validateLoginData", () => {
  const validLogin: LoginData = {
    email: "juan@example.com",
    password: "Password1",
  };

  it("returns valid for correct data", () => {
    const result = validateLoginData(validLogin);
    expect(result.valid).toBe(true);
  });

  it("returns error for empty email", () => {
    const result = validateLoginData({ ...validLogin, email: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("returns error for invalid email", () => {
    const result = validateLoginData({ ...validLogin, email: "bad" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBe("Formato de email inválido");
  });

  it("returns error for empty password", () => {
    const result = validateLoginData({ ...validLogin, password: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.password).toBeDefined();
  });
});

describe("validateProfileUpdate", () => {
  it("returns valid for non-empty name", () => {
    const result = validateProfileUpdate({ name: "María" });
    expect(result.valid).toBe(true);
  });

  it("returns error for empty name", () => {
    const result = validateProfileUpdate({ name: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("returns error for whitespace-only name", () => {
    const result = validateProfileUpdate({ name: "   " });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });
});

describe("parseRegisterData / serializeRegisterData round-trip", () => {
  it("round-trips valid data", () => {
    const original: RegisterData = {
      name: "Ana López",
      email: "ana@example.com",
      password: "Secret1x",
    };
    const serialized = serializeRegisterData(original);
    const parsed = parseRegisterData(JSON.parse(serialized));
    expect(parsed.name).toBe(original.name);
    expect(parsed.email).toBe(original.email);
    expect(parsed.password).toBe(original.password);
  });

  it("sanitizes HTML tags in name during parse", () => {
    const raw = { name: "<script>alert('x')</script>Juan", email: "j@e.com", password: "Pass1234" };
    const parsed = parseRegisterData(raw);
    expect(parsed.name).not.toContain("<script>");
  });

  it("lowercases and trims email during parse", () => {
    const raw = { name: "Test", email: "  USER@Example.COM  ", password: "Pass1234" };
    const parsed = parseRegisterData(raw);
    expect(parsed.email).toBe("user@example.com");
  });
});
