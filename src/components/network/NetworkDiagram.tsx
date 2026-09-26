import { RefObject } from "react";
import { vpc, azs, subredes, nodos, conexiones, colorTipo, rutaTrafico, TipoNodoRed } from "../../data/networkTopology";

interface Props {
  vista: "logica" | "seguridad";
  mostrarFlujo: boolean;
  activo: string | null;
  onSelect: (id: string) => void;
  svgRef: RefObject<SVGSVGElement>;
}

function centro(n: { x: number; y: number; w: number; h: number }) {
  return { cx: n.x + n.w / 2, cy: n.y + n.h / 2 };
}

// Curva suave entre dos puntos (para que el diagrama se sienta más "circuito" que "diagrama de flujo plano")
function curva(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}

function IconoNodo({ tipo, x, y, color }: { tipo: TipoNodoRed; x: number; y: number; color: string }) {
  const props = { stroke: color, strokeWidth: 1.4, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (tipo) {
    case "internet":
      return (
        <g transform={`translate(${x},${y})`}>
          <path d="M0,6 a5,4 0 0 1 1,-7.9 a6,6 0 0 1 11,1.4 a4.2,4.2 0 0 1 -0.6,8.3 h-9.5 a3,3 0 0 1 -1.9,-1.8 Z" {...props} />
        </g>
      );
    case "dns":
    case "cdn":
      return (
        <g transform={`translate(${x},${y})`}>
          <circle cx="6" cy="6" r="6" {...props} />
          <ellipse cx="6" cy="6" rx="2.4" ry="6" {...props} />
          <line x1="0" y1="6" x2="12" y2="6" {...props} />
        </g>
      );
    case "igw":
      return (
        <g transform={`translate(${x},${y})`}>
          <path d="M6,0 L12,2.5 V6.5 C12,10 9,11.7 6,13 C3,11.7 0,10 0,6.5 V2.5 Z" {...props} />
        </g>
      );
    case "natgw":
      return (
        <g transform={`translate(${x},${y})`}>
          <path d="M0,3 h9 M6,0 l3,3 l-3,3" {...props} />
        </g>
      );
    case "compute":
      return (
        <g transform={`translate(${x},${y})`}>
          <rect x="0" y="0" width="12" height="12" rx="1.5" {...props} />
          <line x1="2" y1="3.5" x2="10" y2="3.5" {...props} />
          <line x1="2" y1="6" x2="10" y2="6" {...props} />
          <line x1="2" y1="8.5" x2="10" y2="8.5" {...props} />
        </g>
      );
    case "database":
      return (
        <g transform={`translate(${x},${y})`}>
          <ellipse cx="6" cy="2.2" rx="6" ry="2.2" {...props} />
          <path d="M0,2.2 V10 a6,2.2 0 0 0 12,0 V2.2" {...props} />
        </g>
      );
    default:
      return null;
  }
}

export default function NetworkDiagram({ vista, mostrarFlujo, activo, onSelect, svgRef }: Props) {
  return (
    <svg ref={svgRef} viewBox="0 0 920 440" className="h-auto w-full" style={{ background: "var(--net-canvas)" }}>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--net-line)" />
        </marker>
        <filter id="glowDot" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="dropShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Conexiones curvas */}
      {conexiones.map((c, idx) => {
        const nodoDesde = nodos.find((n) => n.id === c.from);
        const nodoHasta = nodos.find((n) => n.id === c.to);
        if (!nodoDesde || !nodoHasta) return null;
        const a = centro(nodoDesde);
        const b = centro(nodoHasta);
        return (
          <g key={idx}>
            <path
              d={curva(a.cx, a.cy, b.cx, b.cy)}
              fill="none"
              stroke="var(--net-line)"
              strokeWidth={2}
              strokeDasharray={c.tipo === "punteada" ? "5 4" : undefined}
              markerEnd="url(#arrow)"
            />
            {c.etiqueta && (
              <text
                x={(a.cx + b.cx) / 2}
                y={(a.cy + b.cy) / 2 - 6}
                textAnchor="middle"
                fontSize="9"
                fill="var(--net-subtext)"
              >
                {c.etiqueta}
              </text>
            )}
          </g>
        );
      })}

      {/* Contenedor VPC */}
      <rect
        x={vpc.x}
        y={vpc.y}
        width={vpc.w}
        height={vpc.h}
        rx={14}
        fill="var(--net-vpc-bg)"
        stroke="var(--net-vpc-border)"
        strokeWidth={1.5}
        strokeDasharray="6 4"
      />
      <text x={vpc.x + 14} y={vpc.y + 22} fontSize="11" fontWeight={700} fill="var(--net-text)">
        VPC {vpc.id} · {vpc.cidr}
      </text>

      {/* Zonas de disponibilidad */}
      {azs.map((az) => (
        <g key={az.id}>
          <rect
            x={az.x}
            y={az.y}
            width={az.w}
            height={az.h}
            rx={10}
            fill="var(--net-az-bg)"
            stroke="var(--net-az-border)"
            strokeWidth={1}
          />
          <text x={az.x + 10} y={az.y + 16} fontSize="9" fontWeight={700} fill="#3B82F6">
            Zona de disponibilidad {az.nombre}
          </text>
        </g>
      ))}

      {/* Subredes */}
      {subredes.map((s) => (
        <g key={s.id}>
          <rect
            x={s.x}
            y={s.y}
            width={s.w}
            height={s.h}
            rx={9}
            fill="var(--net-subnet-bg)"
            stroke={vista === "seguridad" ? "#F59E0B" : "var(--net-subnet-border)"}
            strokeWidth={1.5}
            strokeDasharray={vista === "seguridad" ? "4 3" : undefined}
          />
          <text x={s.x + 8} y={s.y + 16} fontSize="9" fontWeight={600} fill="var(--net-text)">
            {s.nombre} · {s.cidr}
          </text>
          <text x={s.x + 8} y={s.y + s.h - 6} fontSize="8" fill="var(--net-subtext)">
            {s.routeTable}
          </text>
        </g>
      ))}

      {/* Componentes */}
      {nodos.map((n) => {
        const color = colorTipo[n.tipo];
        const seleccionado = activo === n.id;
        const destacadoSeguridad = vista === "seguridad" && !!n.grupoSeguridad;
        return (
          <g
            key={n.id}
            onClick={() => onSelect(n.id)}
            className="cursor-pointer transition-opacity duration-200"
            opacity={activo && !seleccionado ? 0.5 : 1}
            filter="url(#dropShadow)"
          >
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={n.h}
              rx={9}
              fill="var(--net-node-bg)"
              stroke={destacadoSeguridad ? "#DC2626" : color}
              strokeWidth={seleccionado ? 3 : destacadoSeguridad ? 2 : 1.5}
              strokeDasharray={destacadoSeguridad ? "4 3" : undefined}
            />
            <IconoNodo tipo={n.tipo} x={n.x + 8} y={n.y + n.h / 2 - 6} color={color} />
            <text x={n.x + n.w / 2 + 8} y={n.y + n.h / 2 + 4} textAnchor="middle" fontSize="10" fontWeight={600} fill="var(--net-text)">
              {n.nombre}
            </text>
            {destacadoSeguridad && (
              <text x={n.x + n.w / 2} y={n.y + n.h + 11} textAnchor="middle" fontSize="8" fill="#DC2626">
                {n.grupoSeguridad}
              </text>
            )}
          </g>
        );
      })}

      {/* Flujo de tráfico simulado */}
      {mostrarFlujo && (
        <circle r={5} fill="#2563EB" filter="url(#glowDot)">
          <animateMotion path={rutaTrafico} dur="3s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}