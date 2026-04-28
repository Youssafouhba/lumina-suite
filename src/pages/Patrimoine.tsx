import { useState, useCallback } from "react";
import {
  Building2, MapPin, Plus, LayoutGrid, List, Map, Search, X,
  ShieldCheck, ArrowUpRight, ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildingsRich, type BuildingRich, type Local, type LocalStatus, type LocalType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────────────

const LOCAL_TYPES: { id: LocalType; label: string; color: string }[] = [
  { id: "bureau",   label: "Bureau",       color: "hsl(222 60% 15%)" },
  { id: "opensp",   label: "Open space",   color: "hsl(210 55% 45%)" },
  { id: "commerce", label: "Commerce",     color: "hsl(152 60% 38%)" },
  { id: "entrepot", label: "Entrepôt",     color: "hsl(38 92% 45%)"  },
  { id: "parking",  label: "Parking",      color: "hsl(220 12% 52%)" },
  { id: "salle",    label: "Salle réunion",color: "hsl(0 72% 45%)"   },
  { id: "cowork",   label: "Coworking",    color: "hsl(195 70% 40%)" },
];

const STATUS_CONFIG: Record<LocalStatus, { label: string; dot: string; bg: string; text: string }> = {
  libre:   { label: "Libre",   dot: "bg-success",     bg: "bg-success/10",     text: "text-success"           },
  occupé:  { label: "Occupé",  dot: "bg-accent",      bg: "bg-accent/10",      text: "text-accent"            },
  travaux: { label: "Travaux", dot: "bg-warning",      bg: "bg-warning/10",     text: "text-warning"           },
  réservé: { label: "Réservé", dot: "bg-muted-foreground", bg: "bg-muted", text: "text-muted-foreground"  },
};

const STATUS_LIST: LocalStatus[] = ["libre", "occupé", "travaux", "réservé"];

const uid = () => Math.random().toString(36).slice(2, 9);
const fmtN = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
const floorLabel = (f: number) => f === 0 ? "RDC" : f < 0 ? `SS${Math.abs(f)}` : `Étage ${f}`;

// ─── StatusBadge ─────────────────────────────────────────────────

function StatusBadge({ status, small }: { status: LocalStatus; small?: boolean }) {
  const s = STATUS_CONFIG[status];
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-md font-mono font-semibold border",
      small ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-1",
      s.bg, s.text, "border-transparent",
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", s.dot)} />
      {s.label}
    </span>
  );
}

// ─── TypeBadge ───────────────────────────────────────────────────

function TypeBadge({ typeId }: { typeId: LocalType }) {
  const t = LOCAL_TYPES.find(x => x.id === typeId) ?? { label: typeId, color: "hsl(220 12% 52%)" };
  return (
    <span
      className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-md whitespace-nowrap"
      style={{ background: t.color + "22", color: t.color }}
    >
      {t.label}
    </span>
  );
}

// ─── Building stats helpers ───────────────────────────────────────

function bStats(b: BuildingRich) {
  const occ   = b.locals.filter(l => l.status === "occupé").length;
  const libre = b.locals.filter(l => l.status === "libre").length;
  const rate  = b.locals.length > 0 ? Math.round((occ / b.locals.length) * 100) : 0;
  const rev   = b.locals.filter(l => l.status === "occupé").reduce((s, l) => s + l.rent, 0);
  const surf  = b.locals.reduce((s, l) => s + l.surface, 0);
  return { occ, libre, rate, rev, surf };
}

// ─── BuildingCard (grid view) ─────────────────────────────────────

