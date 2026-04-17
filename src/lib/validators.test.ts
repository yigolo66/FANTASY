import {
  sanitizeString,
  isValidEmail,
  isValidFutureDate,
  isValidNumberOfPeople,
  validateCheckoutData,
  CheckoutRequest,
} from "./validators";

// Helper to build a valid checkout request
function validRequest(overrides: Partial<CheckoutRequest> = {}): CheckoutRequest {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  return {
    tourSlug: "private-catamaran-saona",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+18091234567",
    tourDate: dateStr,
    numberOfPeople: 2,
    ...overrides,
  };
}

describe("sanitizeString", () => {
  it("removes HTML tags", () => {
    expect(sanitizeString('<script>alert("xss")</script>')).toBe('alert("xss")');
    expect(sanitizeString("<b>bold</b>")).toBe("bold");
    expect(sanitizeString('<img src="x" onerror="alert(1)">')).toBe("");
  });

  it("removes control characters", () => {
    expect(sanitizeString("hello\x00world")).toBe("helloworld");
    expect(sanitizeString("test\x1Fvalue")).toBe("testvalue");
  });

  it("preserves safe alphanumeric text", () => {
    expect(sanitizeString("Hello World 123")).toBe("Hello World 123");
    expect(sanitizeString("María García")).toBe("María García");
  });
});

describe("isValidEmail", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("test.name@domain.co")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("noatsign")).toBe(false);
    expect(isValidEmail("@nodomain.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("user @example.com")).toBe(false);
  });
});

describe("isValidFutureDate", () => {
  it("accepts a future date", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(isValidFutureDate(tomorrow.toISOString().split("T")[0])).toBe(true);
  });

  it("rejects today's date", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(isValidFutureDate(today)).toBe(false);
  });

  it("rejects past dates", () => {
    expect(isValidFutureDate("2020-01-01")).toBe(false);
  });

  it("rejects invalid format", () => {
    expect(isValidFutureDate("not-a-date")).toBe(false);
    expect(isValidFutureDate("01/01/2030")).toBe(false);
    expect(isValidFutureDate("")).toBe(false);
  });
});

describe("isValidNumberOfPeople", () => {
  it("accepts 1 to 20", () => {
    expect(isValidNumberOfPeople(1)).toBe(true);
    expect(isValidNumberOfPeople(10)).toBe(true);
    expect(isValidNumberOfPeople(20)).toBe(true);
  });

  it("rejects out of range", () => {
    expect(isValidNumberOfPeople(0)).toBe(false);
    expect(isValidNumberOfPeople(21)).toBe(false);
    expect(isValidNumberOfPeople(-1)).toBe(false);
  });

  it("rejects non-integers", () => {
    expect(isValidNumberOfPeople(1.5)).toBe(false);
    expect(isValidNumberOfPeople(NaN)).toBe(false);
  });
});

describe("validateCheckoutData", () => {
  it("returns valid for correct data", () => {
    const result = validateCheckoutData(validRequest());
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it("returns errors for all empty fields", () => {
    const result = validateCheckoutData({
      tourSlug: "",
      fullName: "",
      email: "",
      phone: "",
      tourDate: "",
      numberOfPeople: null as unknown as number,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.fullName).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.phone).toBeDefined();
    expect(result.errors.tourDate).toBeDefined();
    expect(result.errors.numberOfPeople).toBeDefined();
    expect(result.errors.tourSlug).toBeDefined();
  });

  it("returns error for invalid email format", () => {
    const result = validateCheckoutData(validRequest({ email: "bad-email" }));
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBe("Formato de email inválido");
  });

  it("returns error for past date", () => {
    const result = validateCheckoutData(validRequest({ tourDate: "2020-01-01" }));
    expect(result.valid).toBe(false);
    expect(result.errors.tourDate).toBe("La fecha debe ser futura");
  });

  it("returns error for people out of range", () => {
    const result = validateCheckoutData(validRequest({ numberOfPeople: 25 }));
    expect(result.valid).toBe(false);
    expect(result.errors.numberOfPeople).toBe("Entre 1 y 20 personas");
  });

  it("returns error for non-existent tour slug", () => {
    const result = validateCheckoutData(validRequest({ tourSlug: "non-existent-tour" }));
    expect(result.valid).toBe(false);
    expect(result.errors.tourSlug).toBe("Tour no encontrado");
  });
});
