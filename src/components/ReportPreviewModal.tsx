import { X, Download, FileText } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ItemCosto } from "../types/cloud";
import { fmt, exportarCSV, generarReportePDF } from "../utils/reportExport";

interface Props {
  items: ItemCosto[];
  totalMensual: number;
  totalAnual: number;
  onClose: () => void;
}

const COLORS = ["#2563EB", "#F59E0B", "#16A34A", "#DC2626", "#8B5CF6", "#0EA5E9", "#EC4899"];

export default function ReportPreviewModal({ items, totalMensual, totalAnual, onClose }: Props) {
  const masCostoso = items.reduce(
    (a, b) => (b.costoMensual > (a?.costoMensual ?? 0) ? b : a),
    items[0]
  );
  const dataTorta = items.map((i) => ({ name: i.servicio, value: Number(i.costoMensual.toFixed(2)) }));
  const dataBarras = items.map((i) => ({ name: i.servicio, Mensual: Number(i.costoMensual.toFixed(2)) }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-fade-in relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-card bg-white shadow-2xl dark:bg-slate-900">
        {/* Encabezado tipo membrete */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-card bg-primary px-6 py-5 text-white">
          <div>
            <p className="text-lg font-bold">Reporte de Costos Cloud</p>
            <p className="text-xs text-blue-100">
              CloudOps Dashboard · Generado el{" "}
              {new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Costo mensual</p>
              <p className="text-xl font-bold text-costs">{fmt(totalMensual)}</p>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Costo anual</p>
              <p className="text-xl font-bold text-textmain dark:text-slate-100">{fmt(totalAnual)}</p>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Servicios activos</p>
              <p className="text-xl font-bold text-primary">{items.length}</p>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Mayor costo</p>
              <p className="truncate text-sm font-bold text-alert">{masCostoso?.servicio ?? "—"}</p>
              <p className="text-xs text-textsec dark:text-slate-400">{fmt(masCostoso?.costoMensual ?? 0)}/mes</p>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="mb-2 text-sm font-semibold text-textmain dark:text-slate-100">
                Distribución por servicio
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={dataTorta} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {dataTorta.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="mb-2 text-sm font-semibold text-textmain dark:text-slate-100">
                Costo mensual por servicio
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dataBarras}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="Mensual" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabla detallada */}
          <div className="overflow-x-auto rounded-card border border-border dark:border-slate-700">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-textsec dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-2">Servicio</th>
                  <th className="px-3 py-2">Cant.</th>
                  <th className="px-3 py-2">Horas</th>
                  <th className="px-3 py-2">Mensual</th>
                  <th className="px-3 py-2">Anual</th>
                  <th className="px-3 py-2">% del total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id} className="border-t border-border dark:border-slate-700">
                    <td className="px-3 py-2 font-medium text-textmain dark:text-slate-100">{i.servicio}</td>
                    <td className="px-3 py-2 text-textsec dark:text-slate-400">{i.cantidad}</td>
                    <td className="px-3 py-2 text-textsec dark:text-slate-400">{i.horasEstimadas}</td>
                    <td className="px-3 py-2 font-medium text-costs">{fmt(i.costoMensual)}</td>
                    <td className="px-3 py-2 text-textsec dark:text-slate-400">{fmt(i.costoAnual)}</td>
                    <td className="px-3 py-2 text-textsec dark:text-slate-400">
                      {totalMensual > 0 ? ((i.costoMensual / totalMensual) * 100).toFixed(1) : "0.0"}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-slate-50 font-semibold dark:border-slate-700 dark:bg-slate-800">
                  <td className="px-3 py-2 text-textmain dark:text-slate-100">Total</td>
                  <td className="px-3 py-2" />
                  <td className="px-3 py-2" />
                  <td className="px-3 py-2 text-costs">{fmt(totalMensual)}</td>
                  <td className="px-3 py-2 text-textmain dark:text-slate-100">{fmt(totalAnual)}</td>
                  <td className="px-3 py-2">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Acciones */}
        <div className="sticky bottom-0 flex flex-wrap justify-end gap-3 border-t border-border bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-textsec transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cerrar
          </button>
          <button
            onClick={() => exportarCSV(items, totalMensual, totalAnual)}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-textmain transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <Download size={16} /> Descargar CSV
          </button>
          <button
            onClick={() => generarReportePDF(items, totalMensual, totalAnual)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <FileText size={16} /> Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}