function BuildingCard({ b, onClick }: { b: BuildingRich; onClick: () => void }) {
  const { libre, rate, rev } = bStats(b);
  const rateColor = rate >= 90 ? "text-success" : rate >= 70 ? "text-warning" : "text-destructive";
  const rateBg    = rate >= 90 ? "bg-success/10" : rate >= 70 ? "bg-warning/10" : "bg-destructive/10";

  return (
    <Card
      className="group overflow-hidden border-border/60 cursor-pointer transition-all hover:shadow-elevated hover:-translate-y-0.5"
      onClick={onClick}
    >
      {/* Occupancy colour strip */}
      <div
        className="h-1"
        style={{
          background: `linear-gradient(90deg, hsl(var(--accent)) ${rate}%, hsl(var(--muted)) ${rate}%)`,
        }}
      />

      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={b.image}
          alt={b.nom}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <div className="absolute top-3 right-3">
          <span className={cn("font-mono text-[11px] font-bold px-2 py-0.5 rounded-md", rateBg, rateColor)}>
            {rate}%
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-display text-base font-semibold leading-tight">{b.nom}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-white/75">
            <MapPin className="h-3 w-3 flex-shrink-0" /> {b.adresse}
          </p>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Locaux</p>
            <p className="font-display font-semibold">{b.locals.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Libres</p>
            <p className={cn("font-display font-semibold", libre > 0 ? "text-success" : "text-muted-foreground")}>
              {libre}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Rev./mois</p>
            <p className="font-display font-semibold text-sm">{fmtN(rev)} €</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="text-muted-foreground">Occupation</span>
            <span className="font-medium">{rate}%</span>
          </div>
          <Progress value={rate} className="h-1.5" />
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> {b.subAdmin}</span>
          <span>{b.floors} étages · {b.year}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs gap-1.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          Voir les locaux <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── BuildingRow (list view) ──────────────────────────────────────

function BuildingRow({ b, onClick }: { b: BuildingRich; onClick: () => void }) {
  const { libre, rate, rev } = bStats(b);
  return (
    <div
      className="group grid grid-cols-12 items-center gap-4 px-5 py-3.5 rounded-xl cursor-pointer transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      <div className="col-span-5 flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-border/60">
          <img src={b.image} alt={b.nom} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold truncate text-foreground">{b.nom}</div>
          <div className="text-[11px] flex items-center gap-1 mt-0.5 text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" /> <span className="truncate">{b.adresse}</span>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <div className="font-mono text-[12px] font-semibold text-foreground">{b.locals.length} locaux</div>
        <div className={cn("font-mono text-[10px] mt-0.5", libre > 0 ? "text-success" : "text-muted-foreground")}>
          {libre} libres
        </div>
      </div>

      <div className="col-span-3">
        <div className="flex items-center gap-2">
          <Progress value={rate} className="h-1.5 flex-1" />
          <span className="font-mono text-[11px] font-bold w-9 text-right text-foreground">{rate}%</span>
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">{b.subAdmin}</div>
      </div>

      <div className="col-span-1 text-right">
        <div className="font-display text-[15px] font-medium text-foreground">{fmtN(rev)} <span className="text-xs font-normal text-muted-foreground">€</span></div>
        <div className="font-mono text-[10px] text-muted-foreground">/mois</div>
      </div>

      <div className="col-span-1 flex justify-end">
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

// ─── Paris SVG Map ────────────────────────────────────────────────

function ParisMap({ buildings, onSelect, selectedId }: {
  buildings: BuildingRich[];
  onSelect: (b: BuildingRich) => void;
  selectedId: string | null;
}) {
  const [hover, setHover] = useState<string | null>(null);

  const blocks = [
    // La Défense
    [3, 14, 16, 20], [3, 34, 14, 12],
    // 17e / Wagram
    [22, 10, 20, 22], [22, 32, 10, 10],
    // 8e / Élysées
    [30, 28, 16, 16],
    // 9e / Opéra
    [38, 22, 18, 18],
    // 18e / Montmartre
    [34, 4, 20, 16],
    // 10e
    [56, 18, 14, 18],
    // 1e-2e centre
    [42, 38, 14, 10],
    // 3e-4e
    [52, 32, 14, 12],
    // 5e / Latin Quarter
    [40, 48, 16, 16],
    // 6e / Luxembourg
    [28, 46, 16, 16],
    // 7e / Eiffel
    [16, 40, 16, 18],
    // 11e / Bastille
    [56, 40, 18, 18],
    // 12e
    [66, 46, 16, 14],
    // 13e
    [48, 62, 18, 8],
    // 14e / Montparnasse
    [30, 60, 18, 8],
    // 15e
    [14, 54, 16, 14],
  ];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-card">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Paris — Carte patrimoine
          </span>
        </div>
        <div className="flex items-center gap-4">
          {(Object.entries(STATUS_CONFIG) as [LocalStatus, typeof STATUS_CONFIG[LocalStatus]][]).map(([k, s]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className={cn("w-2 h-2 rounded-full", s.dot)} />
              <span className="font-mono text-[9px] text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 100 72" style={{ width: "100%", display: "block" }} xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect x="0" y="0" width="100" height="72" fill="hsl(var(--muted) / 0.3)" />

        {/* City blocks */}
        {blocks.map(([x, y, w, h], i) => (
          <rect
            key={i} x={x} y={y} width={w} height={h} rx="0.8"
            fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.2"
          />
        ))}

        {/* Seine river */}
        <path
          d="M 3 44 Q 12 42, 20 44 Q 30 46, 40 44 Q 50 42, 58 46 Q 68 50, 80 48 L 97 47"
          fill="hsl(var(--accent) / 0.15)" stroke="hsl(var(--accent) / 0.4)" strokeWidth="3"
        />
        <text x="50" y="46.5" textAnchor="middle" style={{ fontSize: 2, fill: "hsl(var(--accent))", fontFamily: "monospace", letterSpacing: "0.1em" }}>
          SEINE
        </text>

        {/* District labels */}
        {[
          [10, 24, "DÉFENSE"],
          [32, 20, "17e"],
          [38, 30, "9e"],
          [44, 17, "18e"],
          [62, 27, "10e"],
          [48, 44, "3e-4e"],
          [48, 57, "5e"],
          [36, 54, "6e"],
          [24, 50, "7e"],
          [65, 49, "11e"],
        ].map(([x, y, label]) => (
          <text
            key={label as string}
            x={x as number} y={y as number} textAnchor="middle"
            style={{ fontSize: 2.2, fill: "hsl(var(--muted-foreground))", fontFamily: "sans-serif", fontWeight: 600, letterSpacing: "0.05em" }}
          >
            {label}
          </text>
        ))}

        {/* Building pins */}
        {buildings.map(b => {
          const { libre, rate } = bStats(b);
          const isSelected = selectedId === b.id;
          const isHov = hover === b.id;
          const pinFill = isSelected
            ? "hsl(var(--foreground))"
            : isHov
            ? "hsl(var(--accent))"
            : "hsl(var(--card))";
          const pinStroke = libre > 0 ? "hsl(var(--success))" : "hsl(var(--accent))";
          const labelFill = isSelected || isHov ? "hsl(var(--card))" : "hsl(var(--accent))";

          return (
            <g
              key={b.id}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(b)}
              onMouseEnter={() => setHover(b.id)}
              onMouseLeave={() => setHover(null)}
            >
              {isSelected && (
                <circle cx={b.mapX} cy={b.mapY} r={5} fill="none" stroke="hsl(var(--accent))" strokeWidth="0.6" opacity="0.5" />
              )}
              <circle cx={b.mapX + 0.3} cy={b.mapY + 0.3} r={3.5} fill="hsl(var(--foreground))" opacity="0.12" />
              <circle
                cx={b.mapX} cy={b.mapY} r={3.5}
                fill={pinFill}
                stroke={isSelected ? "hsl(var(--foreground))" : pinStroke}
                strokeWidth={isSelected ? 0 : 0.8}
              />
              <text
                x={b.mapX} y={b.mapY + 0.8} textAnchor="middle"
                style={{ fontSize: 2.6, fontFamily: "sans-serif", fontWeight: 700, fill: labelFill }}
              >
                {b.nom[0]}
              </text>

              {(isHov || isSelected) && (
                <g>
                  <rect x={b.mapX - 12} y={b.mapY - 12} width="24" height="9" rx="1.2" fill="hsl(var(--foreground))" opacity="0.92" />
                  <text x={b.mapX} y={b.mapY - 6.5} textAnchor="middle"
                    style={{ fontSize: 2.1, fontFamily: "sans-serif", fontWeight: 600, fill: "hsl(var(--card))" }}>
                    {b.nom}
                  </text>
                  <text x={b.mapX} y={b.mapY - 3.8} textAnchor="middle"
                    style={{ fontSize: 1.8, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }}>
                    {rate}% occupé · {b.locals.length} locaux
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Building Detail (Sheet content) ─────────────────────────────

function BuildingDetail({
  building,
  onClose,
  onUpdateLocal,
  onAddLocal,
}: {
  building: BuildingRich;
  onClose: () => void;
  onUpdateLocal: (bId: string, lId: string, patch: Partial<Local>) => void;
  onAddLocal: (bId: string, local: Local) => void;
}) {
  const [tab, setTab]         = useState("locaux");
  const [search, setSearch]   = useState("");
  const [statusF, setStatusF] = useState("all");
  const [showAdd, setShowAdd] = useState(false);

  const { occ, libre, rate, rev } = bStats(building);

  const filtered = building.locals.filter(l => {
    const matchStatus = statusF === "all" || l.status === statusF;
    const q = search.toLowerCase();
    const matchSearch = !q || l.ref.toLowerCase().includes(q) || (l.tenant ?? "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start gap-4 px-6 py-5 border-b border-border/60">
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-border/60">
          <img src={building.image} alt={building.nom} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-xl font-semibold leading-tight text-foreground">{building.nom}</div>
          <div className="flex items-center gap-1 text-[12px] mt-0.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{building.adresse}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-colors hover:bg-muted text-muted-foreground"
        >
          <X className="h-4.5 w-4.5" size={18} />
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 divide-x divide-border/60 border-b border-border/60 bg-muted/30">
        {[
          { l: "Occupation", v: `${rate}%`,       s: `${occ}/${building.locals.length} locaux` },
          { l: "Revenus",    v: `${fmtN(rev)} €`,  s: "par mois" },
          { l: "Bâtiment",   v: `${building.floors} ét.`, s: `depuis ${building.year}` },
        ].map((s, i) => (
          <div key={i} className="px-4 py-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] mb-1 text-muted-foreground">{s.l}</div>
            <div className="font-display text-xl font-semibold text-foreground">{s.v}</div>
            <div className="font-mono text-[10px] mt-0.5 text-muted-foreground">{s.s}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="rounded-none border-b border-border/60 bg-transparent h-auto px-4 gap-1 justify-start shrink-0">
          <TabsTrigger value="locaux" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-accent font-mono text-[10.5px] uppercase tracking-[0.12em] px-3 py-2.5">
            Locaux ({building.locals.length})
          </TabsTrigger>
          <TabsTrigger value="infos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-accent font-mono text-[10.5px] uppercase tracking-[0.12em] px-3 py-2.5">
            Infos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="locaux" className="flex-1 flex flex-col min-h-0 mt-0">
          {/* Filters */}
          <div className="px-4 py-3 flex items-center gap-2 border-b border-border/60 shrink-0">
            <div className="flex items-center gap-2 flex-1 h-8 rounded-lg border border-border px-2.5 bg-background">
              <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Réf. ou locataire…"
                className="flex-1 bg-transparent outline-none text-[12px] text-foreground placeholder:text-muted-foreground/60"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <Select value={statusF} onValueChange={setStatusF}>
              <SelectTrigger className="h-8 w-[120px] text-[11px] font-mono">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                {STATUS_LIST.map(s => (
                  <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-[11px] bg-gradient-primary text-primary-foreground"
              onClick={() => setShowAdd(true)}
            >
              <Plus className="h-3.5 w-3.5" /> Local
            </Button>
          </div>

          {/* Locals list */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/40">
            {filtered.map(l => (
              <div
                key={l.id}
                className="group flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
              >
                <div className="font-mono text-[11px] font-bold w-12 text-center rounded-md py-1 bg-muted text-foreground flex-shrink-0">
                  {l.ref}
                </div>
                <TypeBadge typeId={l.type} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold truncate text-foreground">
                    {l.tenant ?? <span className="text-muted-foreground/50">—</span>}
                  </div>
                  <div className="font-mono text-[10.5px] mt-0.5 text-muted-foreground">
                    {floorLabel(l.floor)} · {l.surface} m²
                  </div>
                </div>
                <StatusBadge status={l.status} small />
                <div className="text-right min-w-[68px]">
                  <div className="font-display text-[14px] font-medium text-foreground">
                    {fmtN(l.rent)} <span className="text-[11px] font-normal text-muted-foreground">€</span>
                  </div>
                </div>
                {/* Quick status change */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Select
                    value={l.status}
                    onValueChange={v => onUpdateLocal(building.id, l.id, { status: v as LocalStatus })}
                  >
                    <SelectTrigger className="h-7 w-[90px] text-[10px] font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_LIST.map(s => (
                        <SelectItem key={s} value={s} className="text-[11px]">
                          {STATUS_CONFIG[s].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <Building2 className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30" />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Aucun local trouvé</p>
              </div>
            )}
          </div>

          {/* Summary footer */}
          <div className="px-4 py-2.5 border-t border-border/60 bg-muted/20 shrink-0 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{filtered.length} local{filtered.length > 1 ? "x" : ""}</span>
            <span className="text-success font-medium">{libre} libre{libre > 1 ? "s" : ""}</span>
          </div>
        </TabsContent>

        <TabsContent value="infos" className="mt-0 overflow-y-auto">
          <div className="p-5 space-y-0">
            {[
              ["Nom complet",            building.nom],
              ["Adresse",                building.adresse],
              ["Nombre d'étages",        `${building.floors} étages`],
              ["Année de construction",  `${building.year}`],
              ["Sous-administrateur",    building.subAdmin],
              ["Total locaux",           `${building.locals.length}`],
              ["Surface totale",         `${fmtN(bStats(building).surf)} m²`],
              ["Revenus mensuels",       `${fmtN(bStats(building).rev)} €`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between py-3 border-b border-border/40">
                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{k}</div>
                <div className="text-[13px] font-semibold text-foreground">{v}</div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add local dialog */}
      <AddLocalDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={l => { onAddLocal(building.id, l); setShowAdd(false); }}
      />
    </div>
  );
}

// ─── Add Building Dialog ──────────────────────────────────────────

function AddBuildingDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (b: BuildingRich) => void;
}) {
  const [form, setForm] = useState({ nom: "", adresse: "", floors: "", year: "", subAdmin: "" });
  const handle = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.nom || !form.adresse) return;
    onAdd({
      id: "b" + uid(),
      nom: form.nom,
      adresse: form.adresse,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
      floors: parseInt(form.floors) || 1,
      year: parseInt(form.year) || new Date().getFullYear(),
      subAdmin: form.subAdmin || "—",
      mapX: 40 + Math.random() * 20,
      mapY: 30 + Math.random() * 20,
      locals: [],
    });
    setForm({ nom: "", adresse: "", floors: "", year: "", subAdmin: "" });
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold">Ajouter un immeuble</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {[
            { key: "nom",      label: "Nom de l'immeuble",      ph: "Tour Haussmann…" },
            { key: "adresse",  label: "Adresse complète",        ph: "12 Bd Haussmann, 75009 Paris" },
            { key: "floors",   label: "Nombre d'étages",         ph: "8" },
            { key: "year",     label: "Année de construction",   ph: "2005" },
            { key: "subAdmin", label: "Sous-administrateur",     ph: "Camille M." },
          ].map(({ key, label, ph }) => (
            <div key={key} className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">{label}</Label>
              <Input
                value={form[key as keyof typeof form]}
                onChange={e => handle(key, e.target.value)}
                placeholder={ph}
                className="h-9 text-[13px]"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button className="bg-gradient-primary text-primary-foreground" onClick={submit}>
            Créer l'immeuble
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add Local Dialog ─────────────────────────────────────────────

function AddLocalDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (l: Local) => void;
}) {
  const [form, setForm] = useState({
    ref: "", type: "bureau" as LocalType, floor: "",
    surface: "", status: "libre" as LocalStatus, tenant: "", rent: "", charges: "",
  });
  const handle = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.ref) return;
    onAdd({
      id: "l" + uid(),
      ref: form.ref,
      type: form.type,
      floor: parseInt(form.floor) || 0,
      surface: parseInt(form.surface) || 0,
      status: form.status,
      tenant: form.tenant || null,
      rent: parseInt(form.rent) || 0,
      charges: parseInt(form.charges) || 0,
    });
    setForm({ ref: "", type: "bureau", floor: "", surface: "", status: "libre", tenant: "", rent: "", charges: "" });
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold">Ajouter un local</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Référence</Label>
              <Input value={form.ref} onChange={e => handle("ref", e.target.value)} placeholder="1.01" className="h-9 text-[13px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Étage</Label>
              <Input value={form.floor} onChange={e => handle("floor", e.target.value)} placeholder="1" type="number" className="h-9 text-[13px]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Type</Label>
              <Select value={form.type} onValueChange={v => handle("type", v)}>
                <SelectTrigger className="h-9 text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LOCAL_TYPES.map(t => <SelectItem key={t.id} value={t.id} className="text-[12px]">{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Statut</Label>
              <Select value={form.status} onValueChange={v => handle("status", v)}>
                <SelectTrigger className="h-9 text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_LIST.map(s => <SelectItem key={s} value={s} className="text-[12px]">{STATUS_CONFIG[s].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Surface (m²)</Label>
              <Input value={form.surface} onChange={e => handle("surface", e.target.value)} placeholder="80" type="number" className="h-9 text-[13px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Loyer (€)</Label>
              <Input value={form.rent} onChange={e => handle("rent", e.target.value)} placeholder="5000" type="number" className="h-9 text-[13px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Charges (€)</Label>
              <Input value={form.charges} onChange={e => handle("charges", e.target.value)} placeholder="750" type="number" className="h-9 text-[13px]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Locataire</Label>
            <Input value={form.tenant} onChange={e => handle("tenant", e.target.value)} placeholder="Nom du locataire…" className="h-9 text-[13px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button className="bg-gradient-primary text-primary-foreground" onClick={submit}>
            Créer le local
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── KPI Bar ──────────────────────────────────────────────────────

function KpiBar({ buildings }: { buildings: BuildingRich[] }) {
  const totalLots  = buildings.reduce((s, b) => s + b.locals.length, 0);
  const totalOcc   = buildings.reduce((s, b) => s + b.locals.filter(l => l.status === "occupé").length, 0);
  const totalLibre = buildings.reduce((s, b) => s + b.locals.filter(l => l.status === "libre").length, 0);
  const totalRev   = buildings.reduce((s, b) => s + b.locals.filter(l => l.status === "occupé").reduce((r, l) => r + l.rent, 0), 0);
  const rate       = totalLots > 0 ? Math.round((totalOcc / totalLots) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 py-4 md:px-8 border-b border-border/60 bg-card/40">
      {[
        { label: "Immeubles",      value: buildings.length.toString(),    sub: "actifs gérés"        },
        { label: "Lots totaux",    value: totalLots.toString(),           sub: `${totalLibre} libres` },
        { label: "Taux d'occupation", value: `${rate}%`,                 sub: `${totalOcc} occupés`  },
        { label: "Revenus /mois",  value: `${fmtN(totalRev)} €`,         sub: "loyers encaissés"     },
      ].map((k, i) => (
        <div key={i} className="flex items-baseline gap-3">
          <div>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">{k.label}</p>
            <p className="font-display text-2xl font-semibold text-foreground mt-0.5">{k.value}</p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{k.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────

type ViewMode = "grid" | "list" | "map";

export default function Patrimoine() {
  const [buildings, setBuildings] = useState<BuildingRich[]>(buildingsRich);
  const [view, setView]           = useState<ViewMode>("grid");
  const [search, setSearch]       = useState("");
  const [statusF, setStatusF]     = useState("all");
  const [selected, setSelected]   = useState<BuildingRich | null>(null);
  const [showAdd, setShowAdd]     = useState(false);

  const filtered = buildings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.nom.toLowerCase().includes(q) || b.adresse.toLowerCase().includes(q);
    const { rate } = bStats(b);
    const matchStatus =
      statusF === "all" ||
      (statusF === "libre"   && b.locals.some(l => l.status === "libre"))   ||
      (statusF === "complet" && rate === 100)                                ||
      (statusF === "travaux" && b.locals.some(l => l.status === "travaux"));
    return matchSearch && matchStatus;
  });

  const updateLocal = useCallback((bId: string, lId: string, patch: Partial<Local>) => {
    setBuildings(prev =>
      prev.map(b =>
        b.id !== bId ? b : { ...b, locals: b.locals.map(l => l.id !== lId ? l : { ...l, ...patch }) }
      )
    );
    setSelected(prev => prev?.id !== bId ? prev : {
      ...prev,
      locals: prev.locals.map(l => l.id !== lId ? l : { ...l, ...patch }),
    });
  }, []);

  const addLocal = useCallback((bId: string, local: Local) => {
    setBuildings(prev =>
      prev.map(b => b.id !== bId ? b : { ...b, locals: [...b.locals, local] })
    );
    setSelected(prev => prev?.id !== bId ? prev : { ...prev, locals: [...prev.locals, local] });
  }, []);

  const addBuilding = useCallback((b: BuildingRich) => {
    setBuildings(prev => [...prev, b]);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        eyebrow="Patrimoine"
        title={`${buildings.length} immeubles · ${buildings.reduce((s, b) => s + b.locals.length, 0)} lots gérés`}
        description="Visualisez et pilotez vos actifs immobiliers : bureaux, locaux commerciaux, coworking."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={() => setShowAdd(true)}>
              <Plus className="h-4 w-4" /> Nouvel immeuble
            </Button>
          </>
        }
      />

      {/* KPI bar */}
      <KpiBar buildings={buildings} />

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 md:px-8 border-b border-border/60 bg-background sticky top-16 z-10">
        <div className="flex items-center gap-2 flex-1 max-w-xs h-9 rounded-lg border border-border/60 px-3 bg-card">
          <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un immeuble…"
            className="flex-1 bg-transparent outline-none text-[13px] text-foreground placeholder:text-muted-foreground/60"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Select value={statusF} onValueChange={setStatusF}>
          <SelectTrigger className="h-9 w-[140px] text-[12px]">
            <SelectValue placeholder="Filtrer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="libre">Avec locaux libres</SelectItem>
            <SelectItem value="complet">Complets</SelectItem>
            <SelectItem value="travaux">En travaux</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-1 rounded-lg border border-border/60 p-0.5 bg-card">
          {([
            { mode: "grid" as ViewMode, Icon: LayoutGrid, label: "Grille" },
            { mode: "list" as ViewMode, Icon: List,       label: "Liste"  },
            { mode: "map"  as ViewMode, Icon: Map,        label: "Carte"  },
          ]).map(({ mode, Icon, label }) => (
            <button
              key={mode}
              onClick={() => setView(mode)}
              title={label}
              className={cn(
                "h-7 w-7 rounded-md grid place-items-center transition-colors",
                view === mode ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        <Badge variant="secondary" className="font-mono text-[10px]">
          {filtered.length} immeuble{filtered.length > 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 pb-20">
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(b => (
              <BuildingCard key={b.id} b={b} onClick={() => setSelected(b)} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-mono text-[11px] uppercase tracking-[0.2em]">Aucun immeuble trouvé</p>
              </div>
            )}
          </div>
        )}

        {view === "list" && (
          <Card className="border-border/60 overflow-hidden">
            <div className="grid grid-cols-12 items-center gap-4 px-5 py-2.5 border-b border-border/60 bg-muted/30">
              {[
                { cls: "col-span-5",  label: "Immeuble"    },
                { cls: "col-span-2",  label: "Locaux"      },
                { cls: "col-span-3",  label: "Occupation"  },
                { cls: "col-span-1 text-right", label: "Revenus" },
                { cls: "col-span-1",  label: ""            },
              ].map((h, i) => (
                <div key={i} className={cn("font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground", h.cls)}>
                  {h.label}
                </div>
              ))}
            </div>
            <div className="divide-y divide-border/40">
              {filtered.map(b => (
                <BuildingRow key={b.id} b={b} onClick={() => setSelected(b)} />
              ))}
              {filtered.length === 0 && (
                <div className="py-16 text-center text-muted-foreground">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Aucun immeuble trouvé</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {view === "map" && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
            <ParisMap buildings={filtered} onSelect={setSelected} selectedId={selected?.id ?? null} />

            {/* Side panel: list for map view */}
            <div className="space-y-2">
              {filtered.map(b => {
                const { rate, rev, libre } = bStats(b);
                const isSelected = selected?.id === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelected(b)}
                    className={cn(
                      "w-full text-left rounded-xl border p-3.5 transition-all",
                      isSelected
                        ? "border-accent bg-accent/5 shadow-glow"
                        : "border-border/60 bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-display text-[13px] font-semibold text-foreground">{b.nom}</span>
                      <span className={cn(
                        "font-mono text-[10px] font-bold px-1.5 py-0.5 rounded",
                        rate >= 90 ? "bg-success/10 text-success" : rate >= 70 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive",
                      )}>{rate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{b.locals.length} locaux · {libre > 0 ? <span className="text-success">{libre} libre{libre > 1 ? "s" : ""}</span> : "complet"}</span>
                      <span>{fmtN(rev)} €/m</span>
                    </div>
                    <Progress value={rate} className="h-1 mt-2" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Building detail sheet */}
      <Sheet open={!!selected} onOpenChange={v => !v && setSelected(null)}>
        <SheetContent side="right" className="w-[520px] sm:max-w-none p-0 flex flex-col overflow-hidden">
          {selected && (
            <BuildingDetail
              building={selected}
              onClose={() => setSelected(null)}
              onUpdateLocal={updateLocal}
              onAddLocal={addLocal}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Add building dialog */}
      <AddBuildingDialog open={showAdd} onClose={() => setShowAdd(false)} onAdd={addBuilding} />
    </div>
  );
}
