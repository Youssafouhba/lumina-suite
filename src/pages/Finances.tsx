import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { ArrowDownLeft, ArrowUpRight, Download } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { revenueSeries } from "@/lib/mock-data";

const transactions = [
  { id: "tr1", libelle: "Loyer · Atelier Verneuil SAS", date: "01/09", montant: "+ € 8 420", type: "in" as const, compte: "BNP Paribas · Pro" },
  { id: "tr2", libelle: "Charges copropriété · Tour Haussmann", date: "30/08", montant: "- € 4 280", type: "out" as const, compte: "BNP Paribas · Pro" },
  { id: "tr3", libelle: "Loyer · Nordica Conseil", date: "28/08", montant: "+ € 14 800", type: "in" as const, compte: "Société Générale" },
  { id: "tr4", libelle: "Travaux ravalement · Atrium", date: "27/08", montant: "- € 18 600", type: "out" as const, compte: "BNP Paribas · Pro" },
  { id: "tr5", libelle: "Loyer · Mercure Notaires", date: "26/08", montant: "+ € 11 600", type: "in" as const, compte: "Crédit Mutuel" },
  { id: "tr6", libelle: "Honoraires gestion", date: "25/08", montant: "- € 2 950", type: "out" as const, compte: "BNP Paribas · Pro" },
];

export default function Finances() {
  return (
    <div>
      <PageHeader
        eyebrow="Comptabilité"
        title="Finances & flux"
        description="Synchronisation bancaire, rapprochement automatique, export FEC, déclarations TVA."
        actions={
          <Button variant="outline" size="sm" className="h-9 gap-1.5"><Download className="h-4 w-4" /> Export FEC</Button>
        }
      />

      <div className="p-4 md:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Encaissé (mois)", value: "€ 487 250", color: "text-success" },
            { label: "Décaissé (mois)", value: "€ 195 480", color: "text-destructive" },
            { label: "Solde net", value: "€ 291 770", color: "text-foreground" },
          ].map((s) => (
            <Card key={s.label} className="p-5 border-border/60">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className={`mt-1 font-display text-3xl font-semibold ${s.color}`}>{s.value}</p>
            </Card>
          ))}
        </div>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-lg">Encaissements vs décaissements</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", fontSize: "12px" }} cursor={{ fill: "hsl(var(--muted) / 0.4)" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="revenus" name="Encaissements" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="charges" name="Décaissements" fill="hsl(var(--muted-foreground) / 0.5)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-lg">Dernières opérations</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/60 pt-0">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.type === "in" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {t.type === "in" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.libelle}</p>
                    <p className="text-xs text-muted-foreground">{t.date} · {t.compte}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`font-display font-semibold text-sm ${t.type === "in" ? "text-success" : "text-destructive"}`}>{t.montant}</span>
                  <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">Rapproché</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
