import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  Eye,
  Pencil,
  Download,
  Trash,
  Wallet,
  Building2,
  CalendarRange,
  Crown,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Local mirrors of the ABAC types so the preview is self-contained
type ActionKey = "view" | "edit" | "export" | "delete";
type ModuleKey =
  | "dashboard"
  | "patrimoine"
  | "locataires"
  | "baux"
  | "finances"
  | "impayes"
  | "inbox"
  | "carte"
  | "configuration";

type ModulePerm = { actions: ActionKey[]; amountCap?: number | null };

export type PreviewAdmin = {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "sub_admin";
  status: "active" | "invited" | "suspended";
  scopeBuildings: "all" | string[] | { except: string[] };
  periodStart?: string;
  periodEnd?: string;
  perms: Partial<Record<ModuleKey, ModulePerm>>;
};

const MODULE_LABELS: Record<ModuleKey, string> = {
  dashboard: "Tableau de bord",
  patrimoine: "Patrimoine",
  locataires: "Locataires",
  baux: "Baux & Contrats",
  finances: "Finances",
  impayes: "Impayés",
  inbox: "Boîte unifiée",
  carte: "Cartographie",
  configuration: "Configuration",
};

const ALL_MODULES: ModuleKey[] = [
  "dashboard",
  "patrimoine",
  "locataires",
  "baux",
  "finances",
  "impayes",
  "inbox",
  "carte",
  "configuration",
];

const ACTION_META: Record<ActionKey, { label: string; icon: any; className: string }> = {
  view: { label: "Lire", icon: Eye, className: "bg-sky-500/10 text-sky-500 border-sky-500/20" },
  edit: { label: "Écrire", icon: Pencil, className: "bg-violet-500/10 text-violet-500 border-violet-500/20" },
  export: { label: "Exporter", icon: Download, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  delete: { label: "Supprimer", icon: Trash, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const FINANCIAL_MODULES: ModuleKey[] = ["finances", "impayes"];

function fmtAmount(v?: number | null) {
  if (v == null) return "Aucun plafond";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
}

function scopeSummary(a: PreviewAdmin, totalBuildings: number) {
  if (a.role === "super_admin" || a.scopeBuildings === "all") return "Tout le patrimoine";
  if (Array.isArray(a.scopeBuildings)) {
    if (a.scopeBuildings.length === 0) return "Aucun immeuble";
    return `${a.scopeBuildings.length} immeuble${a.scopeBuildings.length > 1 ? "s" : ""} ciblé${a.scopeBuildings.length > 1 ? "s" : ""}`;
  }
  const excluded = a.scopeBuildings.except.length;
  return `Tous sauf ${excluded} (${Math.max(0, totalBuildings - excluded)} actifs)`;
}

export function AdminPreviewDialog({
  admin,
  totalBuildings,
  onClose,
  onEdit,
}: {
  admin: PreviewAdmin | null;
  totalBuildings: number;
  onClose: () => void;
  onEdit?: (a: PreviewAdmin) => void;
}) {
  if (!admin) return null;

  const isSuper = admin.role === "super_admin";

  // Derive effective modules from perms (only those with at least one action), super_admin = all modules
  const effectiveEntries: { key: ModuleKey; actions: ActionKey[]; amountCap?: number | null }[] = isSuper
    ? ALL_MODULES.map((k) => ({ key: k, actions: ["view", "edit", "export", "delete"], amountCap: null }))
    : ALL_MODULES.map((k) => {
        const p = admin.perms[k];
        if (!p || p.actions.length === 0) return null;
        return { key: k, actions: p.actions, amountCap: p.amountCap };
      }).filter(Boolean) as any;

  const totalActions = effectiveEntries.reduce((acc, e) => acc + e.actions.length, 0);
  const inactiveModules = ALL_MODULES.filter((k) => !effectiveEntries.find((e) => e.key === k));

  return (
    <Dialog open={!!admin} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Aperçu des permissions
          </DialogTitle>
          <DialogDescription>
            Dérivation effective des modules, actions et plafonds appliqués à ce compte.
          </DialogDescription>
        </DialogHeader>

        {/* Identity card */}
        <Card className="p-4 border-border/60">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-border">
              <AvatarFallback className="bg-gradient-accent text-accent-foreground text-xs font-semibold">
                {admin.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{admin.name}</p>
                {isSuper ? (
                  <Badge className="bg-gradient-primary text-primary-foreground border-0">
                    <Crown className="mr-1 h-3 w-3" /> Super Admin
                  </Badge>
                ) : (
                  <Badge variant="outline">Sous-admin</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{admin.email}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {scopeSummary(admin, totalBuildings)}
                </span>
                {(admin.periodStart || admin.periodEnd) && (
                  <span className="inline-flex items-center gap-1">
                    <CalendarRange className="h-3 w-3" />
                    {admin.periodStart || "—"} → {admin.periodEnd || "—"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-border/60 p-2 text-center">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Modules actifs</div>
              <div className="mt-1 font-display text-xl font-semibold">{effectiveEntries.length}</div>
            </div>
            <div className="rounded-lg border border-border/60 p-2 text-center">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Actions totales</div>
              <div className="mt-1 font-display text-xl font-semibold">{totalActions}</div>
            </div>
            <div className="rounded-lg border border-border/60 p-2 text-center">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Modules inactifs</div>
              <div className="mt-1 font-display text-xl font-semibold">{inactiveModules.length}</div>
            </div>
          </div>
        </Card>

        {/* Derived modules list */}
        <ScrollArea className="max-h-[420px] pr-3 -mr-3">
          <div className="space-y-2">
            {effectiveEntries.length === 0 && (
              <Card className="p-8 text-center text-sm text-muted-foreground border-dashed">
                Aucun module accordé. Ce compte n'a actuellement accès à rien.
              </Card>
            )}

            {effectiveEntries.map((entry) => {
              const isFinancial = FINANCIAL_MODULES.includes(entry.key);
              return (
                <Card key={entry.key} className="p-3 border-border/60">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{MODULE_LABELS[entry.key]}</p>
                      <p className="text-xs text-muted-foreground font-mono">{entry.key}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {entry.actions.map((act) => {
                        const meta = ACTION_META[act];
                        const Icon = meta.icon;
                        return (
                          <Badge key={act} variant="outline" className={cn("gap-1", meta.className)}>
                            <Icon className="h-3 w-3" />
                            {meta.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  {isFinancial && (
                    <>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Wallet className="h-3.5 w-3.5" />
                          Plafond d'engagement (amountCap)
                        </span>
                        <span
                          className={cn(
                            "font-mono font-medium",
                            entry.amountCap == null ? "text-muted-foreground" : "text-foreground",
                          )}
                        >
                          {fmtAmount(entry.amountCap)}
                        </span>
                      </div>
                    </>
                  )}
                </Card>
              );
            })}

            {inactiveModules.length > 0 && (
              <Card className="p-3 border-dashed border-border/60">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Ban className="h-3.5 w-3.5" />
                  Modules sans accès
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {inactiveModules.map((m) => (
                    <Badge key={m} variant="outline" className="text-muted-foreground">
                      {MODULE_LABELS[m]}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          {onEdit && !isSuper && (
            <Button
              onClick={() => onEdit(admin)}
              className="bg-gradient-primary text-primary-foreground"
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Modifier les permissions
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
