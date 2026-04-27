import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Fantasy Travels – Tours in Punta Cana 2026",
  description:
    "Discover the best tours in Punta Cana. Saona Island, dolphins, catamaran and more. Book online with transparent prices and local guides.",
  keywords: "punta cana tours, saona island, punta cana excursions, caribbean travel 2026",
  openGraph: {
    title: "Fantasy Travels – Tours in Punta Cana 2026",
    description: "The best tours in Punta Cana with local guides.",
    url: "https://fantasytravels.com",
    siteName: "Fantasy Travels",
    images: [{ url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200" }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics – replace G-XXXXXXXXXX with your real ID */}
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
          {/* Floating WhatsApp */}
          <a
            href="https://wa.me/18497391699?text=Hi,%20I%20want%20to%20know%20about%20tours"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform"
            aria-label="WhatsApp"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.186-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.724.868.936-3.42-.235-.372A9.818 9.818 0 1112 21.818z"/>
            </svg>
          </a>
        </I18nProvider>
      </body>
    </html>
  );
}
