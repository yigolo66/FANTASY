import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

// In-memory Set for idempotency — ignores duplicate event IDs
const processedEvents = new Set<string>();

export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  try {
    // Read body as raw text (not JSON parsed) for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("Webhook error: Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Webhook error: STRIPE_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Verify signature with Stripe
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Idempotency: skip already-processed events
  if (processedEvents.has(event.id)) {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // Mark event as processed
  processedEvents.add(event.id);

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    console.log("=== Reserva completada ===");
    console.log(`Event ID: ${event.id}`);
    console.log(`Session ID: ${session.id}`);
    console.log(`Tour: ${metadata?.tour_slug}`);
    console.log(`Cliente: ${metadata?.customer_name}`);
    console.log(`Email: ${metadata?.customer_email}`);
    console.log(`Teléfono: ${metadata?.customer_phone}`);
    console.log(`Fecha del tour: ${metadata?.tour_date}`);
    console.log(`Personas: ${metadata?.number_of_people}`);
    console.log(`Monto total: ${session.amount_total} centavos`);
    console.log("==========================");
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
