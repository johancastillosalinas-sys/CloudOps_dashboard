import { useMemo, useState } from "react";
import { Search, LayoutGrid, List, Star, Scale } from "lucide-react";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import ServiceCompareModal from "../components/services/ServiceCompareModal";
import { awsServices } from "../data/awsServices";
import { ItemCosto } from "../types/cloud";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useFavorites } from "../hooks/useFavorites";
import { costItemsSeed } from "../data/costSeed";
import { serviciosMasUsados } from "../utils/serviceUsage";

export default function Services() {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [vista, setVista] = useState<"grid" | "list">("grid");
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [modoComparar, setModoComparar] = useState(false);
  const [seleccionComparar, setSeleccionComparar] = useState<string[]>([]);
  const [mostrarComparador, setMostrarComparador] = useState(false);

  const { esFavorito, toggleFavorito } = useFavorites();
  const [costItems] = useLocalStorage<ItemCosto[]>("costItems", costItemsSeed);
  const masUsados = useMemo(() => serviciosMasUsados(costItems), [costItems]);

  const categorias = ["Todas", ...Array.from(new Set(awsServices.map((s) => s.categoria)))];

  const filtrados = useMemo(
    () =>
      awsServices.filter(
        (s) =>
          (categoria === "Todas" || s.categoria === categoria) &&
          s.nombre.toLowerCase().includes(query.toLowerCase()) &&
          (!soloFavoritos || esFavorito(s.id))
      ),
    [query, categoria, soloFavoritos, esFavorito]
  );

  const toggleComparar = (id: string) => {
    setSeleccionComparar((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const serviciosComparar = awsServices.filter((s) => seleccionComparar.includes(s.id));

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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoloFavoritos((v) => !v)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                soloFavoritos
                  ? "border-costs bg-amber-50 text-costs dark:bg-amber-500/10"
                  : "border-border text-textsec dark:border-slate-700 dark:text-slate-400"
              }`}
            >
              <Star size={14} className={soloFavoritos ? "fill-costs" : ""} /> Favoritos
            </button>

            <button
              onClick={() => {
                setModoComparar((v) => !v);
                setSeleccionComparar([]);
              }}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                modoComparar
                  ? "border-primary bg-blue-50 text-primary dark:bg-blue-500/10"
                  : "border-border text-textsec dark:border-slate-700 dark:text-slate-400"
              }`}
            >
              <Scale size={14} /> Comparar
            </button>

            <div className="flex overflow-hidden rounded-lg border border-border dark:border-slate-700">
              <button
                onClick={() => setVista("grid")}
                className={`p-2 transition-colors ${
                  vista === "grid" ? "bg-primary text-white" : "text-textsec dark:text-slate-400"
                }`}
                aria-label="Vista cuadrícula"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setVista("list")}
                className={`p-2 transition-colors ${
                  vista === "list" ? "bg-primary text-white" : "text-textsec dark:text-slate-400"
                }`}
                aria-label="Vista lista"
              >
                <List size={16} />
              </button>
            </div>
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

        {modoComparar && (
          <div className="flex items-center justify-between rounded-lg border border-dashed border-primary/40 bg-blue-50/40 px-4 py-2.5 text-xs text-primary dark:bg-blue-500/5">
            <span>Selecciona 2 o 3 servicios para comparar ({seleccionComparar.length}/3)</span>
            <button
              onClick={() => setMostrarComparador(true)}
              disabled={seleccionComparar.length < 2}
              className="rounded-lg bg-primary px-3 py-1.5 font-semibold text-white disabled:opacity-40"
            >
              Comparar ahora
            </button>
          </div>
        )}

        <div className={vista === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
          {filtrados.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              vista={vista}
              query={query}
              esFavorito={esFavorito(s.id)}
              onToggleFavorito={modoComparar ? undefined : toggleFavorito}
              masUsado={masUsados.includes(s.nombre)}
              seleccionado={seleccionComparar.includes(s.id)}
              modoComparar={modoComparar}
              onToggleComparar={toggleComparar}
            />
          ))}
        </div>
        {filtrados.length === 0 && (
          <p className="text-center text-sm text-textsec dark:text-slate-400">No se encontraron servicios.</p>
        )}
      </div>

      {mostrarComparador && (
        <ServiceCompareModal servicios={serviciosComparar} onClose={() => setMostrarComparador(false)} />
      )}
    </div>
  );
}