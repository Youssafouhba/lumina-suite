import { FileText, Download, Plus, Calendar } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { leases } from "@/lib/mock-data";

const statusStyle: Record<string, string> = {
  Actif: "bg-success/10 text-success border-success/20",
  Préavis: "bg-warning/10 text-warning border-warning/30",
  Contentieux: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Baux() {
  return (
    <div>
      <PageHeader
        eyebrow="Contractuel"
        title="Baux & contrats"
        description="Génération dynamique, e-signature, révision automatique selon ICC/ILC/ILAT."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><Calendar className="h-4 w-4" /> Échéances</Button>
            <Button size="sm" className="h-9 gap-1.5 bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" /> Nouveau bail</Button>
          </>
        }
      />

      <div className="p-4 md:p-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Baux actifs", value: "124", hint: "+3 ce mois" },
            { label: "Révisions à venir", value: "18", hint: "30 prochains jours" },
            { label: "Préavis en cours", value: "4", hint: "À traiter" },
          ].map((s) => (
            <Card key={s.label} className="p-4 border-border/60">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-display text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.hint}</p>
            </Card>
          ))}
        </div>

        <Card className="border-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider">Référence</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Locataire</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider hidden md:table-cell">Local</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Type</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider hidden lg:table-cell">Période</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Loyer</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Statut</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leases.map((l) => (
                  <TableRow key={l.id} className="border-border/60">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-xs">{l.ref}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{l.locataire}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{l.local}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{l.type}</Badge></TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{l.debut} → {l.fin}</TableCell>
                    <TableCell className="font-display font-medium text-sm">{l.loyer}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${statusStyle[l.statut]} font-medium`}>{l.statut}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
