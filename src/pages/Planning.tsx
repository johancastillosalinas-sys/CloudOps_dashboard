import { useState } from "react";
import { PlusCircle } from "lucide-react";
import Header from "../components/Header";
import { PropuestaCloud } from "../types/cloud";
import { regiones, catalogoServiciosDisponibles } from "../data/awsServices";

const vacio = {
  nombreSolucion: "",
  tipoAplicacion: "Aplicación web",
  descripcion: "",
  region: regiones[0].nombre,
  numeroUsuarios: 100,
  nivelDisponibilidad: "99.9%",
  serviciosSeleccionados: [] as string[],
  objetivoMigracion: "Modernización",
};

export default function Planning() {
  const [form, setForm] = useState(vacio);
  const [propuestas, setPropuestas] = useState<PropuestaCloud[]>([]);

  const toggleServicio = (s: string) => {
    setForm((f) => ({
      ...f,
      serviciosSeleccionados: f.serviciosSeleccionados.includes(s)
        ? f.serviciosSeleccionados.filter((x) => x !== s)
        : [...f.serviciosSeleccionados, s],
    }));
  };

  const registrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombreSolucion.trim()) return;
    const nueva: PropuestaCloud = {
      id: crypto.randomUUID(),
      ...form,
      fecha: new Date().toLocaleDateString("es-PE"),
    };
    setPropuestas((p) => [nueva, ...p]);
    setForm(vacio);
  };

  return (
    <div>
      <Header titulo="Planificación Cloud" subtitulo="Registra una propuesta de solución Cloud" />
      <div className="grid grid-cols-1 gap-6 p-4 md:p-8 lg:grid-cols-5">
        <form
          onSubmit={registrar}
          className="space-y-4 rounded-card border border-border bg-card p-5 shadow-card lg:col-span-2"
        >
          <p className="font-semibold text-textmain">Nueva propuesta</p>

          <div>
            <label className="text-sm font-medium text-textsec">Nombre de la solución</label>
            <input
              required
              value={form.nombreSolucion}
              onChange={(e) => setForm({ ...form, nombreSolucion: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Ej. Portal de clientes"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-textsec">Tipo de aplicación</label>
            <select
              value={form.tipoAplicacion}
              onChange={(e) => setForm({ ...form, tipoAplicacion: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option>Aplicación web</option>
              <option>API / Backend</option>
              <option>Aplicación móvil</option>
              <option>Sistema interno</option>
              <option>Data / Analítica</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-textsec">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              rows={3}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Breve descripción de la solución"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-textsec">Región</label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {regiones.map((r) => (
                  <option key={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-textsec">Usuarios estimados</label>
              <input
                type="number"
                min={1}
                value={form.numeroUsuarios}
                onChange={(e) => setForm({ ...form, numeroUsuarios: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-textsec">Nivel de disponibilidad</label>
            <select
              value={form.nivelDisponibilidad}
              onChange={(e) => setForm({ ...form, nivelDisponibilidad: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option>99.9%</option>
              <option>99.95%</option>
              <option>99.99%</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-textsec">Servicios Cloud seleccionados</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {catalogoServiciosDisponibles.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleServicio(s)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    form.serviciosSeleccionados.includes(s)
                      ? "border-primary bg-blue-50 text-primary"
                      : "border-border text-textsec"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-textsec">Objetivo de la migración</label>
            <select
              value={form.objetivoMigracion}
              onChange={(e) => setForm({ ...form, objetivoMigracion: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option>Modernización</option>
              <option>Reducción de costos</option>
              <option>Escalabilidad</option>
              <option>Continuidad del negocio</option>
              <option>Expansión geográfica</option>
            </select>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <PlusCircle size={18} />
            Registrar propuesta
          </button>
        </form>

        <div className="lg:col-span-3">
          <p className="mb-3 font-semibold text-textmain">Propuestas registradas</p>
          {propuestas.length === 0 ? (
            <div className="rounded-card border border-dashed border-border bg-card p-8 text-center text-sm text-textsec">
              Aún no se han registrado propuestas. Completa el formulario para comenzar.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-card border border-border bg-card shadow-card">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-textsec">
                  <tr>
                    <th className="px-4 py-3">Solución</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Región</th>
                    <th className="px-4 py-3">Usuarios</th>
                    <th className="px-4 py-3">Disponibilidad</th>
                    <th className="px-4 py-3">Servicios</th>
                    <th className="px-4 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {propuestas.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium text-textmain">{p.nombreSolucion}</td>
                      <td className="px-4 py-3 text-textsec">{p.tipoAplicacion}</td>
                      <td className="px-4 py-3 text-textsec">{p.region}</td>
                      <td className="px-4 py-3 text-textsec">{p.numeroUsuarios}</td>
                      <td className="px-4 py-3 text-textsec">{p.nivelDisponibilidad}</td>
                      <td className="px-4 py-3 text-textsec">
                        {p.serviciosSeleccionados.join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3 text-textsec">{p.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
