import { redirect } from "next/navigation";
import { findTourBySlug } from "@/lib/checkout-utils";
import CheckoutForm from "@/components/CheckoutForm";

interface CheckoutPageProps {
  searchParams: Promise<{ tour?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { tour: tourSlug } = await searchParams;

  if (!tourSlug) {
    redirect("/tours");
  }

  const tour = findTourBySlug(tourSlug);

  if (!tour) {
    redirect("/tours");
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <CheckoutForm tour={tour} />
    </div>
  );
}
