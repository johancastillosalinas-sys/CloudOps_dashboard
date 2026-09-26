import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import { awsServices } from "../data/awsServices";

export default function Services() {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const categorias = ["Todas", ...Array.from(new Set(awsServices.map((s) => s.categoria)))];

  const filtrados = useMemo(
    () =>
      awsServices.filter(
        (s) =>
          (categoria === "Todas" || s.categoria === categoria) &&
          s.nombre.toLowerCase().includes(query.toLowerCase())
      ),
    [query, categoria]
  );

  return (
    <div className="animate-fade-in">
      <Header titulo="Servicios AWS" subtitulo="Catálogo de servicios utilizados en la solución" />
      <div className="space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textsec dark:text-slate-400" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar servicio..."
              className="w-full rounded-lg border border-border bg-transparent py-2.5 pl-9 pr-3 text-sm text-textmain focus:border-primary focus:outline-none dark:border-slate-700 dark:text-slate-100"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categorias.map((c) => (
              <button
                key={c}
                onClick={() => setCategoria(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  categoria === c
                    ? "border-primary bg-blue-50 text-primary dark:bg-blue-500/10"
                    : "border-border text-textsec dark:border-slate-700 dark:text-slate-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
        {filtrados.length === 0 && (
          <p className="text-center text-sm text-textsec dark:text-slate-400">No se encontraron servicios.</p>
        )}
      </div>
    </div>
  );
}