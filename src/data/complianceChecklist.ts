export interface ChecklistItem {
  id: string;
  control: string;
  descripcion: string;
  indicadorId?: string; // si existe, su estado determina el resultado automáticamente
}

export const complianceChecklist: ChecklistItem[] = [
  { id: "1.4", control: "1.4", descripcion: "Asegurar que el MFA esté habilitado para el usuario raíz", indicadorId: "iam-1" },
  { id: "1.16", control: "1.16", descripcion: "Asegurar que existan políticas IAM de privilegio mínimo", indicadorId: "iam-2" },
  { id: "1.14", control: "1.14", descripcion: "Asegurar la rotación de credenciales de acceso cada 90 días", indicadorId: "cuentas-1" },
  { id: "2.1", control: "2.1", descripcion: "Asegurar que los buckets S3 tengan cifrado en reposo", indicadorId: "datos-1" },
  { id: "1.20", control: "1.20", descripcion: "Asegurar el cumplimiento de políticas normativas internas", indicadorId: "cump-1" },
  { id: "4.1", control: "4.1", descripcion: "Habilitar AWS CloudTrail en todas las regiones" },
  { id: "3.1", control: "3.1", descripcion: "Habilitar AWS Config en todas las regiones" },
  { id: "2.3", control: "2.3", descripcion: "Habilitar el registro de acceso en buckets S3" },
];