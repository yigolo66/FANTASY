"use client";
import { useState } from "react";
import TourCard from "@/components/TourCard";
import { tours } from "@/lib/data";

const categories = ["All", "Island", "Adventure", "Nautical", "Cultural", "Nature", "Entertainment", "Transportation"];
const destinations = ["All", "Punta Cana", "Santo Domingo", "Samaná"];

export default function ToursPage() {
  const [category, setCategory] = useState("All");
  const [destination, setDestination] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [search, setSearch] = useState("");

  const filtered = tours.filter((t) => {
    const matchCat = category === "All" || t.category === category;
    const matchDest = destination === "All" || t.destino === destination;
    const matchPrice = t.price <= maxPrice;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchDest && matchPrice && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-primary font-medium text-sm uppercase tracking-wide mb-1">Explore</p>
        <h1 className="text-4xl font-semibold mb-2">All tours</h1>
        <p className="text-gray-500">{filtered.length} tours available</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 flex-wrap">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search tour..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-2 text-sm flex-1 min-w-[180px] outline-none focus:border-primary"
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-2 text-sm outline-none focus:border-primary"
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>

        {/* Destination */}
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-2 text-sm outline-none focus:border-primary"
        >
          {destinations.map((d) => <option key={d}>{d}</option>)}
        </select>

        {/* Price */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <span className="text-sm text-gray-500 whitespace-nowrap">Up to ${maxPrice}</span>
          <input
            type="range" min={50} max={1000} step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tour) => <TourCard key={tour.id} tour={tour} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl">No tours found with those filters.</p>
        </div>
      )}
    </div>
  );
}
