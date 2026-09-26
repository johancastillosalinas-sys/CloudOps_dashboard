import { Link, Navigate, useParams } from "react-router-dom";
import * as Icons from "lucide-react";
import { ArrowLeft, MapPin, Layers, DollarSign } from "lucide-react";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { awsServices, regiones } from "../data/awsServices";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const service = awsServices.find((s) => s.id === id);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icono] ?? Icons.Box;
  const regionesDesplegado = regiones.filter((r) => r.serviciosDesplegados.includes(service.id));
  const relacionados = awsServices.filter((s) => s.categoria === service.categoria && s.id !== service.id);

  return (
    <div className="animate-fade-in">
      <Header titulo={service.nombre} subtitulo={service.categoria} />
      <div className="space-y-6 p-4 md:p-8">
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-textsec transition-colors hover:text-primary dark:text-slate-400"
        >
          <ArrowLeft size={16} /> Volver a Servicios AWS
        </Link>

        <div className="rounded-card border border-border bg-card p-6 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-500/10">
                <Icon className="text-primary" size={32} />
              </div>
              <div>
                <p className="text-2xl font-bold text-textmain dark:text-slate-100">{service.nombre}</p>
                <p className="text-sm font-medium uppercase tracking-wide text-textsec dark:text-slate-400">
                  {service.categoria}
                </p>
              </div>
            </div>
            <StatusBadge estado={service.estado} />
          </div>

          <p className="mt-5 text-sm text-textsec dark:text-slate-400">{service.descripcion}</p>

          <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-textsec dark:text-slate-400">
              Función principal
            </p>
            <p className="mt-1 text-sm text-textmain dark:text-slate-100">{service.funcionPrincipal}</p>
          </div>

          <Link
            to="/costs"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <DollarSign size={16} /> Estimar costo de este servicio
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3 flex items-center gap-2 font-semibold text-textmain dark:text-slate-100">
              <MapPin size={16} className="text-primary" /> Regiones donde está desplegado
            </p>
            {regionesDesplegado.length === 0 ? (
              <p className="text-sm text-textsec dark:text-slate-400">
                No está desplegado en ninguna región actualmente.
              </p>
            ) : (
              <ul className="space-y-2">
                {regionesDesplegado.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm dark:border-slate-700"
                  >
                    <span className="font-medium text-textmain dark:text-slate-100">{r.nombre}</span>
                    <span className="text-xs text-textsec dark:text-slate-400">
                      {r.ubicacion}, {r.pais}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3 flex items-center gap-2 font-semibold text-textmain dark:text-slate-100">
              <Layers size={16} className="text-primary" /> Servicios relacionados ({service.categoria})
            </p>
            {relacionados.length === 0 ? (
              <p className="text-sm text-textsec dark:text-slate-400">
                No hay otros servicios en esta categoría.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {relacionados.map((s) => {
                  const RIcon = (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icono] ?? Icons.Box;
                  return (
                    <Link
                      key={s.id}
                      to={`/services/${s.id}`}
                      className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-textsec transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-400"
                    >
                      <RIcon size={13} /> {s.nombre}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}