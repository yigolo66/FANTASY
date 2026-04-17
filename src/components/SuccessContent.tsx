"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

interface SuccessContentProps {
  tourName: string;
  tourDate: string;
  numberOfPeople: string;
  totalPaid: string;
}

export default function SuccessContent({
  tourName,
  tourDate,
  numberOfPeople,
  totalPaid,
}: SuccessContentProps) {
  const { t } = useI18n();

  const whatsappUrl = `https://wa.me/18497391699?text=${encodeURIComponent(
    `Hola, acabo de reservar: ${tourName} - ${tourDate}`
  )}`;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      {/* Success icon */}
      <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-2">{t.success.title}</h1>
      <p className="text-gray-500 mb-8">{t.success.message}</p>

      {/* Booking summary card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 text-left mb-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-sm text-gray-500">{t.success.tour}</span>
            <span className="font-medium text-sm">{tourName}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-sm text-gray-500">{t.success.date}</span>
            <span className="font-medium text-sm">{tourDate}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-sm text-gray-500">{t.success.people}</span>
            <span className="font-medium text-sm">{numberOfPeople}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-sm font-semibold">{t.success.total}</span>
            <span className="text-lg font-bold text-primary">{totalPaid}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-2xl font-semibold transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.594-.822-6.34-2.2l-.144-.112-3.3 1.106 1.106-3.3-.112-.144A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          {t.success.whatsapp}
        </a>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-2xl font-semibold transition-colors"
        >
          {t.success.home}
        </Link>
      </div>
    </div>
  );
}
