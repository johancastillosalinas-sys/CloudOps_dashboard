import { useState } from "react";
import Header from "../components/Header";
import { nodosRed } from "../data/awsServices";

const posiciones: Record<string, { x: number; y: number; w: number }> = {
  internet: { x: 40, y: 130, w: 110 },
  route53: { x: 210, y: 60, w: 110 },
  cloudfront: { x: 210, y: 200, w: 110 },
  vpc: { x: 420, y: 130, w: 130 },
  ec2: { x: 610, y: 70, w: 150 },
  rds: { x: 610, y: 200, w: 150 },
};

const conexiones: [string, string][] = [
  ["internet", "route53"],
  ["internet", "cloudfront"],
  ["route53", "vpc"],
  ["cloudfront", "vpc"],
  ["vpc", "ec2"],
  ["vpc", "rds"],
];

const colorTipo: Record<string, string> = {
  internet: "#64748B",
  dns: "#2563EB",
  cdn: "#2563EB",
  vpc: "#16A34A",
  compute: "#F59E0B",
  database: "#DC2626",
};

export default function Network() {
  const [activo, setActivo] = useState<string | null>(null);
  const nodo = nodosRed.find((n) => n.id === activo);

  return (
    <div>
      <Header
        titulo="Arquitectura de Red"
        subtitulo="INTERNET → Route 53 → CloudFront → VPC → EC2 / RDS"
      />
      <div className="grid grid-cols-1 gap-6 p-4 md:p-8 lg:grid-cols-3">
        <div className="rounded-card border border-border bg-card p-4 shadow-card lg:col-span-2">
          <svg viewBox="0 0 800 280" className="h-auto w-full">
            {conexiones.map(([a, b], idx) => {
              const pa = posiciones[a];
              const pb = posiciones[b];
              const x1 = pa.x + pa.w;
              const y1 = pa.y + 20;
              const x2 = pb.x;
              const y2 = pb.y + 20;
              return (
                <line
                  key={idx}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#CBD5E1"
                  strokeWidth={2}
                  markerEnd="url(#arrow)"
                />
              );
            })}
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#94A3B8" />
              </marker>
            </defs>
            {nodosRed.map((n) => {
              const p = posiciones[n.id];
              const color = colorTipo[n.tipo];
              return (
                <g
                  key={n.id}
                  onClick={() => setActivo(n.id)}
                  className="cursor-pointer"
                  opacity={activo && activo !== n.id ? 0.5 : 1}
                >
                  <rect
                    x={p.x}
                    y={p.y}
                    width={p.w}
                    height={40}
                    rx={10}
                    fill="#FFFFFF"
                    stroke={color}
                    strokeWidth={activo === n.id ? 3 : 1.5}
                  />
                  <text
                    x={p.x + p.w / 2}
                    y={p.y + 24}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight={600}
                    fill="#1E293B"
                  >
                    {n.nombre}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-3 text-center text-xs text-textsec">
            Haz clic en un componente del diagrama para ver su detalle.
          </p>
        </div>

        <div className="rounded-card border border-border bg-card p-5 shadow-card">
          <p className="mb-3 font-semibold text-textmain">Detalle del componente</p>
          {nodo ? (
            <div>
              <p className="text-lg font-semibold" style={{ color: colorTipo[nodo.tipo] }}>
                {nodo.nombre}
              </p>
              <p className="mt-1 text-xs font-medium uppercase text-textsec">{nodo.tipo}</p>
              <p className="mt-3 text-sm text-textsec">{nodo.descripcion}</p>
            </div>
          ) : (
            <p className="text-sm text-textsec">
              Selecciona un componente del diagrama para ver información detallada de su función
              dentro de la arquitectura.
            </p>
          )}

          <div className="mt-6 space-y-2 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase text-textsec">Componentes internos (VPC)</p>
            <ul className="space-y-1 text-sm text-textsec">
              <li>• Subred pública — EC2 (aplicación)</li>
              <li>• Subred privada — RDS (base de datos)</li>
              <li>• Tablas de rutas y Security Groups</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
