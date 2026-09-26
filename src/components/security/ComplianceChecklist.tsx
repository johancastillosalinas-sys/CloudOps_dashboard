import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { complianceChecklist } from "../../data/complianceChecklist";
import { HallazgoSeguridad } from "../../utils/securityScore";

interface Props {
    hallazgos: HallazgoSeguridad[];
    resueltos: Record<string, string>;
}

export default function ComplianceChecklist({ hallazgos, resueltos }: Props) {
    const filas = complianceChecklist.map((item) => {
        if (!item.indicadorId) return { ...item, resultado: "manual" as const };
        const h = hallazgos.find((x) => x.id === item.indicadorId);
        if (!h) return { ...item, resultado: "manual" as const };
        const resuelto = h.estado !== "correcto" && !!resueltos[h.id];
        return { ...item, resultado: (h.estado === "correcto" || resuelto ? "aprobado" : "atencion") as "aprobado" | "atencion" };
    });

    const aprobados = filas.filter((f) => f.resultado === "aprobado").length;

    return (
        <div>
            <p className="mb-3 text-sm text-textsec dark:text-slate-400">
                {aprobados} de {filas.length} controles aprobados
            </p>
            <ul className="space-y-2">
                {filas.map((f) => (
                    <li
                        key={f.id}
                        className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm dark:border-slate-700"
                    >
                        {f.resultado === "aprobado" && <CheckCircle2 className="mt-0.5 shrink-0 text-security" size={16} />}
                        {f.resultado === "atencion" && <AlertCircle className="mt-0.5 shrink-0 text-alert" size={16} />}
                        {f.resultado === "manual" && (
                            <HelpCircle className="mt-0.5 shrink-0 text-textsec dark:text-slate-500" size={16} />
                        )}
                        <div>
                            <p className="font-medium text-textmain dark:text-slate-100">
                                {f.control} — {f.descripcion}
                            </p>
                            <p className="text-xs text-textsec dark:text-slate-400">
                                {f.resultado === "aprobado" && "Control aprobado"}
                                {f.resultado === "atencion" && "Requiere atención"}
                                {f.resultado === "manual" && "Requiere verificación manual"}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
            <p className="mt-3 text-[10px] italic text-textsec dark:text-slate-500">
                * Checklist inspirado en el CIS AWS Foundations Benchmark, con fines educativos. No corresponde a una
                auditoría oficial de cumplimiento.
            </p>
        </div>
    );
}