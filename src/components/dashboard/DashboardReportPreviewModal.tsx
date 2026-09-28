import { X, Download } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import CategoryBreakdown from "./CategoryBreakdown";
import RecentActivity from "./RecentActivity";
import { EventoActividad } from "../../utils/dashboardActivity";
import { fmt, generarReporteDashboardPDF, DashboardReportInput } from "../../utils/reportExport";

const COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626"];

interface Props extends DashboardReportInput {
  eventos: EventoActividad[];
  onClose: () => void;
}

export default function DashboardReportPreviewModal(props: Props) {
  const { onClose, eventos, ...datosReporte } = props;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-fade-in relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-card bg-white shadow-2xl dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-card bg-primary px-6 py-5 text-white">
          <div>
            <p className="text-lg font-bold">Resumen General - CloudOps Dashboard</p>
            <p className="text-xs text-blue-100">
              Región: {props.regionNombre} · {props.regionUbicacion} · Generado el{" "}
              {new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Costo mensual</p>
              <p className="text-xl font-bold text-costs">{fmt(props.totalMensual)}</p>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Costo anual</p>
              <p className="text-xl font-bold text-textmain dark:text-slate-100">{fmt(props.totalAnual)}</p>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Servicios en Costos</p>
              <p className="text-xl font-bold text-primary">{props.serviciosEnCostos}</p>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Regiones activas</p>
              <p className="text-xl font-bold text-textmain dark:text-slate-100">{props.regionesActivas}</p>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Recursos desplegados</p>
              <p className="text-xl font-bold text-textmain dark:text-slate-100">{props.recursosDesplegados}</p>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Estado de seguridad</p>
              <p className="truncate text-lg font-bold text-alert">{props.estadoSeguridad}</p>
              <p className="text-xs text-textsec dark:text-slate-400">{props.problemas} alerta(s)</p>
            </div>
          </div>

          {/* Tendencia + desglose */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="mb-2 text-sm font-semibold text-textmain dark:text-slate-100">Tendencia de costos</p>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={props.tendencia}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="mes" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Area type="monotone" dataKey="costo" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="mb-2 text-sm font-semibold text-textmain dark:text-slate-100">Desglose por categoría</p>
              <CategoryBreakdown data={props.desglose} totalGeneral={props.totalMensual} />
            </div>
          </div>

          {/* Seguridad + actividad */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="mb-2 text-sm font-semibold text-textmain dark:text-slate-100">Resumen de seguridad</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={props.dataSeguridad} dataKey="value" nameKey="name" innerRadius={40} outerRadius={65} paddingAngle={2}>
                    {props.dataSeguridad.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="mb-2 text-sm font-semibold text-textmain dark:text-slate-100">Actividad reciente</p>
              <RecentActivity eventos={eventos} />
            </div>
          </div>

          <p className="text-[10px] italic text-textsec dark:text-slate-500">
            * La tendencia de costos es una proyección referencial, no corresponde a facturación real de AWS.
          </p>
        </div>

        <div className="sticky bottom-0 flex flex-wrap justify-end gap-3 border-t border-border bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-textsec transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cerrar
          </button>
          <button
            onClick={() => generarReporteDashboardPDF({ ...datosReporte, eventos })}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Download size={16} /> Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}