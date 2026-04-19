"use client";
import { useState } from "react";
import TourCard from "@/components/TourCard";
import { tours } from "@/lib/data";

const categorias = ["Todos", "Isla", "Aventura", "Náutico", "Cultural", "Naturaleza", "Entretenimiento", "Transporte"];
const destinos = ["Todos", "Punta Cana", "Santo Domingo", "Samaná"];

export default function ToursPage() {
  const [categoria, setCategoria] = useState("Todos");
  const [destino, setDestino] = useState("Todos");
  const [maxPrecio, setMaxPrecio] = useState(1000);
  const [busqueda, setBusqueda] = useState("");

  const filtrados = tours.filter((t) => {
    const matchCat = categoria === "Todos" || t.category === categoria;
    const matchDest = destino === "Todos" || t.destino === destino;
    const matchPrecio = t.price <= maxPrecio;
    const matchBusq = t.title.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchDest && matchPrecio && matchBusq;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-primary font-medium text-sm uppercase tracking-wide mb-1">Explora</p>
        <h1 className="text-4xl font-semibold mb-2">Todos los tours</h1>
        <p className="text-gray-500">{filtrados.length} tours disponibles</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 flex-wrap">
        {/* Buscador */}
        <input
          type="text"
          placeholder="🔍 Buscar tour..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-2 text-sm flex-1 min-w-[180px] outline-none focus:border-primary"
        />

        {/* Categoría */}
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-2 text-sm outline-none focus:border-primary"
        >
          {categorias.map((c) => <option key={c}>{c}</option>)}
        </select>

        {/* Destino */}
        <select
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-2 text-sm outline-none focus:border-primary"
        >
          {destinos.map((d) => <option key={d}>{d}</option>)}
        </select>

        {/* Precio */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <span className="text-sm text-gray-500 whitespace-nowrap">Hasta ${maxPrecio}</span>
          <input
            type="range" min={50} max={1000} step={10}
            value={maxPrecio}
            onChange={(e) => setMaxPrecio(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
        </div>
      </div>

      {/* Grid */}
      {filtrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((tour) => <TourCard key={tour.id} tour={tour} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl">No encontramos tours con esos filtros.</p>
        </div>
      )}
    </div>
  );
}
