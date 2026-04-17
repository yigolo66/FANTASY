"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { calculateTotal, formatPriceUSD } from "@/lib/checkout-utils";

interface OrderSummaryProps {
  tourTitle: string;
  tourImage: string;
  unitPrice: number;
  numberOfPeople: number;
}

export default function OrderSummary({
  tourTitle,
  tourImage,
  unitPrice,
  numberOfPeople,
}: OrderSummaryProps) {
  const { t } = useI18n();
  const total = calculateTotal(unitPrice, numberOfPeople);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={tourImage}
          alt={tourTitle}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 400px"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">
          {tourTitle}
        </h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-sm">{t.checkout.unitPrice}</span>
          <span className="text-gray-700 font-medium">
            ${formatPriceUSD(unitPrice)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-sm">{t.checkout.people}</span>
          <span className="text-gray-700 font-medium">{numberOfPeople}</span>
        </div>
        <hr className="my-3 border-gray-200" />
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">{t.checkout.total}</span>
          <span className="text-2xl font-bold text-primary">
            ${formatPriceUSD(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
