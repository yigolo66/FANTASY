import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { destinos } from "@/lib/data";
import MapaDestinos from "@/components/MapaDestinos";

export const metadata: Metadata = {
  title: "Destinations – Fantasy Travels",
  description: "Explore the best Caribbean destinations: Punta Cana, Santo Domingo and Samaná.",
};

export default function DestinosPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-primary font-medium text-sm uppercase tracking-wide mb-2">Discover</p>
          <h1 className="text-5xl font-semibold mb-4">Our destinations</h1>
          <p className="text-gray-300 text-lg">The Dominican Republic has much more than Punta Cana. Explore every corner.</p>
        </div>
      </section>

      {/* Interactive map */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold mb-6">Destination map</h2>
        <div className="rounded-3xl overflow-hidden border border-gray-200 h-96">
          <MapaDestinos destinos={destinos} />
        </div>
      </section>

      {/* Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinos.map((d) => (
            <div key={d.id} className="card-hover bg-white rounded-3xl overflow-hidden border border-gray-100">
              <div className="relative h-56">
                <Image src={d.image} alt={d.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-1">{d.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{d.country}</p>
                <p className="text-gray-600 text-sm mb-4">{d.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-medium text-sm">{d.tours} tours</span>
                  <Link href="/tours" className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-2xl text-sm font-medium transition-all">
                    View tours →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
