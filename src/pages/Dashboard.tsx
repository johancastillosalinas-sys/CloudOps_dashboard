import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { awsServices, regiones, indicadoresSeguridad } from "../data/awsServices";

const COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626"];

export default function Dashboard() {
  const estados = ["correcto", "revision", "problema"] as const;
  const dataSeguridad = estados.map((e) => ({
    name: e === "correcto" ? "Correcto" : e === "revision" ? "Revisión" : "Problema",
    value: indicadoresSeguridad.filter((i) => i.categoria !== "responsabilidad" && i.estado === e).length,
  }));

  const problemas = indicadoresSeguridad.filter((i) => i.estado === "problema").length;
  const estadoGeneral = problemas > 0 ? "problema" : "correcto";

  return (
    <div>
      <Header titulo="Dashboard" subtitulo="Resumen general de la solución Cloud" />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            titulo="Servicios utilizados"
            valor={String(awsServices.length)}
            subtitulo="Servicios AWS activos"
            icono="Boxes"
            color="primary"
          />
          <StatCard
            titulo="Región seleccionada"
            valor="us-east-1"
            subtitulo="N. Virginia, Estados Unidos"
            icono="MapPin"
            color="primary"
          />
          <StatCard
            titulo="Costo mensual estimado"
            valor="$482.50"
            subtitulo="Basado en uso simulado"
            icono="DollarSign"
            color="costs"
            tendencia="+3.2% vs. mes anterior"
          />
          <StatCard
            titulo="Costo anual estimado"
            valor="$5,790.00"
            subtitulo="Proyección anual"
            icono="TrendingUp"
            color="costs"
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
    </div>
  );
}