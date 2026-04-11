import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Fantasy Travels – Tours en Punta Cana 2026",
  description:
    "Descubre los mejores tours en Punta Cana. Isla Saona, delfines, catamarán y más. Reserva online con precios transparentes y guías locales.",
  keywords: "tours punta cana, isla saona, excursiones punta cana, viajes caribe 2026",
  openGraph: {
    title: "Fantasy Travels – Tours en Punta Cana 2026",
    description: "Los mejores tours en Punta Cana con guías locales.",
    url: "https://fantasytravels.com",
    siteName: "Fantasy Travels",
    images: [{ url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200" }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Google Analytics – reemplaza G-XXXXXXXXXX con tu ID real */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');`,
          }}
        />
      </head>
      <body className="bg-[#f8f9fa] text-gray-800">
        <I18nProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
