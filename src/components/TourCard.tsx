import Image from "next/image";
import Link from "next/link";

interface Tour {
  id: number;
  slug: string;
  title: string;
  category: string;
  duration: string;
  price: number;
  maxPrice: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  destino: string;
  badge: string | null;
}

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="card-hover bg-white rounded-3xl overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative h-52">
        <Image src={tour.image} alt={tour.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 25vw" />
        {tour.badge && (
          <span className="absolute top-3 left-3 bg-white text-primary text-xs font-bold px-3 py-1 rounded-2xl shadow">
            {tour.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-xl">
          {tour.duration}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs text-primary font-medium mb-1">{tour.category} · {tour.destino}</span>
        <h3 className="font-semibold text-lg mb-1">{tour.title}</h3>
        <p className="text-gray-500 text-sm mb-3 flex-1">{tour.description}</p>
        <div className="flex items-center gap-1 text-amber-400 text-sm mb-4">
          {"★".repeat(Math.floor(tour.rating))}
          <span className="text-gray-400 ml-1">({tour.reviews} reseñas)</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-primary">${tour.price}</span>
            <span className="text-gray-400 text-sm"> – ${tour.maxPrice}</span>
          </div>
          <Link
            href={`/contacto?tour=${tour.slug}`}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-2xl text-sm font-medium transition-all flex items-center gap-1"
          >
            Reservar →
          </Link>
        </div>
      </div>
    </div>
  );
}
