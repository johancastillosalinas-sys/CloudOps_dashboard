import { useEffect, useMemo, useState } from "react";
import { PlusCircle, ArrowLeft, ArrowRight, Search, Sparkles, TrendingUp } from "lucide-react";
import Header from "../components/Header";
import CustomSelect, { SelectOption } from "../components/CustomSelect";
import StepIndicator from "../components/planning/StepIndicator";
import ArchitecturePreview from "../components/planning/ArchitecturePreview";
import WellArchitectedScore from "../components/planning/WellArchitectedScore";
import PropuestaCard from "../components/planning/PropuestaCard";
import PropuestaPreviewModal from "../components/planning/PropuestaPreviewModal";
import { EstadoPropuesta, PropuestaCloud } from "../types/cloud";
import { regiones, catalogoServiciosDisponibles } from "../data/awsServices";
import { recomendacionesPorTipo } from "../data/serviceRecommendations";
import { slaInfo } from "../data/slaInfo";
import { estimarCostoMensual } from "../utils/planningCost";
import { calcularWellArchitected } from "../utils/wellArchitected";
import { generarDescripcionServicios } from "../utils/autoDescription";
import { fmt } from "../utils/reportExport";
import { useLocalStorage } from "../hooks/useLocalStorage";

const vacio = {
  nombreSolucion: "",
  tipoAplicacion: "Aplicación web",
  descripcion: "",
  region: regiones[0].nombre,
  numeroUsuarios: 100,
  nivelDisponibilidad: "99.9%",
  serviciosSeleccionados: recomendacionesPorTipo["Aplicación web"].servicios,
  objetivoMigracion: "Modernización",
};

const pasos = ["Información", "Arquitectura", "Servicios", "Revisión"];

const opcionesTipoApp: SelectOption[] = Object.keys(recomendacionesPorTipo).map((v) => ({
  value: v,
  label: v,
}));

const opcionesRegion: SelectOption[] = regiones.map((r) => ({
  value: r.nombre,
  label: r.nombre,
  description: `${r.ubicacion}, ${r.pais}`,
}));

const opcionesDisponibilidad: SelectOption[] = ["99.9%", "99.95%", "99.99%"].map((v) => ({
  value: v,
  label: v,
  description: slaInfo[v].downtimeAnual,
}));

const opcionesObjetivo: SelectOption[] = [
  "Modernización",
  "Reducción de costos",
  "Escalabilidad",
  "Continuidad del negocio",
  "Expansión geográfica",
].map((v) => ({ value: v, label: v }));

const opcionesEstadoFiltro: SelectOption[] = [
  { value: "todos", label: "Todos los estados" },
  { value: "borrador", label: "Borrador" },
  { value: "revision", label: "En revisión" },
  { value: "aprobada", label: "Aprobada" },
];

