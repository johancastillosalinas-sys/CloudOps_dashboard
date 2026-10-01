import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { PlusCircle, XCircle, FileText, TrendingUp, Info, AlertCircle, RefreshCcw, DollarSign, CalendarClock } from "lucide-react";
import Header from "../components/Header";
import CostCard from "../components/CostCard";
import CustomSelect, { SelectOption } from "../components/CustomSelect";
import ReportPreviewModal from "../components/ReportPreviewModal";
import { awsServices, catalogoServiciosDisponibles } from "../data/awsServices";
import { useCosts } from "../hooks/useCosts";
import { fmt } from "../utils/reportExport";
import { usePropuestas } from "../hooks/usePropuestas";
import PropuestaPendienteCard from "../components/costs/PropuestaPendienteCard";
import ConfirmAcceptModal from "../components/costs/ConfirmAcceptModal";
import { PropuestaCloud } from "../types/cloud";

const PRECIO_HORA: Record<string, number> = {
  "Amazon EC2": 0.096,
  "Amazon S3": 0.023,
  "Amazon RDS": 0.145,
  "AWS IAM": 0,
  "Amazon VPC": 0.01,
  "Amazon Route 53": 0.02,
  "Amazon CloudFront": 0.03,
};

const infoServicio: Record<string, { icono: string; categoria: string }> = Object.fromEntries(
  awsServices.map((s) => [s.nombre, { icono: s.icono, categoria: s.categoria }])
);

const opcionesServicio: SelectOption[] = awsServices.map((s) => ({
  value: s.nombre,
  label: s.nombre,
  description: s.categoria,
  icon: s.icono,
}));

const COLORS = ["#2563EB", "#F59E0B", "#16A34A", "#DC2626", "#8B5CF6", "#0EA5E9", "#EC4899"];

