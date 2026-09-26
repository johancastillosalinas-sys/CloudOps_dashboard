// Códigos ISO 3166-1 alpha-2 en minúscula, usados por la librería flag-icons
export const countryCodes: Record<string, string> = {
  "Estados Unidos": "us",
  "Brasil": "br",
  "Irlanda": "ie",
};

export function flagCodeFor(pais: string) {
  return countryCodes[pais];
}