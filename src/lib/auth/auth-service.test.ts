/**
 * @jest-environment node
 */
import bcrypt from "bcryptjs";
import { registerUser, loginUser, updateProfile } from "./auth-service";
import * as userRepo from "./user-repository";
import * as session from "./session";

jest.mock("./user-repository");
jest.mock("./session");

const mockUserRepo = userRepo as jest.Mocked<typeof userRepo>;
const mockSession = session as jest.Mocked<typeof session>;

const TEST_TOKEN = "test-jwt-token";

function makeUser(overrides: Partial<userRepo.User> = {}): userRepo.User {
  return {
    id: 1,
    name: "Juan Pérez",
    email: "juan@example.com",
    passwordHash: "hashed",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockSession.createSession.mockResolvedValue(TEST_TOKEN);
  mockUserRepo.toPublicUser.mockImplementation((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
  }));
});

describe("registerUser", () => {
  it("returns validation errors for invalid input", async () => {
    const result = await registerUser({ name: "", email: "", password: "" });
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.name).toBeDefined();
  });

  it("returns error when email already exists", async () => {
    mockUserRepo.findUserByEmail.mockReturnValue(makeUser());

    const result = await registerUser({
      name: "Test",
      email: "juan@example.com",
      password: "Password1",
    });

    expect(result.success).toBe(false);
    expect(result.errors!.email).toBe("Este email ya está registrado");
  });

  it("creates user and returns token on success", async () => {
    const user = makeUser();
    mockUserRepo.findUserByEmail.mockReturnValue(null);
    mockUserRepo.createUser.mockReturnValue(user);

    const result = await registerUser({
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "Password1",
    });

    expect(result.success).toBe(true);
    expect(result.user).toEqual({ id: 1, name: "Juan Pérez", email: "juan@example.com" });
    expect(result.token).toBe(TEST_TOKEN);
    expect(mockUserRepo.createUser).toHaveBeenCalledWith(
      "Juan Pérez",
      "juan@example.com",
      expect.any(String)
    );
  });

  it("hashes the password before storing", async () => {
    mockUserRepo.findUserByEmail.mockReturnValue(null);
    mockUserRepo.createUser.mockReturnValue(makeUser());

    await registerUser({
      name: "Test",
      email: "test@example.com",
      password: "Password1",
    });

    const storedHash = mockUserRepo.createUser.mock.calls[0][2];
    expect(storedHash).not.toBe("Password1");
    const isValid = await bcrypt.compare("Password1", storedHash);
    expect(isValid).toBe(true);
  });
});

describe("loginUser", () => {
  it("returns validation errors for invalid input", async () => {
    const result = await loginUser({ email: "", password: "" });
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it("returns generic error when user not found", async () => {
    mockUserRepo.findUserByEmail.mockReturnValue(null);

    const result = await loginUser({
      email: "nobody@example.com",
      password: "Password1",
    });

    expect(result.success).toBe(false);
    expect(result.errors!.credentials).toBe("Email o contraseña incorrectos");
  });

  it("returns generic error when password is wrong", async () => {
    const hash = await bcrypt.hash("CorrectPass1", 10);
    mockUserRepo.findUserByEmail.mockReturnValue(makeUser({ passwordHash: hash }));

    const result = await loginUser({
      email: "juan@example.com",
      password: "WrongPass1",
    });

    expect(result.success).toBe(false);
    expect(result.errors!.credentials).toBe("Email o contraseña incorrectos");
  });

  it("returns same error message for wrong email and wrong password", async () => {
    mockUserRepo.findUserByEmail.mockReturnValue(null);
    const noUserResult = await loginUser({
      email: "nobody@example.com",
      password: "Password1",
    });

    const hash = await bcrypt.hash("CorrectPass1", 10);
    mockUserRepo.findUserByEmail.mockReturnValue(makeUser({ passwordHash: hash }));
    const wrongPassResult = await loginUser({
      email: "juan@example.com",
      password: "WrongPass1",
    });

    expect(noUserResult.errors!.credentials).toBe(wrongPassResult.errors!.credentials);
  });

  it("returns user and token on valid credentials", async () => {
    const hash = await bcrypt.hash("Password1", 10);
    const user = makeUser({ passwordHash: hash });
    mockUserRepo.findUserByEmail.mockReturnValue(user);

    const result = await loginUser({
      email: "juan@example.com",
      password: "Password1",
    });

    expect(result.success).toBe(true);
    expect(result.user).toEqual({ id: 1, name: "Juan Pérez", email: "juan@example.com" });
    expect(result.token).toBe(TEST_TOKEN);
  });
});

describe("updateProfile", () => {
  it("returns validation error for empty name", async () => {
    const result = await updateProfile(1, "");
    expect(result.success).toBe(false);
    expect(result.errors!.name).toBeDefined();
  });

  it("returns error when user not found", async () => {
    mockUserRepo.findUserById.mockReturnValue(null);

    const result = await updateProfile(999, "Nuevo Nombre");
    expect(result.success).toBe(false);
    expect(result.errors!.user).toBeDefined();
  });

  it("updates name and returns public user on success", async () => {
    const user = makeUser();
    const updated = makeUser({ name: "Nuevo Nombre" });
    mockUserRepo.findUserById.mockReturnValue(user);
    mockUserRepo.updateUserName.mockReturnValue(updated);

    const result = await updateProfile(1, "Nuevo Nombre");

    expect(result.success).toBe(true);
    expect(result.user!.name).toBe("Nuevo Nombre");
    expect(mockUserRepo.updateUserName).toHaveBeenCalledWith(1, "Nuevo Nombre");
  });
});
