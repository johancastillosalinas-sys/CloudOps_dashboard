import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { regiones } from "../data/awsServices";
import { Region } from "../types/cloud";

interface RegionContextType {
  regionId: string;
  setRegionId: (id: string) => void;
  region: Region;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: ReactNode }) {
  const [regionId, setRegionId] = useState<string>(() => {
    return localStorage.getItem("selectedRegion") || regiones[0].id;
  });

  useEffect(() => {
    localStorage.setItem("selectedRegion", regionId);
  }, [regionId]);

  const region = regiones.find((r) => r.id === regionId) ?? regiones[0];

  return (
    <RegionContext.Provider value={{ regionId, setRegionId, region }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegion debe usarse dentro de <RegionProvider>");
  return ctx;
}