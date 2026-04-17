import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { formatPriceUSD } from "@/lib/checkout-utils";
import SuccessContent from "@/components/SuccessContent";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  let tourName = "";
  let tourDate = "";
  let numberOfPeople = "";
  let totalPaid = "";

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    tourName = session.metadata?.tour_slug ?? "";
    tourDate = session.metadata?.tour_date ?? "";
    numberOfPeople = session.metadata?.number_of_people ?? "";
    totalPaid =
      session.amount_total != null
        ? formatPriceUSD(session.amount_total / 100)
        : "";
  } catch {
    // If session retrieval fails, still show the page with empty data
  }

  return (
    <SuccessContent
      tourName={tourName}
      tourDate={tourDate}
      numberOfPeople={numberOfPeople}
      totalPaid={totalPaid}
    />
  );
}
