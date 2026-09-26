import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { regiones } from "../data/awsServices";
import { useRegion } from "../context/RegionContext";

// Coordenadas aproximadas de cada región
const coordenadas: Record<string, { lat: number; lng: number }> = {
  "us-east-1": { lat: 38.13, lng: -78.45 },
  "us-west-2": { lat: 45.84, lng: -119.7 },
  "sa-east-1": { lat: -23.55, lng: -46.63 },
  "eu-west-1": { lat: 53.41, lng: -8.24 },
};

const colorEstado: Record<string, string> = {
  correcto: "#16A34A",
  revision: "#F59E0B",
  problema: "#DC2626",
};

export default function GlobeMap() {
  const { regionId, setRegionId } = useRegion();
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 300, height: 420 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const resize = () => setSize({ width: el.clientWidth, height: 420 });
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.6;
      globeRef.current.pointOfView({ lat: 20, lng: -50, altitude: 2.2 }, 0);
    }
  }, [size.width]);

  const puntos = regiones.map((r) => ({
    id: r.id,
    lat: coordenadas[r.id]?.lat ?? 0,
    lng: coordenadas[r.id]?.lng ?? 0,
    nombre: r.nombre,
    estado: r.estado,
  }));

  return (
    <div ref={containerRef} className="w-full overflow-hidden rounded-lg">
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#60A5FA"
        atmosphereAltitude={0.2}
        pointsData={puntos}
        pointLat="lat"
        pointLng="lng"
        pointColor={(d: any) => (d.id === regionId ? "#2563EB" : colorEstado[d.estado])}
        pointAltitude={(d: any) => (d.id === regionId ? 0.06 : 0.02)}
        pointRadius={(d: any) => (d.id === regionId ? 0.9 : 0.55)}
        pointLabel={(d: any) =>
          `<div style="font-family:sans-serif;font-size:12px;padding:4px 8px;background:#0F172A;color:#fff;border-radius:6px;">${d.nombre}</div>`
        }
        onPointClick={(d: any) => setRegionId(d.id)}
        ringsData={puntos.filter((p) => p.id === regionId)}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => "#2563EB"}
        ringMaxRadius={4}
        ringPropagationSpeed={2}
        ringRepeatPeriod={800}
      />
    </div>
  );
}