export default function Planning() {
  const [form, setForm] = useState(vacio);
  const [step, setStep] = useState(0);
  const [propuestas, setPropuestas] = useLocalStorage<PropuestaCloud[]>("propuestas", []);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [descripcionAuto, setDescripcionAuto] = useState(true);
  const [propuestaPreview, setPropuestaPreview] = useState<PropuestaCloud | null>(null);

  const recomendados = recomendacionesPorTipo[form.tipoAplicacion]?.servicios ?? [];

  useEffect(() => {
    if (descripcionAuto) {
      setForm((f) => ({ ...f, descripcion: generarDescripcionServicios(f.serviciosSeleccionados) }));
    }
  }, [form.serviciosSeleccionados, descripcionAuto]);

  const toggleServicio = (s: string) => {
    setForm((f) => ({
      ...f,
      serviciosSeleccionados: f.serviciosSeleccionados.includes(s)
        ? f.serviciosSeleccionados.filter((x) => x !== s)
        : [...f.serviciosSeleccionados, s],
    }));
  };

  const estimado = useMemo(
    () => estimarCostoMensual(form.serviciosSeleccionados, form.numeroUsuarios, form.nivelDisponibilidad),
    [form.serviciosSeleccionados, form.numeroUsuarios, form.nivelDisponibilidad]
  );

  const puntajesPreview = useMemo(
    () =>
      calcularWellArchitected({
        servicios: form.serviciosSeleccionados,
        nivelDisponibilidad: form.nivelDisponibilidad,
        descripcion: form.descripcion,
        recomendados,
      }),
    [form.serviciosSeleccionados, form.nivelDisponibilidad, form.descripcion, recomendados]
  );

  const registrar = () => {
    if (!form.nombreSolucion.trim()) {
      setStep(0);
      return;
    }
    const nueva: PropuestaCloud = {
      id: crypto.randomUUID(),
      ...form,
      fecha: new Date().toLocaleDateString("es-PE"),
      estado: "borrador",
      costoMensualEstimado: estimado.total,
    };
    setPropuestas((p) => [nueva, ...p]);
    setForm({ ...vacio, serviciosSeleccionados: recomendacionesPorTipo[vacio.tipoAplicacion].servicios });
    setDescripcionAuto(true);
    setStep(0);
  };

  const cambiarEstado = (id: string, nuevo: EstadoPropuesta) =>
    setPropuestas((prev) => prev.map((p) => (p.id === id ? { ...p, estado: nuevo } : p)));

  const eliminarPropuesta = (id: string) => setPropuestas((prev) => prev.filter((p) => p.id !== id));

  // KPIs
  const totalPropuestas = propuestas.length;
  const usuariosTotales = propuestas.reduce((a, p) => a + p.numeroUsuarios, 0);
  const costoTotalMensual = propuestas.reduce((a, p) => a + p.costoMensualEstimado, 0);
  const servicioMasUsado = useMemo(() => {
    const conteo: Record<string, number> = {};
    propuestas.forEach((p) => p.serviciosSeleccionados.forEach((s) => (conteo[s] = (conteo[s] ?? 0) + 1)));
    const entries = Object.entries(conteo).sort((a, b) => b[1] - a[1]);
    return entries[0]?.[0] ?? "—";
  }, [propuestas]);

  const propuestasFiltradas = propuestas.filter((p) => {
    const coincideBusqueda =
      p.nombreSolucion.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.region.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === "todos" || p.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="animate-fade-in">
      <Header titulo="Planificación Cloud" subtitulo="Diseña, estima y registra propuestas de solución Cloud" />
      <div className="space-y-6 p-4 md:p-8">
        {/* Asistente por pasos */}
        <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <StepIndicator pasos={pasos} actual={step} onGo={setStep} />

          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-textsec dark:text-slate-400">Nombre de la solución</label>
                <input
                  required
                  value={form.nombreSolucion}
                  onChange={(e) => setForm({ ...form, nombreSolucion: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-textmain focus:border-primary focus:outline-none dark:border-slate-700 dark:text-slate-100"
                  placeholder="Ej. Portal de clientes"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-textsec dark:text-slate-400">Tipo de aplicación</label>
                <div className="mt-1">
                  <CustomSelect
                    value={form.tipoAplicacion}
                    onChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        tipoAplicacion: v,
                        serviciosSeleccionados: recomendacionesPorTipo[v]?.servicios ?? [],
                      }))
                    }
                    options={opcionesTipoApp}
                  />
                </div>
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-textsec dark:text-slate-400">
                  <Sparkles size={13} className="mt-0.5 shrink-0 text-primary" />
                  {recomendacionesPorTipo[form.tipoAplicacion]?.justificacion}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-textsec dark:text-slate-400">Descripción</label>
                  {descripcionAuto ? (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-primary dark:bg-blue-500/10">
                      Generada automáticamente
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDescripcionAuto(true)}
                      className="text-[11px] font-medium text-primary hover:underline"
                    >
                      Regenerar automáticamente
                    </button>
                  )}
                </div>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => {
                    setForm({ ...form, descripcion: e.target.value });
                    setDescripcionAuto(false);
                  }}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-textmain focus:border-primary focus:outline-none dark:border-slate-700 dark:text-slate-100"
                  placeholder="Se generará automáticamente según los servicios que selecciones"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-textsec dark:text-slate-400">Región</label>
                  <div className="mt-1">
                    <CustomSelect
                      value={form.region}
                      onChange={(v) => setForm({ ...form, region: v })}
                      options={opcionesRegion}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-textsec dark:text-slate-400">Usuarios estimados</label>
                  <input
                    type="number"
                    min={1}
                    value={form.numeroUsuarios}
                    onChange={(e) => setForm({ ...form, numeroUsuarios: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-textmain focus:border-primary focus:outline-none dark:border-slate-700 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-textsec dark:text-slate-400">Objetivo de la migración</label>
                <div className="mt-1">
                  <CustomSelect
                    value={form.objetivoMigracion}
                    onChange={(v) => setForm({ ...form, objetivoMigracion: v })}
                    options={opcionesObjetivo}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-textsec dark:text-slate-400">Nivel de disponibilidad</label>
                <div className="mt-1">
                  <CustomSelect
                    value={form.nivelDisponibilidad}
                    onChange={(v) => setForm({ ...form, nivelDisponibilidad: v })}
                    options={opcionesDisponibilidad}
                  />
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {Object.values(slaInfo).map((s) => (
                    <div
                      key={s.nivel}
                      className={`rounded-lg border p-3 text-xs ${
                        s.nivel === form.nivelDisponibilidad
                          ? "border-primary bg-blue-50 dark:bg-blue-500/10"
                          : "border-border dark:border-slate-700"
                      }`}
                    >
                      <p className="font-semibold text-textmain dark:text-slate-100">{s.nivel}</p>
                      <p className="text-textsec dark:text-slate-400">Caída: {s.downtimeAnual}</p>
                      <p className="mt-1 text-textsec dark:text-slate-400">{s.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <label className="text-sm font-medium text-textsec dark:text-slate-400">
                  Servicios Cloud seleccionados
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {catalogoServiciosDisponibles.map((s) => {
                    const esRecomendado = recomendados.includes(s);
                    const activo = form.serviciosSeleccionados.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => toggleServicio(s)}
                        className={`relative rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          activo
                            ? "border-primary bg-blue-50 text-primary dark:bg-blue-500/10"
                            : "border-border text-textsec dark:border-slate-700 dark:text-slate-400"
                        }`}
                      >
                        {s}
                        {esRecomendado && (
                          <span className="ml-1.5 text-[9px] font-bold uppercase text-security">★</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[11px] text-textsec dark:text-slate-500">
                  ★ = recomendado automáticamente para "{form.tipoAplicacion}"
                </p>

                <div className="mt-3 rounded-lg border border-dashed border-border bg-white p-3 text-xs dark:border-slate-700 dark:bg-slate-800">
                  <p className="mb-1 font-medium text-textmain dark:text-slate-100">
                    Descripción generada automáticamente
                  </p>
                  <p className="text-textsec dark:text-slate-400">
                    {form.descripcion || "Selecciona servicios para generar una descripción."}
                  </p>
                </div>

                <div className="mt-4 rounded-card border border-border bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/50">
                  <ArchitecturePreview servicios={form.serviciosSeleccionados} />
                </div>
              </div>

              <div className="card-transition rounded-card border-2 border-dashed border-primary/40 bg-blue-50/40 p-5 dark:border-primary/30 dark:bg-blue-500/5 lg:col-span-2">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" />
                  <p className="text-sm font-semibold text-textmain dark:text-slate-100">Costo estimado en vivo</p>
                </div>
                <div className="space-y-2">
                  {estimado.detalle.map((d) => (
                    <div key={d.servicio} className="flex items-center justify-between text-xs">
                      <span className="text-textsec dark:text-slate-400">{d.servicio}</span>
                      <span className="font-medium text-textmain dark:text-slate-100">{fmt(d.costoMensual)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-2 border-t border-border pt-3 dark:border-slate-700">
                  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 dark:bg-slate-800">
                    <span className="text-xs text-textsec dark:text-slate-400">Mensual</span>
                    <span className="text-lg font-bold text-costs">{fmt(estimado.total)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 dark:bg-slate-800">
                    <span className="text-xs text-textsec dark:text-slate-400">Anual</span>
                    <span className="text-lg font-bold text-textmain dark:text-slate-100">{fmt(estimado.total * 12)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="space-y-3 text-sm lg:col-span-3">
                <p className="font-semibold text-textmain dark:text-slate-100">Resumen de la propuesta</p>
                {[
                  ["Solución", form.nombreSolucion || "—"],
                  ["Tipo", form.tipoAplicacion],
                  ["Región", form.region],
                  ["Usuarios", String(form.numeroUsuarios)],
                  ["Disponibilidad", form.nivelDisponibilidad],
                  ["Objetivo", form.objetivoMigracion],
                  ["Servicios", form.serviciosSeleccionados.join(", ") || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-border pb-2 dark:border-slate-700">
                    <span className="text-textsec dark:text-slate-400">{label}</span>
                    <span className="max-w-[60%] text-right font-medium text-textmain dark:text-slate-100">
                      {value}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-1">
                  <span className="text-textsec dark:text-slate-400">Costo mensual estimado</span>
                  <span className="font-bold text-costs">{fmt(estimado.total)}</span>
                </div>
              </div>
              <div className="rounded-card border border-border bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50 lg:col-span-2">
                <WellArchitectedScore puntajes={puntajesPreview} />
              </div>
            </div>
          )}

          {/* Navegación del asistente */}
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-textsec transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ArrowLeft size={16} /> Atrás
            </button>
            {step < pasos.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(pasos.length - 1, s + 1))}
                disabled={step === 0 && !form.nombreSolucion.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
              >
                Siguiente <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={registrar}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <PlusCircle size={16} /> Registrar propuesta
              </button>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-card border border-border bg-card p-4 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs text-textsec dark:text-slate-400">Propuestas registradas</p>
            <p className="mt-1 text-2xl font-bold text-textmain dark:text-slate-100">{totalPropuestas}</p>
          </div>
          <div className="rounded-card border border-border bg-card p-4 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs text-textsec dark:text-slate-400">Usuarios totales estimados</p>
            <p className="mt-1 text-2xl font-bold text-textmain dark:text-slate-100">{usuariosTotales}</p>
          </div>
          <div className="rounded-card border border-border bg-card p-4 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs text-textsec dark:text-slate-400">Costo mensual proyectado</p>
            <p className="mt-1 text-2xl font-bold text-costs">{fmt(costoTotalMensual)}</p>
          </div>
          <div className="rounded-card border border-border bg-card p-4 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs text-textsec dark:text-slate-400">Servicio más usado</p>
            <p className="mt-1 truncate text-lg font-bold text-primary">{servicioMasUsado}</p>
          </div>
        </div>

        {/* Búsqueda y filtros */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textsec dark:text-slate-400" size={16} />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o región..."
              className="w-full rounded-lg border border-border bg-transparent py-2.5 pl-9 pr-3 text-sm text-textmain focus:border-primary focus:outline-none dark:border-slate-700 dark:text-slate-100"
            />
          </div>
          <div className="w-full sm:w-56">
            <CustomSelect value={filtroEstado} onChange={setFiltroEstado} options={opcionesEstadoFiltro} />
          </div>
        </div>

        {/* Tarjetas de propuestas */}
        <div>
          <p className="mb-3 font-semibold text-textmain dark:text-slate-100">
            Propuestas registradas ({propuestasFiltradas.length})
          </p>
          {propuestasFiltradas.length === 0 ? (
            <div className="rounded-card border border-dashed border-border bg-card p-8 text-center text-sm text-textsec dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              {propuestas.length === 0
                ? "Aún no se han registrado propuestas. Completa el asistente para comenzar."
                : "No hay propuestas que coincidan con tu búsqueda/filtro."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {propuestasFiltradas.map((p) => (
                <PropuestaCard
                  key={p.id}
                  propuesta={p}
                  onVerDetalle={setPropuestaPreview}
                  onEliminar={eliminarPropuesta}
                  onCambiarEstado={cambiarEstado}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {propuestaPreview && (
        <PropuestaPreviewModal propuesta={propuestaPreview} onClose={() => setPropuestaPreview(null)} />
      )}
    </div>
  );
}