import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import { awsServices, regiones, indicadoresSeguridad } from "../data/awsServices";
import { costItemsSeed } from "../data/costSeed";
import { ItemCosto, PropuestaCloud } from "../types/cloud";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useRegion } from "../context/RegionContext";
import { costosPorCategoria, generarTendencia } from "../utils/costCategoryBreakdown";
import { fmt } from "../utils/reportExport";

const COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626"];

export default function Dashboard() {
  const { region } = useRegion();
  const [costItems] = useLocalStorage<ItemCosto[]>("costItems", costItemsSeed);
  const [propuestas] = useLocalStorage<PropuestaCloud[]>("propuestas", []);

  const estados = ["correcto", "revision", "problema"] as const;
  const dataSeguridad = estados.map((e) => ({
    name: e === "correcto" ? "Correcto" : e === "revision" ? "Revisión" : "Problema",
    value: indicadoresSeguridad.filter((i) => i.categoria !== "responsabilidad" && i.estado === e).length,
  }));

  const problemas = indicadoresSeguridad.filter((i) => i.estado === "problema").length;
  const estadoGeneral = problemas > 0 ? "problema" : "correcto";

  const totalMensual = useMemo(() => costItems.reduce((a, i) => a + i.costoMensual, 0), [costItems]);
  const totalAnual = totalMensual * 12;

  const tendencia = useMemo(() => generarTendencia(totalMensual), [totalMensual]);
  const desglose = useMemo(() => costosPorCategoria(costItems), [costItems]);

  return (
    <div className="animate-fade-in">
      <Header titulo="Dashboard" subtitulo="Resumen general de la solución Cloud" />
      <div className="space-y-6 p-4 md:p-8">
        {/* Banner de bienvenida */}
        <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-textsec dark:text-slate-400">
            Resumen general
          </p>
          <p className="mt-1 text-lg font-bold text-textmain dark:text-slate-100">
            Bienvenido de nuevo, Equipo Cloud
          </p>
          <p className="text-sm text-textsec dark:text-slate-400">
            Región activa: <span className="font-medium text-primary">{region.nombre}</span> · {region.ubicacion},{" "}
            {region.pais} ·{" "}
            {new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            titulo="Servicios en Costos"
            valor={String(costItems.length)}
            subtitulo="Servicios con costo registrado"
            icono="Boxes"
            color="primary"
          />
          <StatCard
            titulo="Región seleccionada"
            valor={region.nombre}
            subtitulo={`${region.ubicacion}, ${region.pais}`}
            icono="MapPin"
            color="primary"
          />
          <StatCard
            titulo="Costo mensual estimado"
            valor={fmt(totalMensual)}
            subtitulo="Basado en costos registrados"
            icono="DollarSign"
            color="costs"
            sparkline={tendencia.map((t) => t.costo)}
          />
          <StatCard
            titulo="Costo anual estimado"
            valor={fmt(totalAnual)}
            subtitulo="Proyección anual"
            icono="TrendingUp"
            color="costs"
            sparkline={tendencia.map((t) => t.costo * 12)}
          />
          <StatCard
            titulo="Estado de seguridad"
            valor={estadoGeneral === "correcto" ? "Estable" : "Requiere atención"}
            subtitulo={`${problemas} alerta(s) activa(s)`}
            icono="ShieldCheck"
            color={estadoGeneral === "correcto" ? "security" : "alert"}
          />
          <StatCard
            titulo="Recursos Cloud"
            valor={String(regiones.reduce((a, r) => a + r.serviciosDesplegados.length, 0))}
            subtitulo="Recursos desplegados"
            icono="Layers"
            color="primary"
          />
          <StatCard
            titulo="Regiones activas"
            valor={String(regiones.length)}
            subtitulo="Infraestructura global"
            icono="Globe2"
            color="primary"
          />
          <StatCard
            titulo="Estado de la arquitectura"
            valor="Operativa"
            subtitulo="INTERNET → VPC → EC2/RDS"
            icono="Network"
            color="security"
          />
        </div>

        {/* Tendencia de costos + desglose por categoría */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-textsec dark:text-slate-400">
            Costos
          </p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-textmain dark:text-slate-100">Tendencia de costos</p>
                <span className="text-[11px] italic text-textsec dark:text-slate-500">
                  Proyección referencial, no facturación real
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={tendencia}>
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="mes" fontSize={12} tick={{ fill: "var(--legend-color, #1E293B)" }} />
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
                  <Area type="monotone" dataKey="costo" stroke="#2563EB" strokeWidth={2} fill="url(#trendFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
              <p className="mb-4 font-semibold text-textmain dark:text-slate-100">Desglose por categoría</p>
              <CategoryBreakdown data={desglose} totalGeneral={totalMensual} />
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-textsec dark:text-slate-400">
            Seguridad
          </p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900 lg:col-span-1">
              <p className="mb-4 font-semibold text-textmain dark:text-slate-100">Estado de seguridad</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={dataSeguridad}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {dataSeguridad.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ color: "var(--legend-color, #1E293B)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg, #FFFFFF)",
                      border: "1px solid var(--tooltip-border, #E2E8F0)",
                      borderRadius: 8,
                      color: "var(--tooltip-text, #1E293B)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900 lg:col-span-2">
              <p className="mb-4 font-semibold text-textmain dark:text-slate-100">Resumen del estado de seguridad</p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between border-b border-border pb-2 dark:border-slate-700">
                  <span className="text-textsec dark:text-slate-400">Modelo de responsabilidad compartida</span>
                  <span className="font-medium text-security">Definido</span>
                </li>
                <li className="flex items-center justify-between border-b border-border pb-2 dark:border-slate-700">
                  <span className="text-textsec dark:text-slate-400">Gestión de identidades (IAM)</span>
                  <span className="font-medium text-costs">Requiere revisión</span>
                </li>
                <li className="flex items-center justify-between border-b border-border pb-2 dark:border-slate-700">
                  <span className="text-textsec dark:text-slate-400">Protección de datos</span>
                  <span className="font-medium text-security">Correcto</span>
                </li>
                <li className="flex items-center justify-between pb-2">
                  <span className="text-textsec dark:text-slate-400">Cumplimiento normativo</span>
                  <span className="font-medium text-costs">Requiere revisión</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actividad reciente + accesos rápidos */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-textsec dark:text-slate-400">
            Actividad y accesos
          </p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900 lg:col-span-1">
              <p className="mb-4 font-semibold text-textmain dark:text-slate-100">Actividad reciente</p>
              <RecentActivity costItems={costItems} propuestas={propuestas} />
            </div>
            <div className="lg:col-span-2">
              <p className="mb-4 font-semibold text-textmain dark:text-slate-100">Accesos rápidos</p>
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}