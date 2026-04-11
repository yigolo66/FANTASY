import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Artículo no encontrado – Fantasy Travels" };
  return {
    title: `${post.title} – Fantasy Travels`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
      type: "article",
    },
  };
}

// Contenido de artículos (en producción vendría de un CMS)
const contenidos: Record<string, string[]> = {
  "que-hacer-punta-cana-2026": [
    "Punta Cana es mucho más que playas de arena blanca. En 2026, este destino del Caribe ofrece una variedad de experiencias que van desde la aventura acuática hasta la cultura local.",
    "**Isla Saona** es la excursión más popular. A solo 2 horas en catamarán, encontrarás una piscina natural con estrellas de mar y una playa virgen que parece sacada de una postal.",
    "Para los amantes de la naturaleza, el **Parque Nacional del Este** ofrece senderismo entre manglares y la posibilidad de avistar aves tropicales únicas de la región.",
    "Si buscas adrenalina, los **buggies todoterreno** te llevarán por caminos de tierra hasta playas escondidas y un cenote natural donde podrás bañarte.",
    "La gastronomía local también merece atención. Prueba el sancocho, el mangú y los mariscos frescos en los restaurantes de Bávaro. Los mercados locales son perfectos para llevarte recuerdos auténticos.",
    "**Consejo práctico:** La mejor época para visitar es entre diciembre y abril, cuando las lluvias son mínimas y las temperaturas rondan los 28°C. Reserva tus tours con antelación, especialmente en temporada alta.",
  ],
  "isla-saona-guia-completa": [
    "Isla Saona es el destino más fotografiado de República Dominicana, y con razón. Sus aguas turquesas, arena blanca y palmeras inclinadas crean un paisaje de ensueño.",
    "**Cómo llegar:** La única forma de acceder es en barco desde Bayahibe o Mano Juan. Los tours organizados incluyen el transporte en catamarán o lancha rápida, snorkel y almuerzo.",
    "La famosa **piscina natural** es una parada obligatoria. A mitad del trayecto, el barco se detiene en aguas poco profundas donde podrás caminar entre estrellas de mar. Es uno de esos momentos que no olvidarás.",
    "**Qué llevar:** Protector solar biodegradable (obligatorio para proteger el arrecife), ropa de baño extra, efectivo en dólares o pesos para las artesanías locales, y una cámara resistente al agua.",
    "El pueblo de **Mano Juan** en la isla tiene unos 200 habitantes y conserva la vida caribeña tradicional. Vale la pena dar un paseo por sus coloridas casas de madera.",
    "**Mejor momento del día:** Los tours de mañana (salida 8-9am) tienen menos gente y mejor luz para fotos. Los de tarde son más tranquilos pero con menos tiempo en la isla.",
  ],
  "mejor-epoca-visitar-caribe": [
    "Planificar un viaje al Caribe requiere entender sus dos temporadas principales: la seca y la húmeda. Elegir bien puede marcar la diferencia entre unas vacaciones perfectas y una lluviosa.",
    "**Temporada alta (diciembre – abril):** Es la época dorada. Clima seco, temperaturas de 26-30°C y mínimas posibilidades de lluvia. Los precios son más altos y conviene reservar con 2-3 meses de antelación.",
    "**Temporada baja (mayo – noviembre):** Más lluvias, especialmente en septiembre y octubre (temporada de huracanes). Sin embargo, los precios bajan hasta un 40% y hay mucho menos turismo.",
    "**Samaná en enero-marzo** es especial: las ballenas jorobadas llegan a reproducirse en la bahía. Es un espectáculo único que solo ocurre en este período.",
    "Para **Punta Cana específicamente**, cualquier mes entre diciembre y agosto es bueno. Julio y agosto son temporada alta local (vacaciones europeas y latinoamericanas), así que los precios suben.",
    "**Consejo de presupuesto:** Si viajas en mayo o junio, encontrarás precios bajos con clima todavía bastante seco. Es el secreto mejor guardado de los viajeros frecuentes del Caribe.",
  ],
};

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const paragraphs = contenidos[post.slug] ?? [post.excerpt];
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article>
      {/* Hero imagen */}
      <div className="relative h-72 md:h-96 w-full">
        <Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-6 pb-8 text-white">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-2xl mb-3 inline-block">{post.category}</span>
          <h1 className="text-3xl md:text-4xl font-semibold">{post.title}</h1>
          <p className="text-white/80 text-sm mt-2">{post.date} · {post.readTime} de lectura</p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-5 text-lg">{p}</p>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 mt-10 text-center">
          <p className="font-semibold text-lg mb-2">¿Listo para vivir esta experiencia?</p>
          <p className="text-gray-600 mb-4">Reserva tu tour con Fantasy Travels y disfruta de guías locales expertos.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tours" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-medium transition-all">
              Ver tours disponibles
            </Link>
            <a href="https://wa.me/18497391699" target="_blank" rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-medium transition-all">
              💬 Consultar por WhatsApp
            </a>
          </div>
        </div>

        {/* Artículos relacionados */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-semibold mb-6">Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="card-hover bg-white rounded-3xl overflow-hidden border border-gray-100 block group">
                  <div className="relative h-40">
                    <Image src={r.image} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="50vw" />
                  </div>
                  <div className="p-4">
                    <p className="text-gray-400 text-xs mb-1">{r.readTime} de lectura</p>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link href="/blog" className="text-primary hover:underline">← Volver al blog</Link>
        </div>
      </div>
    </article>
  );
}
