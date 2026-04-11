"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, t, setLang } = useI18n();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/destinos", label: t.nav.destinations },
    { href: "/tours", label: t.nav.tours },
    { href: "/blog", label: t.nav.blog },
    { href: "/contacto", label: t.nav.contact },
  ];

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">F</div>
          <span className="text-xl hidden sm:block" style={{fontFamily: "'Pacifico', cursive"}}>
            Fantasy<span className="text-primary">Travels</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-primary transition-colors text-sm">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Botón idioma */}
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="flex items-center gap-1 border border-gray-200 hover:border-primary text-gray-600 hover:text-primary px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
          >
            <span>{lang === "es" ? "🇺🇸 EN" : "🇩🇴 ES"}</span>
          </button>
          <Link href="/contacto" className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-2xl text-sm font-medium transition-all">
            {t.nav.book}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="border border-gray-200 text-gray-600 px-2 py-1 rounded-xl text-xs font-medium"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
          <button className="p-2" onClick={() => setOpen(!open)} aria-label="Menú">
            <span className="block w-6 h-0.5 bg-gray-700 mb-1.5" />
            <span className="block w-6 h-0.5 bg-gray-700 mb-1.5" />
            <span className="block w-6 h-0.5 bg-gray-700" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-gray-700 hover:text-primary font-medium py-1" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/contacto" className="bg-primary text-white text-center py-2 rounded-2xl font-medium mt-2" onClick={() => setOpen(false)}>
            {t.nav.book}
          </Link>
        </div>
      )}
    </nav>
  );
}
