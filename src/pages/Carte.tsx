import { useState } from "react";
import { MapPin, Layers, Maximize2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mapPins } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function Carte() {
  const [active, setActive] = useState(mapPins[0].id);
  const current = mapPins.find((p) => p.id === active)!;

  return (
    <div>
      <PageHeader
        eyebrow="Géo-intelligence"
        title="Cartographie du portefeuille"
        description="Visualisez tous vos actifs sur carte. Filtrez par occupation, rendement, zone."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><Layers className="h-4 w-4" /> Heatmap</Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><Maximize2 className="h-4 w-4" /> Plein écran</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 p-4 md:p-8">
        <Card className="relative overflow-hidden border-border/60 h-[560px] bg-gradient-to-br from-secondary via-secondary to-muted">
          {/* Faux-map grid background */}
          <svg className="absolute inset-0 h-full w-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid-lg" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M 200 0 L 0 0 0 200" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#grid-lg)" />
            {/* Simulated streets */}
            <path d="M 0 280 Q 200 240 400 300 T 800 280" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
            <path d="M 320 0 Q 360 200 300 400 T 380 700" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
            <path d="M 0 100 L 800 140" stroke="hsl(var(--border))" strokeWidth="1.5" fill="none" />
          </svg>

          {/* River */}
          <div className="absolute inset-x-0 top-1/2 h-12 bg-accent/15 -translate-y-1/2 -rotate-3" />

          {/* Pins */}
          {mapPins.map((p) => {
            const isActive = p.id === active;
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-full transition-all",
                  isActive && "z-20 scale-110",
                )}
                style={{ left: `${p.x * 1.4}%`, top: `${p.y * 1.4}%` }}
              >
                <div className={cn(
                  "relative flex flex-col items-center",
                )}>
                  <div className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-lg whitespace-nowrap mb-1",
                    isActive ? "bg-gradient-primary text-primary-foreground" : "bg-card text-foreground border border-border",
                  )}>
                    {p.nom}
                  </div>
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full shadow-lg ring-4 transition-all",
                    isActive ? "bg-accent text-accent-foreground ring-accent/30" : "bg-primary text-primary-foreground ring-primary/20",
                  )}>
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
              </button>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 rounded-lg bg-card/90 backdrop-blur-md border border-border/60 px-3 py-2 shadow-soft">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Légende</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-accent" /> Sélectionné</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Immeuble</span>
            </div>
          </div>
        </Card>

        {/* Detail panel */}
        <div className="space-y-3">
          <Card className="p-5 border-border/60">
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 mb-2">Sélectionné</Badge>
            <h3 className="font-display text-xl font-semibold">{current.nom}</h3>
            <p className="text-sm text-muted-foreground mt-1">Paris · Île-de-France</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Occupation</p>
                <p className="font-display text-xl font-semibold">{current.occ}%</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Score zone</p>
                <p className="font-display text-xl font-semibold text-success">A+</p>
              </div>
            </div>

            <Button className="mt-4 w-full bg-gradient-primary text-primary-foreground">Voir la fiche complète</Button>
          </Card>

          <Card className="p-5 border-border/60">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Tous les actifs</p>
            <div className="space-y-1.5">
              {mapPins.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm transition-colors",
                    p.id === active ? "bg-accent/10 text-accent font-medium" : "hover:bg-muted/50",
                  )}
                >
                  <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {p.nom}</span>
                  <span className="text-xs text-muted-foreground">{p.occ}%</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
