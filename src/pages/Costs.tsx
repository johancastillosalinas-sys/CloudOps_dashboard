import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PlusCircle } from "lucide-react";
import Header from "../components/Header";
import CostCard from "../components/CostCard";
import { ItemCosto } from "../types/cloud";
import { catalogoServiciosDisponibles } from "../data/awsServices";

const PRECIO_HORA: Record<string, number> = {
  "Amazon EC2": 0.096,
  "Amazon S3": 0.023,
  "Amazon RDS": 0.145,
  "AWS IAM": 0,
  "Amazon VPC": 0.01,
  "Amazon Route 53": 0.02,
  "Amazon CloudFront": 0.03,
};

const semilla: ItemCosto[] = [
  {
    id: "1",
    servicio: "Amazon EC2",
    cantidad: 3,
    horasEstimadas: 730,
    costoUnitario: 0.096,
    costoEstimado: 210.24,
    costoMensual: 210.24,
    costoAnual: 2522.88,
  },
  {
    id: "2",
    servicio: "Amazon RDS",
    cantidad: 1,
    horasEstimadas: 730,
    costoUnitario: 0.145,
    costoEstimado: 105.85,
    costoMensual: 105.85,
    costoAnual: 1270.2,
  },
  {
    id: "3",
    servicio: "Amazon S3",
    cantidad: 1,
    horasEstimadas: 730,
    costoUnitario: 0.023,
    costoEstimado: 16.79,
    costoMensual: 16.79,
    costoAnual: 201.48,
  },
];

const fmt = (n: number) => n.toLocaleString("es-PE", { style: "currency", currency: "USD" });

export default function Costs() {
  const [items, setItems] = useState<ItemCosto[]>(semilla);
  const [servicio, setServicio] = useState(catalogoServiciosDisponibles[0]);
  const [cantidad, setCantidad] = useState(1);
  const [horas, setHoras] = useState(730);

  const agregar = (e: React.FormEvent) => {
    e.preventDefault();
    const precio = PRECIO_HORA[servicio] ?? 0.05;
    const mensual = precio * horas * cantidad;
    const nuevo: ItemCosto = {
      id: crypto.randomUUID(),
      servicio,
      cantidad,
      horasEstimadas: horas,
      costoUnitario: precio,
      costoEstimado: mensual,
      costoMensual: mensual,
      costoAnual: mensual * 12,
    };
    setItems((i) => [nuevo, ...i]);
  };

  const eliminar = (id: string) => setItems((i) => i.filter((x) => x.id !== id));

  const totalMensual = useMemo(() => items.reduce((a, i) => a + i.costoMensual, 0), [items]);
  const totalAnual = totalMensual * 12;

  const dataGrafico = items.map((i) => ({ name: i.servicio, Mensual: Number(i.costoMensual.toFixed(2)) }));

  return (
    <div>
      <Header titulo="Costos y economía Cloud" subtitulo="Estimación simulada de costos" />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-border bg-card p-5 shadow-card">
            <p className="text-sm text-textsec">Costo mensual total</p>
            <p className="mt-1 text-3xl font-bold text-costs">{fmt(totalMensual)}</p>
          </div>
          <div className="rounded-card border border-border bg-card p-5 shadow-card">
            <p className="text-sm text-textsec">Costo anual proyectado</p>
            <p className="mt-1 text-3xl font-bold text-textmain">{fmt(totalAnual)}</p>
          </div>
        </div>

        <div className="rounded-card border border-border bg-card p-5 shadow-card">
          <p className="mb-4 font-semibold text-textmain">Distribución de costos por servicio</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dataGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Bar dataKey="Mensual" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <form
          onSubmit={agregar}
          className="grid grid-cols-1 gap-3 rounded-card border border-border bg-card p-5 shadow-card sm:grid-cols-4"
        >
          <div>
            <label className="text-sm font-medium text-textsec">Servicio</label>
            <select
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {catalogoServiciosDisponibles.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-textsec">Cantidad</label>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-textsec">Horas estimadas / mes</label>
            <input
              type="number"
              min={1}
              value={horas}
              onChange={(e) => setHoras(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <PlusCircle size={18} />
              Agregar
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {items.map((item) => (
            <CostCard key={item.id} item={item} onRemove={eliminar} />
          ))}
        </div>
      </div>
    </div>
  );
}
