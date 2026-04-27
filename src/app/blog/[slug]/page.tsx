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
  if (!post) return { title: "Article not found – Fantasy Travels" };
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

const contents: Record<string, string[]> = {
  "things-to-do-punta-cana-2026": [
    "Punta Cana is much more than white sand beaches. In 2026, this Caribbean destination offers a variety of experiences ranging from water adventures to local culture.",
    "**Saona Island** is the most popular excursion. Just 2 hours by catamaran, you'll find a natural pool with starfish and a pristine beach that looks like a postcard.",
    "For nature lovers, the **East National Park** offers hiking through mangroves and the chance to spot tropical birds unique to the region.",
    "If you're looking for adrenaline, **off-road buggies** will take you through dirt roads to hidden beaches and a natural cenote where you can swim.",
    "Local cuisine also deserves attention. Try the sancocho, mangú and fresh seafood at restaurants in Bávaro. Local markets are perfect for authentic souvenirs.",
    "**Practical tip:** The best time to visit is between December and April, when rainfall is minimal and temperatures hover around 82°F (28°C). Book your tours in advance, especially during peak season.",
  ],
  "saona-island-complete-guide": [
    "Saona Island is the most photographed destination in the Dominican Republic, and for good reason. Its turquoise waters, white sand and leaning palm trees create a dreamlike landscape.",
    "**How to get there:** The only way to access it is by boat from Bayahibe or Mano Juan. Organized tours include catamaran or speedboat transportation, snorkeling and lunch.",
    "The famous **natural pool** is a must-stop. Halfway through the trip, the boat stops in shallow waters where you can walk among starfish. It's one of those moments you'll never forget.",
    "**What to bring:** Biodegradable sunscreen (mandatory to protect the reef), extra swimwear, cash in dollars or pesos for local crafts, and a waterproof camera.",
    "The village of **Mano Juan** on the island has about 200 inhabitants and preserves traditional Caribbean life. It's worth taking a walk through its colorful wooden houses.",
    "**Best time of day:** Morning tours (departing 8-9am) have fewer people and better light for photos. Afternoon tours are quieter but with less time on the island.",
  ],
  "best-time-visit-caribbean": [
    "Planning a trip to the Caribbean requires understanding its two main seasons: dry and wet. Choosing wisely can make the difference between a perfect vacation and a rainy one.",
    "**Peak season (December – April):** This is the golden period. Dry weather, temperatures of 79-86°F (26-30°C) and minimal chance of rain. Prices are higher and it's best to book 2-3 months in advance.",
    "**Low season (May – November):** More rain, especially in September and October (hurricane season). However, prices drop by up to 40% and there's much less tourism.",
    "**Samaná in January-March** is special: humpback whales arrive to breed in the bay. It's a unique spectacle that only occurs during this period.",
    "For **Punta Cana specifically**, any month between December and August is good. July and August are local peak season (European and Latin American holidays), so prices go up.",
    "**Budget tip:** If you travel in May or June, you'll find low prices with still fairly dry weather. It's the best-kept secret of frequent Caribbean travelers.",
  ],
};

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const paragraphs = contents[post.slug] ?? [post.excerpt];
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article>
      {/* Hero image */}
      <div className="relative h-72 md:h-96 w-full">
        <Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-6 pb-8 text-white">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-2xl mb-3 inline-block">{post.category}</span>
          <h1 className="text-3xl md:text-4xl font-semibold">{post.title}</h1>
          <p className="text-white/80 text-sm mt-2">{post.date} · {post.readTime} read</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-5 text-lg">{p}</p>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 mt-10 text-center">
          <p className="font-semibold text-lg mb-2">Ready to live this experience?</p>
          <p className="text-gray-600 mb-4">Book your tour with Fantasy Travels and enjoy expert local guides.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tours" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-medium transition-all">
              View available tours
            </Link>
            <a href="https://wa.me/18497391699" target="_blank" rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-medium transition-all">
              💬 Ask via WhatsApp
            </a>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-semibold mb-6">Related articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="card-hover bg-white rounded-3xl overflow-hidden border border-gray-100 block group">
                  <div className="relative h-40">
                    <Image src={r.image} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="50vw" />
                  </div>
                  <div className="p-4">
                    <p className="text-gray-400 text-xs mb-1">{r.readTime} read</p>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link href="/blog" className="text-primary hover:underline">← Back to blog</Link>
        </div>
      </div>
    </article>
  );
}
