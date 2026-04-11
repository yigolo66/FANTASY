"use client";
import Image from "next/image";
import Link from "next/link";
import TourCard from "@/components/TourCard";
import { tours, destinos, testimonios, blogPosts } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const { t } = useI18n();
  const popularTours = tours.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen flex items-center text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1548574505-5e239809ee19?w=2000&q=85"
          alt="Punta Cana playa"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/50" />
        <div className="relative max-w-7xl mx-auto px-6 pt-16">
          <div className="max-w-2xl">
            <p className="text-primary font-medium mb-3 tracking-wide uppercase text-sm">{t.hero.tag}</p>
            <h1 className="text-3xl md:text-5xl font-semibold leading-none tracking-tighter mb-6">
              {t.hero.title1}<br />{t.hero.title2}<br />
              <span className="text-primary">{t.hero.title3}</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">{t.hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/tours" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all text-center">
                {t.hero.cta_tours}
              </Link>
              <a
                href="https://wa.me/18497391699?text=Hola,%20quiero%20información%20sobre%20tours"
                target="_blank" rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold text-base transition-all text-center flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.186-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.724.868.936-3.42-.235-.372A9.818 9.818 0 1112 21.818z"/>
                </svg>
                WhatsApp
              </a>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm">
              <div className="flex -space-x-3">
                {[5, 6, 7, 8].map((i) => (
                  <Image key={i} src={`https://i.pravatar.cc/32?img=${i}`} alt="viajero" width={32} height={32}
                    className="rounded-2xl border-2 border-white object-cover" />
                ))}
              </div>
              <p className="text-white/80">{t.hero.social_proof}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TOURS POPULARES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-primary font-medium text-sm uppercase tracking-wide mb-1">{t.popular.tag}</p>
            <h2 className="text-4xl font-semibold">{t.popular.title}</h2>
          </div>
          <Link href="/tours" className="text-primary font-medium hover:underline">{t.popular.see_all}</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
        </div>
      </section>

      {/* DESTINOS */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-primary font-medium text-sm uppercase tracking-wide mb-1">{t.destinations.tag}</p>
            <h2 className="text-4xl font-semibold">{t.destinations.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destinos.map((d) => (
              <Link key={d.id} href="/destinos" className="card-hover relative rounded-3xl overflow-hidden h-72 block group">
                <Image src={d.image} alt={d.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-semibold">{d.name}</h3>
                  <p className="text-white/80 text-sm">{d.tours} {t.destinations.tours_available}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold">{t.why.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: "🌴", title: t.why.item1_title, desc: t.why.item1_desc },
            { icon: "💰", title: t.why.item2_title, desc: t.why.item2_desc },
            { icon: "⭐", title: t.why.item3_title, desc: t.why.item3_desc },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-3xl p-8 border border-gray-100 card-hover">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="bg-[#f0fffe] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-primary font-medium text-sm uppercase tracking-wide mb-1">{t.testimonials.tag}</p>
            <h2 className="text-4xl font-semibold">{t.testimonials.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonios.map((t) => (
              <div key={t.name} className="bg-white rounded-3xl p-6 border border-gray-100 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} className="rounded-2xl object-cover" />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-gray-400 text-sm">{t.country} · {t.tour}</p>
                  </div>
                </div>
                <div className="text-amber-400 mb-3">{"★".repeat(t.rating)}</div>
                <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-primary font-medium text-sm uppercase tracking-wide mb-1">{t.blog.tag}</p>
            <h2 className="text-4xl font-semibold">{t.blog.title}</h2>
          </div>
          <Link href="/blog" className="text-primary font-medium hover:underline">{t.blog.see_all}</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card-hover bg-white rounded-3xl overflow-hidden border border-gray-100 block group">
              <div className="relative h-48">
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 100vw, 33vw" />
                <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-2xl">{post.category}</span>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-xs mb-2">{post.date} · {post.readTime} {t.blog.read_time}</p>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-gray-500 text-sm">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA WHATSAPP */}
      <section className="bg-primary py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-semibold mb-4">{t.cta.title}</h2>
          <p className="text-white/90 mb-8 text-lg">{t.cta.subtitle}</p>
          <a
            href="https://wa.me/18497391699?text=Hola,%20quiero%20reservar%20un%20tour"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-primary font-bold px-10 py-4 rounded-2xl text-lg hover:bg-gray-100 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-600">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.186-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.724.868.936-3.42-.235-.372A9.818 9.818 0 1112 21.818z"/>
            </svg>
            {t.cta.button}
          </a>
        </div>
      </section>
    </>
  );
}
