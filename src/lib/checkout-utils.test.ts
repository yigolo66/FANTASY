import { calculateTotal, formatPriceUSD, findTourBySlug } from "./checkout-utils";

describe("calculateTotal", () => {
  it("returns unitPrice * numberOfPeople", () => {
    expect(calculateTotal(179.99, 2)).toBe(179.99 * 2);
    expect(calculateTotal(100, 1)).toBe(100);
    expect(calculateTotal(79.99, 20)).toBe(79.99 * 20);
  });

  it("returns 0 when numberOfPeople is 0", () => {
    expect(calculateTotal(179.99, 0)).toBe(0);
  });
});

describe("formatPriceUSD", () => {
  it("formats whole numbers with two decimals", () => {
    expect(formatPriceUSD(100)).toBe("$100.00");
  });

  it("formats decimal amounts correctly", () => {
    expect(formatPriceUSD(179.99)).toBe("$179.99");
    expect(formatPriceUSD(0.5)).toBe("$0.50");
  });

  it("formats zero", () => {
    expect(formatPriceUSD(0)).toBe("$0.00");
  });
});

describe("findTourBySlug", () => {
  it("returns the tour when slug matches", () => {
    const tour = findTourBySlug("private-catamaran-saona");
    expect(tour).toBeDefined();
    expect(tour!.slug).toBe("private-catamaran-saona");
    expect(tour!.title).toBe("Private Catamaran Cruise to Saona Island");
  });

  it("returns undefined for non-existent slug", () => {
    expect(findTourBySlug("non-existent-tour")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(findTourBySlug("")).toBeUndefined();
  });
});
