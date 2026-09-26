import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ItemCosto } from "../types/cloud";
import { PropuestaCloud } from "../types/cloud";
import { PuntajeWA } from "./wellArchitected";
import { HallazgoSeguridad } from "./securityScore";
import { complianceChecklist } from "../data/complianceChecklist";

export const fmt = (n: number) =>
  n.toLocaleString("es-PE", { style: "currency", currency: "USD" });

export function exportarCSV(items: ItemCosto[], totalMensual: number, totalAnual: number) {
  const encabezado = "Servicio,Cantidad,Horas estimadas,Costo unitario,Costo mensual,Costo anual,% del total\n";
  const filas = items
    .map((i) => {
      const pct = totalMensual > 0 ? ((i.costoMensual / totalMensual) * 100).toFixed(1) : "0.0";
      return `"${i.servicio}",${i.cantidad},${i.horasEstimadas},${i.costoUnitario.toFixed(3)},${i.costoMensual.toFixed(2)},${i.costoAnual.toFixed(2)},${pct}%`;
    })
    .join("\n");
  const totales = `\nTotal,,,,${totalMensual.toFixed(2)},${totalAnual.toFixed(2)},100%\n`;
  const csv = encabezado + filas + totales;

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `reporte-costos-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}

export function generarReportePDF(items: ItemCosto[], totalMensual: number, totalAnual: number) {
  const doc = new jsPDF();

  // Encabezado tipo membrete
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Reporte de Costos Cloud", 14, 16);
  doc.setFontSize(10);
  doc.text("CloudOps Dashboard · Equipo Cloud", 14, 24);
  doc.setFontSize(9);
  const fecha = new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" });
  doc.text(fecha, 150, 16);

  // KPIs
  doc.setTextColor(30, 41, 59);
  let y = 42;
  const masCostoso = items.reduce((a, b) => (b.costoMensual > (a?.costoMensual ?? 0) ? b : a), items[0]);
  const kpis = [
    { label: "Costo mensual total", value: fmt(totalMensual) },
    { label: "Costo anual proyectado", value: fmt(totalAnual) },
    { label: "Servicios activos", value: String(items.length) },
  ];
  const boxWidth = 58;
  kpis.forEach((k, i) => {
    const x = 14 + i * (boxWidth + 4);
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, boxWidth, 22, 3, 3, "FD");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(k.label, x + 4, y + 8);
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text(k.value, x + 4, y + 17);
  });

  y += 32;

  // Gráfico de barras dibujado a mano (proporcional)
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Distribución de costos por servicio", 14, y);
  y += 7;
  const maxCosto = Math.max(...items.map((i) => i.costoMensual), 1);
  items.forEach((item) => {
    const barWidth = (item.costoMensual / maxCosto) * 110;
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(item.servicio, 14, y + 3.5);
    doc.setFillColor(245, 158, 11);
    doc.rect(65, y, Math.max(barWidth, 1), 4, "F");
    doc.setTextColor(30, 41, 59);
    doc.text(fmt(item.costoMensual), 65 + 114, y + 3.5);
    y += 7;
  });

  y += 5;

  // Tabla detallada
  autoTable(doc, {
    startY: y,
    head: [["Servicio", "Cant.", "Horas", "Costo unit.", "Mensual", "Anual", "% del total"]],
    body: items.map((i) => [
      i.servicio,
      String(i.cantidad),
      String(i.horasEstimadas),
      fmt(i.costoUnitario),
      fmt(i.costoMensual),
      fmt(i.costoAnual),
      `${totalMensual > 0 ? ((i.costoMensual / totalMensual) * 100).toFixed(1) : "0.0"}%`,
    ]),
    foot: [["Total", "", "", "", fmt(totalMensual), fmt(totalAnual), "100%"]],
    headStyles: { fillColor: [37, 99, 235] },
    footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold" },
    styles: { fontSize: 8 },
  });

  const paginaFinal = (doc as any).lastAutoTable?.finalY ?? y;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Servicio de mayor costo: ${masCostoso?.servicio ?? "-"} (${fmt(masCostoso?.costoMensual ?? 0)}/mes)`,
    14,
    paginaFinal + 10
  );

  doc.save(`reporte-costos-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function generarReportePropuestaPDF(p: PropuestaCloud, puntajes: PuntajeWA[]) {
  const doc = new jsPDF();

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(p.nombreSolucion, 14, 16);
  doc.setFontSize(10);
  doc.text(`Propuesta de Solución Cloud · ${p.tipoAplicacion}`, 14, 24);

  doc.setTextColor(30, 41, 59);
  let y = 42;
  doc.setFontSize(10);
  const filas: [string, string][] = [
    ["Región", p.region],
    ["Usuarios estimados", String(p.numeroUsuarios)],
    ["Nivel de disponibilidad", p.nivelDisponibilidad],
    ["Objetivo de migración", p.objetivoMigracion],
    ["Costo mensual estimado", fmt(p.costoMensualEstimado)],
    ["Costo anual estimado", fmt(p.costoMensualEstimado * 12)],
    ["Fecha de registro", p.fecha],
    ["Estado", p.estado],
  ];
  filas.forEach(([label, value]) => {
    doc.setTextColor(100, 116, 139);
    doc.text(label, 14, y);
    doc.setTextColor(30, 41, 59);
    doc.text(value, 80, y);
    y += 7;
  });

  y += 3;
  doc.setFontSize(11);
  doc.text("Descripción", 14, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const descLines = doc.splitTextToSize(p.descripcion || "Sin descripción registrada.", 180);
  doc.text(descLines, 14, y);
  y += descLines.length * 5 + 6;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.text("Servicios seleccionados", 14, y);
  y += 6;
  doc.setFontSize(9);
  p.serviciosSeleccionados.forEach((s) => {
    doc.setFillColor(37, 99, 235);
    doc.circle(16, y - 1.5, 1, "F");
    doc.setTextColor(71, 85, 105);
    doc.text(s, 20, y);
    y += 5.5;
  });

  y += 6;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.text("Puntaje Well-Architected (estimado)", 14, y);

  autoTable(doc, {
    startY: y + 3,
    head: [["Pilar", "Puntaje", "Comentario"]],
    body: puntajes.map((pt) => [pt.pilar, `${pt.puntaje}/100`, pt.comentario]),
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 8 },
  });

  doc.save(`propuesta-${p.nombreSolucion.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

export function generarReporteSeguridadPDF(
  score: number,
  hallazgos: HallazgoSeguridad[],
  resueltos: Record<string, string>
) {
  const doc = new jsPDF();

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Reporte de Seguridad Cloud", 14, 16);
  doc.setFontSize(10);
  doc.text("CloudOps Dashboard · Equipo Cloud", 14, 24);
  const fecha = new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" });
  doc.text(fecha, 160, 16);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.text(`Puntaje de postura de seguridad: ${score}/100`, 14, 42);

  const abiertos = hallazgos.filter((h) => h.estado !== "correcto" && !resueltos[h.id]);
  const resueltosCount = hallazgos.filter((h) => h.estado !== "correcto" && resueltos[h.id]).length;

  autoTable(doc, {
    startY: 50,
    head: [["Severidad", "Hallazgo", "Estado"]],
    body: hallazgos.map((h) => {
      const resuelto = h.estado !== "correcto" && !!resueltos[h.id];
      const estadoTexto = resuelto
        ? "Resuelto"
        : h.estado === "correcto"
        ? "Correcto"
        : h.estado === "revision"
        ? "Requiere revisión"
        : "Problema";
      return [h.severidad.toUpperCase(), h.titulo, estadoTexto];
    }),
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 8 },
  });

  let y = (doc as any).lastAutoTable?.finalY ?? 60;
  y += 10;
  doc.setFontSize(11);
  doc.text("Checklist de cumplimiento (estilo CIS AWS Foundations Benchmark)", 14, y);

  autoTable(doc, {
    startY: y + 4,
    head: [["Control", "Descripción", "Resultado"]],
    body: complianceChecklist.map((item) => {
      if (!item.indicadorId) return [item.control, item.descripcion, "Manual"];
      const h = hallazgos.find((x) => x.id === item.indicadorId);
      if (!h) return [item.control, item.descripcion, "Manual"];
      const resuelto = h.estado !== "correcto" && !!resueltos[h.id];
      return [item.control, item.descripcion, h.estado === "correcto" || resuelto ? "Aprobado" : "Requiere atención"];
    }),
    headStyles: { fillColor: [22, 163, 74] },
    styles: { fontSize: 8 },
  });

  const finalY = (doc as any).lastAutoTable?.finalY ?? y;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Hallazgos abiertos: ${abiertos.length} · Resueltos: ${resueltosCount} · Total evaluados: ${hallazgos.length}`,
    14,
    finalY + 10
  );
  doc.text(
    "* Checklist con fines educativos, no corresponde a una auditoría oficial de cumplimiento.",
    14,
    finalY + 16
  );

  doc.save(`reporte-seguridad-${new Date().toISOString().slice(0, 10)}.pdf`);
}