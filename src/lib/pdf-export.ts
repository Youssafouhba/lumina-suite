import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type PeriodKey = "7d" | "30d" | "90d" | "ytd" | "12m";

export const PERIOD_LABELS: Record<PeriodKey, string> = {
  "7d": "7 derniers jours",
  "30d": "30 derniers jours",
  "90d": "90 derniers jours",
  ytd: "Depuis le 1er janvier",
  "12m": "12 derniers mois",
};

const NAVY: [number, number, number] = [15, 27, 61]; // matches Navy Trust primary
const ACCENT: [number, number, number] = [59, 111, 160];

function header(doc: jsPDF, title: string, subtitle: string, period: string) {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Estala", 14, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Plateforme de gestion locative", 14, 18);
  doc.setFontSize(8);
  const right = doc.internal.pageSize.getWidth() - 14;
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, right, 12, { align: "right" });
  doc.text(`Période : ${period}`, right, 18, { align: "right" });

  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, 14, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 110);
  doc.text(subtitle, 14, 49);
  doc.setTextColor(20, 20, 20);
}

function footer(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.text(`Estala · Confidentiel`, 14, h - 8);
    doc.text(`Page ${i} / ${pageCount}`, w - 14, h - 8, { align: "right" });
  }
}

export interface DashboardKpi {
  label: string;
  value: string;
  delta: string;
  hint: string;
}

export function buildDashboardPdf(opts: {
  period: PeriodKey;
  kpis: DashboardKpi[];
  revenue: { month: string; revenus: number; charges: number }[];
  occupancy: { name: string; value: number }[];
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  header(
    doc,
    "Rapport tableau de bord",
    "Synthèse des indicateurs clés du portefeuille",
    PERIOD_LABELS[opts.period],
  );

  autoTable(doc, {
    startY: 58,
    head: [["Indicateur", "Valeur", "Variation", "Détail"]],
    body: opts.kpis.map((k) => [k.label, k.value, k.delta, k.hint]),
    theme: "grid",
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: { 1: { fontStyle: "bold" } },
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 8,
    head: [["Mois", "Revenus (k€)", "Charges (k€)", "Net (k€)"]],
    body: opts.revenue.map((r) => [r.month, r.revenus, r.charges, r.revenus - r.charges]),
    theme: "striped",
    headStyles: { fillColor: ACCENT, textColor: 255 },
    styles: { fontSize: 9, cellPadding: 2.5 },
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 8,
    head: [["Immeuble", "Taux d'occupation"]],
    body: opts.occupancy.map((o) => [o.name, `${o.value} %`]),
    theme: "striped",
    headStyles: { fillColor: ACCENT, textColor: 255 },
    styles: { fontSize: 9, cellPadding: 2.5 },
  });

  footer(doc);
  return { doc, filename: `estala-dashboard-${opts.period}-${Date.now()}.pdf` };
}

export function exportDashboardPdf(opts: Parameters<typeof buildDashboardPdf>[0]) {
  const { doc, filename } = buildDashboardPdf(opts);
  doc.save(filename);
}

export interface ArrearRow {
  locataire: string;
  immeuble: string;
  montant: string;
  retard: string;
  etape: string;
  risque: string;
}

export function buildArrearsPdf(opts: { period: PeriodKey; arrears: ArrearRow[]; total: number }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  header(
    doc,
    "Rapport des impayés",
    "Suivi des dossiers en recouvrement et workflow de relance",
    PERIOD_LABELS[opts.period],
  );

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Encours total : € ${opts.total.toLocaleString("fr-FR")}`, 14, 58);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text(`${opts.arrears.length} dossiers actifs`, 14, 64);
  doc.setTextColor(20, 20, 20);

  autoTable(doc, {
    startY: 70,
    head: [["Locataire", "Immeuble", "Montant", "Retard", "Étape", "Risque"]],
    body: opts.arrears.map((a) => [a.locataire, a.immeuble, a.montant, a.retard, a.etape, a.risque]),
    theme: "grid",
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 9, cellPadding: 2.8 },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 5) {
        const v = String(data.cell.raw);
        if (v === "Élevé") data.cell.styles.textColor = [200, 30, 30];
        else if (v === "Moyen") data.cell.styles.textColor = [200, 130, 20];
        else if (v === "Faible") data.cell.styles.textColor = [30, 140, 70];
      }
    },
  });

  footer(doc);
  return { doc, filename: `estala-impayes-${opts.period}-${Date.now()}.pdf` };
}

export function exportArrearsPdf(opts: Parameters<typeof buildArrearsPdf>[0]) {
  const { doc, filename } = buildArrearsPdf(opts);
  doc.save(filename);
}
