"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useI18n } from "@/lib/i18n";
import { Tour, calculateTotal } from "@/lib/checkout-utils";
import OrderSummary from "./OrderSummary";

interface CheckoutFormProps {
  tour: Tour;
}

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  tourDate: string;
  numberOfPeople: number;
}

export default function CheckoutForm({ tour }: CheckoutFormProps) {
  const { t } = useI18n();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    watch,
    formState: { errors },
    trigger,
  } = useForm<CheckoutFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      tourDate: "",
      numberOfPeople: 1,
    },
  });

  const numberOfPeople = watch("numberOfPeople");
  const today = new Date().toISOString().split("T")[0];

  const inputClass =
    "w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 space-y-5">
        <h2 className="text-2xl font-semibold mb-2">{t.checkout.title}</h2>

        {serverError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-2xl px-4 py-3">
            {serverError}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {t.checkout.fullName} *
          </label>
          <input
            {...register("fullName", { required: t.checkout.errors.required })}
            placeholder={t.checkout.fullName}
            className={inputClass}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {t.checkout.email} *
            </label>
            <input
              {...register("email", {
                required: t.checkout.errors.required,
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t.checkout.errors.invalidEmail },
              })}
              type="email"
              placeholder="tu@email.com"
              className={inputClass}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {t.checkout.phone} *
            </label>
            <input
              {...register("phone", { required: t.checkout.errors.required })}
              placeholder="+1 809 000 0000"
              className={inputClass}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Date & Number of People */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {t.checkout.date} *
            </label>
            <input
              {...register("tourDate", {
                required: t.checkout.errors.required,
                validate: (value) => value > today || t.checkout.errors.futureDate,
              })}
              type="date"
              min={today}
              className={inputClass}
            />
            {errors.tourDate && (
              <p className="text-red-500 text-xs mt-1">{errors.tourDate.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {t.checkout.people} *
            </label>
            <input
              {...register("numberOfPeople", {
                required: t.checkout.errors.required,
                min: { value: 1, message: t.checkout.errors.peopleRange },
                max: { value: 20, message: t.checkout.errors.peopleRange },
                valueAsNumber: true,
              })}
              type="number"
              min={1}
              max={20}
              className={inputClass}
            />
            {errors.numberOfPeople && (
              <p className="text-red-500 text-xs mt-1">{errors.numberOfPeople.message}</p>
            )}
          </div>
        </div>

        {/* PayPal Button */}
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", currency: "USD" }}>
          <PayPalButtons
            style={{ layout: "horizontal", color: "gold", shape: "pill", label: "paypal", height: 50 }}
            createOrder={async (_data, actions) => {
              const valid = await trigger();
              if (!valid) throw new Error("Formulario inválido");
              const total = calculateTotal(tour.price, Number(numberOfPeople) || 1);
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [{
                  description: tour.title,
                  amount: { currency_code: "USD", value: total.toFixed(2) },
                }],
              });
            }}
            onApprove={async (_data, actions) => {
              const order = await actions.order?.capture();
              if (order?.status === "COMPLETED") {
                window.location.href = `/checkout/success?paypal=true&tour=${tour.slug}`;
              }
            }}
            onError={() => {
              setServerError("Error con PayPal. Intenta de nuevo.");
            }}
          />
        </PayPalScriptProvider>
      </div>

      {/* Order Summary sidebar */}
      <div className="lg:col-span-1">
        <OrderSummary
          tourTitle={tour.title}
          tourImage={tour.image}
          unitPrice={tour.price}
          numberOfPeople={Number(numberOfPeople) || 1}
        />
      </div>
    </div>
  );
}
