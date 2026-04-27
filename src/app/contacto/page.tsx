import type { Metadata } from "next";
import ContactoForm from "@/components/ContactoForm";

export const metadata: Metadata = {
  title: "Contact & Bookings – Fantasy Travels",
  description: "Book your tour in Punta Cana. Contact us via WhatsApp or form and we'll respond within 1 hour.",
};

export default function ContactoPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-primary font-medium text-sm uppercase tracking-wide mb-2">We are here</p>
          <h1 className="text-5xl font-semibold mb-4">Book your tour</h1>
          <p className="text-gray-300 text-lg">Fill out the form or message us on WhatsApp. We respond within 1 hour.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <ContactoForm />

        {/* Contact info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6">Direct contact</h2>
            <div className="space-y-4">
              {[
                { icon: "📍", label: "Address", value: "Punta Cana, Dominican Republic" },
                { icon: "📞", label: "Phone", value: "+1 (849) 739-1699" },
                { icon: "✉️", label: "Email", value: "hola@fantasytravels.com" },
                { icon: "🕐", label: "Hours", value: "Mon–Sun: 8:00am – 8:00pm" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.label}</p>
                    <p className="text-gray-700">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/18497391699?text=Hi,%20I%20want%20to%20book%20a%20tour%20in%20Punta%20Cana"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white rounded-3xl p-6 transition-all group"
          >
            <span className="text-4xl">💬</span>
            <div>
              <p className="font-semibold text-lg">Message us on WhatsApp</p>
              <p className="text-green-100 text-sm">Instant response · Available 7 days</p>
            </div>
            <span className="ml-auto text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </a>

          {/* Social media */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100">
            <p className="font-semibold mb-4">Follow us</p>
            <div className="flex gap-3">
              {[
                { href: "https://instagram.com", label: "Instagram", icon: "📸", color: "bg-pink-50 hover:bg-pink-100 text-pink-600" },
                { href: "https://facebook.com", label: "Facebook", icon: "👍", color: "bg-blue-50 hover:bg-blue-100 text-blue-600" },
                { href: "https://tiktok.com", label: "TikTok", icon: "🎵", color: "bg-gray-50 hover:bg-gray-100 text-gray-700" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${s.color}`}>
                  {s.icon} {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
