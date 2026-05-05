import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminPassword, tourName, price, customerName, customerEmail, tourDate, people, notes } = body;

    // Simple admin password check
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "fantasytravels2024";
    if (adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate required fields
    if (!tourName || !price || !customerName || !tourDate || !people) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const priceNum = parseFloat(price);
    const peopleNum = parseInt(people);

    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const origin = request.nextUrl.origin;
    const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}`;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tourName,
              description: notes ? `${tourDate} · ${people} person(s) · ${notes}` : `${tourDate} · ${people} person(s)`,
            },
            unit_amount: Math.round(priceNum * 100),
          },
          quantity: peopleNum,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail || undefined,
      metadata: {
        tour_slug: "custom",
        customer_name: customerName,
        customer_email: customerEmail || "",
        tour_date: tourDate,
        number_of_people: String(peopleNum),
        custom_tour: tourName,
        notes: notes || "",
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error creating custom payment:", error);
    return NextResponse.json({ error: "Error creating payment link" }, { status: 500 });
  }
}
