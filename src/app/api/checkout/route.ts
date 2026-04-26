import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import {
  validateCheckoutData,
  sanitizeString,
  type CheckoutRequest,
} from "@/lib/validators";
import { findTourBySlug } from "@/lib/checkout-utils";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutRequest;

    // Validate all checkout data (slug, email, date, people, etc.)
    const validation = validateCheckoutData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validation.errors },
        { status: 400 }
      );
    }

    // Find the tour — guaranteed to exist after validation, but double-check
    const tour = findTourBySlug(body.tourSlug);
    if (!tour) {
      return NextResponse.json(
        { error: "Tour no encontrado" },
        { status: 400 }
      );
    }

    // Sanitize user inputs
    const customerName = sanitizeString(body.fullName);
    const customerEmail = sanitizeString(body.email);
    const customerPhone = sanitizeString(body.phone);
    const tourDate = sanitizeString(body.tourDate);

    // Calculate total in cents for Stripe
    const unitAmountCents = Math.round(tour.price * 100);

    // Build absolute URLs for success/cancel redirects
    const origin = request.nextUrl.origin;
    const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/checkout/cancel?tour=${body.tourSlug}`;

    // Create Stripe Checkout Session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tour.title,
            },
            unit_amount: unitAmountCents,
          },
          quantity: body.numberOfPeople,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tour_slug: body.tourSlug,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        tour_date: tourDate,
        number_of_people: String(body.numberOfPeople),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error al procesar el pago" },
      { status: 500 }
    );
  }
}