export default function Costs() {
  const { items, cargando, error, crear, eliminar, recargar } = useCosts();
  const { propuestas, decidirCosto } = usePropuestas();

  const [procesandoId, setProcesandoId] = useState<string | null>(null);
  const [propuestaAConfirmar, setPropuestaAConfirmar] = useState<PropuestaCloud | null>(null);

  const [servicio, setServicio] = useState(catalogoServiciosDisponibles[0]);
  const [cantidad, setCantidad] = useState(1);
  const [horas, setHoras] = useState(730);
  const [filtroServicio, setFiltroServicio] = useState<string | null>(null);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const propuestasPendientes = propuestas.filter((p) => p.estadoCosto === "pendiente" || !p.estadoCosto);

  const totalMensual = useMemo(() => items.reduce((a, i) => a + i.costoMensual, 0), [items]);
  const totalAnual = totalMensual * 12;

  const detalleServicio = awsServices.find((s) => s.nombre === servicio);
  const precioHoraActual = PRECIO_HORA[servicio] ?? 0.05;
  const costoMensualPreview = precioHoraActual * horas * cantidad;
  const costoAnualPreview = costoMensualPreview * 12;
  const impactoPct = totalMensual > 0 ? (costoMensualPreview / totalMensual) * 100 : 100;
  const IconPreview =
    (Icons as unknown as Record<string, Icons.LucideIcon>)[detalleServicio?.icono ?? "Box"] ?? Icons.Box;

  const confirmarAceptacion = async () => {
    if (!propuestaAConfirmar) return;
    setProcesandoId(propuestaAConfirmar.id);
    try {
      await decidirCosto(propuestaAConfirmar.id, "aceptar");
      await recargar();
      setPropuestaAConfirmar(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo aceptar la propuesta.");
    } finally {
      setProcesandoId(null);
    }
  };

  const manejarDescartar = async (id: string) => {
    setProcesandoId(id);
    try {
      await decidirCosto(id, "descartar");
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo descartar la propuesta.");
    } finally {
      setProcesandoId(null);
    }
  };

  const agregar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await crear({
        servicio,
        cantidad,
        horasEstimadas: horas,
        costoUnitario: precioHoraActual,
        costoMensual: costoMensualPreview,
        costoAnual: costoAnualPreview,
      });
      setAgregado(true);
      setTimeout(() => setAgregado(false), 1800);
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo agregar el costo.");
    } finally {
      setEnviando(false);
    }
  };

  const dataBarras = items.map((i) => ({ name: i.servicio, Mensual: Number(i.costoMensual.toFixed(2)) }));
  const dataTorta = items.map((i) => ({ name: i.servicio, value: Number(i.costoMensual.toFixed(2)) }));

  const itemsVisibles = filtroServicio ? items.filter((i) => i.servicio === filtroServicio) : items;
  const toggleFiltro = (nombre: string) => setFiltroServicio((actual) => (actual === nombre ? null : nombre));

  return (
    <div className="animate-fade-in">
      <Header titulo="Costos y economía Cloud" subtitulo="Estimación simulada de costos" />
      <div className="space-y-6 p-4 md:p-8">
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-alert dark:border-red-500/30 dark:bg-red-500/10">
            <span className="flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </span>
            <button
              onClick={recargar}
              className="flex items-center gap-1.5 rounded-lg border border-alert px-2.5 py-1 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-500/20"
            >
              <RefreshCcw size={13} /> Reintentar
            </button>
          </div>
        )}

        {/* KPIs principales de costo */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card-transition flex items-start justify-between rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <div>
              <p className="text-sm font-medium text-textsec dark:text-slate-400">Costo mensual total</p>
              <p className="mt-1 text-3xl font-bold text-costs">{cargando ? "···" : fmt(totalMensual)}</p>
              <p className="mt-1 text-xs text-textsec dark:text-slate-400">
                {cargando ? "Cargando..." : `${items.length} servicio(s) activo(s)`}
              </p>
            </div>
            <span className="rounded-lg bg-amber-50 p-2.5 dark:bg-amber-500/10">
              <DollarSign className="text-costs" size={20} />
            </span>
          </div>

          <div className="card-transition flex items-start justify-between rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <div>
              <p className="text-sm font-medium text-textsec dark:text-slate-400">Costo anual proyectado</p>
              <p className="mt-1 text-3xl font-bold text-textmain dark:text-slate-100">
                {cargando ? "···" : fmt(totalAnual)}
              </p>
              <p className="mt-1 text-xs text-textsec dark:text-slate-400">Proyección a 12 meses</p>
            </div>
            <span className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-500/10">
              <CalendarClock className="text-primary" size={20} />
            </span>
          </div>
        </div>

        {/* Propuestas pendientes de aprobación */}
        {propuestasPendientes.length > 0 && (
          <div>
            <p className="mb-3 font-semibold text-textmain dark:text-slate-100">
              Propuestas pendientes de aprobación ({propuestasPendientes.length})
            </p>
            <div className="space-y-3">
              {propuestasPendientes.map((p) => (
                <PropuestaPendienteCard
                  key={p.id}
                  propuesta={p}
                  totalMensualActual={totalMensual}
                  onAceptar={setPropuestaAConfirmar}
                  onDescartar={manejarDescartar}
                  procesando={procesandoId === p.id}
                />
              ))}
            </div>
          </div>
        )}

        {cargando ? (
          <div className="rounded-card border border-dashed border-border p-10 text-center text-sm text-textsec dark:border-slate-700 dark:text-slate-400">
            Cargando tus costos desde el servidor...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900 lg:col-span-2">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-textmain dark:text-slate-100">
                      Distribución de costos por servicio
                    </p>
                    <p className="text-xs text-textsec dark:text-slate-400">
                      Haz clic en una barra para filtrar la lista.
                    </p>
                  </div>
                  {filtroServicio && (
                    <button
                      onClick={() => setFiltroServicio(null)}
                      className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-textsec transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <XCircle size={14} /> Quitar filtro: {filtroServicio}
                    </button>
                  )}
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={dataBarras}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" fontSize={12} tick={{ fill: "var(--legend-color, #1E293B)" }} />
                    <YAxis fontSize={12} tick={{ fill: "var(--legend-color, #1E293B)" }} />
                    <Tooltip
                      formatter={(v: number) => fmt(v)}
                      contentStyle={{
                        backgroundColor: "var(--tooltip-bg, #FFFFFF)",
                        border: "1px solid var(--tooltip-border, #E2E8F0)",
                        borderRadius: 8,
                        color: "var(--tooltip-text, #1E293B)",
                      }}
                    />
                    <Bar dataKey="Mensual" radius={[6, 6, 0, 0]} cursor="pointer" onClick={(data: any) => toggleFiltro(data.name)}>
                      {dataBarras.map((d, i) => (
                        <Cell
                          key={i}
                          fill={filtroServicio === d.name ? "#2563EB" : "#F59E0B"}
                          opacity={filtroServicio && filtroServicio !== d.name ? 0.4 : 1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
                <p className="mb-4 font-semibold text-textmain dark:text-slate-100">Participación por servicio</p>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={dataTorta} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                      {dataTorta.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => fmt(v)} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "var(--legend-color, #1E293B)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
              <form
                onSubmit={agregar}
                className="space-y-4 rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900 lg:col-span-3"
              >
                <p className="font-semibold text-textmain dark:text-slate-100">Configurar nuevo servicio</p>

                <div>
                  <label className="text-sm font-medium text-textsec dark:text-slate-400">Servicio</label>
                  <div className="mt-1">
                    <CustomSelect value={servicio} onChange={setServicio} options={opcionesServicio} />
                  </div>
                  {detalleServicio && (
                    <p className="mt-1.5 text-xs text-textsec dark:text-slate-400">{detalleServicio.descripcion}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-textsec dark:text-slate-400">Cantidad</label>
                    <input
                      type="number"
                      min={1}
                      value={cantidad}
                      onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                      className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-textmain dark:border-slate-700 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-textsec dark:text-slate-400">Horas estimadas / mes</label>
                    <input
                      type="number"
                      min={1}
                      max={744}
                      value={horas}
                      onChange={(e) => setHoras(Math.max(1, Number(e.target.value)))}
                      className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-textmain dark:border-slate-700 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs text-primary dark:bg-blue-500/10">
                  <Info size={14} className="mt-0.5 shrink-0" />
                  <span>
                    Precio base: {fmt(precioHoraActual)} por hora · Categoría: {detalleServicio?.categoria ?? "—"}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                >
                  <PlusCircle size={18} />
                  {enviando ? "Guardando..." : agregado ? "¡Agregado!" : "Agregar servicio"}
                </button>
              </form>

              <div className="card-transition rounded-card border-2 border-dashed border-primary/40 bg-blue-50/40 p-5 shadow-card dark:border-primary/30 dark:bg-blue-500/5 lg:col-span-2">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" />
                  <p className="text-sm font-semibold text-textmain dark:text-slate-100">Vista previa del costo</p>
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-white p-2.5 shadow-sm dark:bg-slate-800">
                    <IconPreview className="text-primary" size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-textmain dark:text-slate-100">{servicio}</p>
                    <p className="text-xs text-textsec dark:text-slate-400">
                      {cantidad} unidad(es) × {horas} h × {fmt(precioHoraActual)}/h
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5 dark:bg-slate-800">
                    <span className="text-xs text-textsec dark:text-slate-400">Costo mensual</span>
                    <span className="text-lg font-bold text-costs">{fmt(costoMensualPreview)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5 dark:bg-slate-800">
                    <span className="text-xs text-textsec dark:text-slate-400">Costo anual</span>
                    <span className="text-lg font-bold text-textmain dark:text-slate-100">{fmt(costoAnualPreview)}</span>
                  </div>
                </div>

                <p className="mt-3 text-center text-[11px] text-textsec dark:text-slate-400">
                  {totalMensual > 0
                    ? `Representaría ~${impactoPct.toFixed(1)}% de tu gasto mensual actual`
                    : "Este sería tu primer servicio registrado"}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold text-textmain dark:text-slate-100">
                  Detalle de costos {filtroServicio && `— ${filtroServicio}`}
                </p>
                <button
                  onClick={() => setMostrarPreview(true)}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  <FileText size={16} /> Vista previa del reporte
                </button>
              </div>
              <div className="space-y-3">
                {itemsVisibles.map((item) => (
                  <CostCard
                    key={item.id}
                    item={item}
                    onRemove={eliminar}
                    porcentaje={totalMensual > 0 ? (item.costoMensual / totalMensual) * 100 : 0}
                    icono={infoServicio[item.servicio]?.icono ?? "Box"}
                    categoria={infoServicio[item.servicio]?.categoria ?? "Otro"}
                  />
                ))}
                {itemsVisibles.length === 0 && (
                  <p className="rounded-card border border-dashed border-border p-6 text-center text-sm text-textsec dark:border-slate-700 dark:text-slate-400">
                    {items.length === 0
                      ? "Aún no tienes costos registrados. Agrega el primero con el formulario de arriba."
                      : "No hay costos para este filtro."}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {mostrarPreview && (
        <ReportPreviewModal
          items={items}
          totalMensual={totalMensual}
          totalAnual={totalAnual}
          onClose={() => setMostrarPreview(false)}
        />
      )}
      {propuestaAConfirmar && (
        <ConfirmAcceptModal
          propuesta={propuestaAConfirmar}
          totalMensualActual={totalMensual}
          onConfirmar={confirmarAceptacion}
          onCerrar={() => setPropuestaAConfirmar(null)}
          procesando={procesandoId === propuestaAConfirmar.id}
        />
      )}
    </div>
  );
}