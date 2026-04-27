import { useState } from "react";
import { AlertTriangle, MessageCircle, Phone, Mail, ChevronRight, Download } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PeriodFilter } from "@/components/period-filter";
import { exportArrearsPdf, PeriodKey } from "@/lib/pdf-export";
import { toast } from "sonner";
import { arrears } from "@/lib/mock-data";

const riskStyle: Record<string, string> = {
  "Élevé": "bg-destructive/10 text-destructive border-destructive/20",
  "Moyen": "bg-warning/10 text-warning border-warning/30",
  "Faible": "bg-success/10 text-success border-success/20",
};

export default function Impayes() {
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const total = arrears.reduce((s, a) => s + parseInt(a.montant.replace(/\D/g, "")), 0);

  const handleExport = () => {
    exportArrearsPdf({ period, arrears, total });
    toast.success("Rapport PDF généré");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Recouvrement"
        title="Impayés & relances"
        description="Workflow multi-canal automatisé : SMS, email, WhatsApp, mise en demeure."
        actions={
          <>
            <PeriodFilter value={period} onChange={setPeriod} />
            <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={handleExport}>
              <Download className="h-4 w-4" /> Export PDF
            </Button>
            <Button variant="outline" size="sm" className="h-9">Pause des relances</Button>
          </>
        }
      />

      <div className="p-4 md:p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 border-border/60 bg-gradient-to-br from-destructive/5 to-transparent">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wider font-semibold">Encours total</p>
            </div>
            <p className="mt-1 font-display text-3xl font-semibold">€ {total.toLocaleString("fr-FR")}</p>
            <p className="text-xs text-muted-foreground">{arrears.length} dossiers actifs</p>
          </Card>
          <Card className="p-5 border-border/60">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Dossiers à risque élevé</p>
            <p className="mt-1 font-display text-3xl font-semibold">{arrears.filter((a) => a.risque === "Élevé").length}</p>
            <p className="text-xs text-muted-foreground">Nécessitent une action manuelle</p>
          </Card>
          <Card className="p-5 border-border/60">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Récupération (30j)</p>
            <p className="mt-1 font-display text-3xl font-semibold text-success">€ 52 480</p>
            <p className="text-xs text-muted-foreground">+18% vs mois dernier</p>
          </Card>
        </div>

        <Card className="border-border/60 divide-y divide-border/60">
          {arrears.map((a) => (
            <div key={a.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 hover:bg-muted/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{a.locataire}</p>
                  <Badge variant="outline" className={`${riskStyle[a.risque]} text-[10px] font-medium`}>{a.risque}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{a.immeuble} · Étape : <span className="text-foreground">{a.etape}</span></p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:gap-6">
                <div className="text-right">
                  <p className="font-display font-semibold text-destructive">{a.montant}</p>
                  <p className="text-xs text-muted-foreground">retard {a.retard}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-success/10 hover:text-success"><MessageCircle className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-accent/10 hover:text-accent"><Phone className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Mail className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
