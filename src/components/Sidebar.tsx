import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  DollarSign,
  Globe2,
  ShieldCheck,
  Network,
  Boxes,
  Cloud,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/planning", label: "Planificación Cloud", Icon: ClipboardList },
  { to: "/costs", label: "Costos", Icon: DollarSign },
  { to: "/infrastructure", label: "Infraestructura Global", Icon: Globe2 },
  { to: "/security", label: "Seguridad", Icon: ShieldCheck },
  { to: "/network", label: "Arquitectura de Red", Icon: Network },
  { to: "/services", label: "Servicios AWS", Icon: Boxes },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-sidebar text-slate-200 md:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <Cloud className="text-primary" size={26} />
        <div>
          <p className="text-sm font-bold leading-tight text-white">CloudOps</p>
          <p className="text-xs leading-tight text-slate-400">Dashboard</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 px-6 py-4 text-xs text-slate-500">
            Cloud Foundations
      </div>
    </aside>
  );
}
