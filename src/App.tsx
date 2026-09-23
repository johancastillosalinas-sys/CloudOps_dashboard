import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  DollarSign,
  Globe2,
  ShieldCheck,
  Network,
  Boxes,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Planning from "./pages/Planning";
import Costs from "./pages/Costs";
import Infrastructure from "./pages/Infrastructure";
import Security from "./pages/Security";
import NetworkPage from "./pages/Network";
import Services from "./pages/Services";

const mobileLinks = [
  { to: "/dashboard", Icon: LayoutDashboard },
  { to: "/planning", Icon: ClipboardList },
  { to: "/costs", Icon: DollarSign },
  { to: "/infrastructure", Icon: Globe2 },
  { to: "/security", Icon: ShieldCheck },
  { to: "/network", Icon: Network },
  { to: "/services", Icon: Boxes },
];

export default function App() {
  return (
    <div className="min-h-screen bg-bg dark:bg-slate-950">
      <Sidebar />
      <div className="pb-16 md:ml-64 md:pb-0">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/costs" element={<Costs />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/security" element={<Security />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>

      {/* Navegación móvil */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-border bg-white py-2 dark:border-slate-700 dark:bg-slate-900 md:hidden">
        {mobileLinks.map(({ to, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `rounded-lg p-2 ${isActive ? "text-primary" : "text-textsec"}`
            }
          >
            <Icon size={20} />
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
