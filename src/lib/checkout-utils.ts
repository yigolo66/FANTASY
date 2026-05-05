import { tours } from "./data";

export type Tour = (typeof tours)[number];

/**
 * Calculates the total price for a booking including children.
 * @param unitPrice - Price per adult in USD
 * @param numberOfPeople - Number of adults
 * @param childPrice - Price per child in USD (optional)
 * @param numberOfChildren - Number of children (optional)
 * @returns Total price
 */
export function calculateTotal(
  unitPrice: number,
  numberOfPeople: number,
  childPrice?: number,
  numberOfChildren?: number
): number {
  const adultTotal = unitPrice * numberOfPeople;
  const childTotal = (childPrice || 0) * (numberOfChildren || 0);
  return adultTotal + childTotal;
}

/**
 * Formats a numeric amount as a USD price string.
 * @param amount - Amount in USD
 * @returns Formatted string like "$179.99"
 */
export function formatPriceUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Finds a tour by its slug.
 * @param slug - The tour slug to search for
 * @returns The matching Tour or undefined if not found
 */
export function findTourBySlug(slug: string): Tour | undefined {
  return tours.find((tour) => tour.slug === slug);
}
