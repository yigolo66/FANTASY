import { tours } from "./data";

export type Tour = (typeof tours)[number];

/**
 * Calculates the total price for a booking.
 * @param unitPrice - Price per person in USD
 * @param numberOfPeople - Number of people
 * @returns Total price (unitPrice * numberOfPeople)
 */
export function calculateTotal(
  unitPrice: number,
  numberOfPeople: number
): number {
  return unitPrice * numberOfPeople;
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
