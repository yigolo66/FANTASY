import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog de Viajes – Fantasy Travels | Guías y Consejos 2026",
  description:
    "Guías de viaje, consejos y artículos sobre Punta Cana, Santo Domingo y el Caribe. Todo lo que necesitas saber para tu próximo viaje.",
  keywords: "blog viajes punta cana, guía punta cana 2026, qué hacer caribe, consejos viaje república dominicana",
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-primary font-medium text-sm uppercase tracking-wide mb-2">Consejos de viaje</p>
          <h1 className="text-5xl font-semibold mb-4">Blog de viajes</h1>
          <p className="text-gray-300 text-lg">Guías, tips y experiencias para que tu viaje al Caribe sea perfecto.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Artículo destacado */}
        <Link href={`/blog/${featured.slug}`} className="card-hover block bg-white rounded-3xl overflow-hidden border border-gray-100 mb-12 group md:flex">
          <div className="relative h-64 md:h-auto md:w-1/2 flex-shrink-0">
            <Image src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 100vw, 50vw" />
            <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-2xl">{featured.category}</span>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <p className="text-gray-400 text-sm mb-3">{featured.date} · {featured.readTime} de lectura</p>
            <h2 className="text-3xl font-semibold mb-3 group-hover:text-primary transition-colors">{featured.title}</h2>
            <p className="text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
            <span className="text-primary font-medium">Leer artículo →</span>
          </div>
        </Link>

        {/* Grid de artículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card-hover bg-white rounded-3xl overflow-hidden border border-gray-100 block group">
              <div className="relative h-48">
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 100vw, 33vw" />
                <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-2xl">{post.category}</span>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-xs mb-2">{post.date} · {post.readTime} de lectura</p>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-gray-500 text-sm">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
