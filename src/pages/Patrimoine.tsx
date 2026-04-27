import { Building2, MapPin, Plus, Filter, LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { buildings } from "@/lib/mock-data";

export default function Patrimoine() {
  return (
    <div>
      <PageHeader
        eyebrow="Patrimoine"
        title="6 immeubles · 198 lots gérés"
        description="Visualisez et pilotez vos actifs immobiliers : bureaux, locaux commerciaux, coworking."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><Filter className="h-4 w-4" /> Filtrer</Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><LayoutGrid className="h-4 w-4" /> Vue</Button>
            <Button size="sm" className="h-9 gap-1.5 bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" /> Nouvel immeuble</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:p-8 xl:grid-cols-3">
        {buildings.map((b) => {
          const occ = Math.round((b.occupes / b.lots) * 100);
          return (
            <Card key={b.id} className="group overflow-hidden border-border/60 transition-all hover:shadow-elevated hover:-translate-y-0.5">
              <div className="relative h-40 overflow-hidden">
                <img src={b.image} alt={b.nom} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-background/90 text-foreground backdrop-blur border-0 shadow-sm">
                    {occ}% occupé
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-primary-foreground">
                  <h3 className="font-display text-lg font-semibold leading-tight">{b.nom}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-primary-foreground/80">
                    <MapPin className="h-3 w-3" /> {b.adresse}
                  </p>
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Lots</p>
                    <p className="font-display font-semibold">{b.lots}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Surface</p>
                    <p className="font-display font-semibold text-sm">{b.surface}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenus</p>
                    <p className="font-display font-semibold text-sm">{b.revenus.split(" / ")[0]}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="text-muted-foreground">Occupation</span>
                    <span className="font-medium">{b.occupes}/{b.lots} lots</span>
                  </div>
                  <Progress value={occ} className="h-1.5" />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">Détails</Button>
                  <Button size="sm" className="flex-1 h-8 text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <Building2 className="h-3.5 w-3.5 mr-1" /> Lots
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
