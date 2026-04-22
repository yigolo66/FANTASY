"use client";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-bold">F</div>
            <span className="text-white text-lg" style={{fontFamily: "'Pacifico', cursive"}}>Fantasy<span className="text-primary">Travels</span></span>
          </div>
          <p className="text-sm leading-relaxed">{t.footer.desc}</p>
          <div className="flex gap-3 mt-4">
            {[
              { href: "https://instagram.com", label: "Instagram", icon: "📸" },
              { href: "https://www.facebook.com/share/186imxf7Ru/", label: "Facebook", icon: "👍" },
              { href: "https://tiktok.com", label: "TikTok", icon: "🎵" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-xl flex items-center justify-center transition-colors text-sm"
                aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{t.footer.destinations}</h4>
          <ul className="space-y-2 text-sm">
            {["Punta Cana", "Santo Domingo", "Samaná", "La Romana"].map((d) => (
              <li key={d}><Link href="/destinos" className="hover:text-primary transition-colors">{d}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{t.footer.tours}</h4>
          <ul className="space-y-2 text-sm">
            {["Isla Saona", "Nado con Delfines", "Catamarán Sunset", "Aventura Buggy"].map((tour) => (
              <li key={tour}><Link href="/tours" className="hover:text-primary transition-colors">{tour}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{t.footer.contact}</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 {t.footer.address}</li>
            <li>📞 +1 (849) 739-1699</li>
            <li>✉️ hola@fantasytravels.com</li>
            <li>🕐 {t.footer.hours}</li>
            <li>
              <a href="https://wa.me/18497391699" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-2xl text-sm font-medium mt-2 transition-colors">
                💬 WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
        <p>© 2026 Fantasy Travels. {t.footer.rights}</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-primary">{t.footer.privacy}</Link>
          <Link href="#" className="hover:text-primary">{t.footer.terms}</Link>
        </div>
      </div>
    </footer>
  );
}
