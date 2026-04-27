"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { tours } from "@/lib/data";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  tour: string;
  fecha: string;
  personas: number;
  mensaje: string;
}

export default function ContactoForm() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Booking:", data);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-gray-100 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <span className="text-6xl mb-4">🎉</span>
        <h3 className="text-2xl font-semibold mb-2">Request sent!</h3>
        <p className="text-gray-500 mb-6">We will contact you within 1 hour to confirm your booking.</p>
        <a
          href="https://wa.me/18497391699?text=Hi,%20I%20just%20sent%20a%20booking%20request"
          target="_blank" rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-medium transition-all"
        >
          💬 Confirm via WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl p-8 border border-gray-100 space-y-5">
      <h2 className="text-2xl font-semibold mb-2">Request a booking</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Full name *</label>
          <input
            {...register("nombre", { required: "Required field" })}
            placeholder="Your name"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
          <input
            {...register("email", { required: "Required field", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })}
            type="email" placeholder="you@email.com"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Phone / WhatsApp</label>
          <input
            {...register("telefono")}
            placeholder="+1 809 000 0000"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Number of people *</label>
          <input
            {...register("personas", { required: true, min: 1 })}
            type="number" min={1} max={50} defaultValue={2}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Tour of interest *</label>
          <select
            {...register("tour", { required: "Select a tour" })}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white"
          >
            <option value="">Select tour...</option>
            {tours.map((t) => (
              <option key={t.id} value={t.slug}>{t.title} – from ${t.price}</option>
            ))}
            <option value="otro">Other / Not sure yet</option>
          </select>
          {errors.tour && <p className="text-red-500 text-xs mt-1">{errors.tour.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Preferred date *</label>
          <input
            {...register("fecha", { required: "Select a date" })}
            type="date"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Additional message</label>
        <textarea
          {...register("mensaje")}
          rows={3}
          placeholder="Allergies, special needs, questions..."
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white py-4 rounded-2xl font-semibold text-lg transition-all"
      >
        {isSubmitting ? "Sending..." : "Request booking →"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        You can also message us directly on{" "}
        <a href="https://wa.me/18497391699" target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium">WhatsApp</a>
      </p>
    </form>
  );
}
