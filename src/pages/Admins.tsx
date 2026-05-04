import { useMemo, useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Crown,
  Lock,
  Building2,
  Wallet,
  AlertTriangle,
  Inbox as InboxIcon,
  Users as UsersIcon,
  FileText,
  Map as MapIcon,
  Settings as SettingsIcon,
  LayoutDashboard,
  Eye,
  Pencil as PencilIcon,
  Download,
  Trash,
  Upload,
  Eye as EyeIcon,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { AdminsImportDialog, type ImportRow } from "@/components/admins-import-dialog";
import { AdminPreviewDialog } from "@/components/admin-preview-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildings } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ---------- ABAC primitives ----------

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

type ActionKey = "view" | "edit" | "export" | "delete";

const MODULES: { key: ModuleKey; label: string; icon: any }[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "patrimoine", label: "Patrimoine", icon: Building2 },
  { key: "locataires", label: "Locataires", icon: UsersIcon },
  { key: "baux", label: "Baux & Contrats", icon: FileText },
  { key: "finances", label: "Finances", icon: Wallet },
  { key: "impayes", label: "Impayés", icon: AlertTriangle },
  { key: "inbox", label: "Boîte unifiée", icon: InboxIcon },
  { key: "carte", label: "Cartographie", icon: MapIcon },
  { key: "configuration", label: "Configuration", icon: SettingsIcon },
];

const ACTIONS: { key: ActionKey; label: string; icon: any }[] = [
  { key: "view", label: "Lire", icon: Eye },
  { key: "edit", label: "Écrire", icon: PencilIcon },
  { key: "export", label: "Exporter", icon: Download },
  { key: "delete", label: "Supprimer", icon: Trash },
];

type ModulePerm = { actions: ActionKey[]; amountCap?: number | null };

type SubAdmin = {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "sub_admin";
  status: "active" | "invited" | "suspended";
  lastActive: string;
  // "all": full access · string[]: include list · { except: string[] }: all except listed
  scopeBuildings: "all" | string[] | { except: string[] };
  periodStart?: string; // ISO date
  periodEnd?: string;
  perms: Partial<Record<ModuleKey, ModulePerm>>;
};

const SEED: SubAdmin[] = [
  {
    id: "u1",
    name: "Camille Moreau",
    email: "camille.moreau@estala.fr",
    role: "super_admin",
    status: "active",
    lastActive: "à l'instant",
    scopeBuildings: "all",
    perms: Object.fromEntries(
      MODULES.map((m) => [m.key, { actions: ["view", "edit", "export", "delete"], amountCap: null }]),
    ) as SubAdmin["perms"],
  },
  {
    id: "u2",
    name: "Léa Fontaine",
    email: "lea.fontaine@estala.fr",
    role: "sub_admin",
    status: "active",
    lastActive: "il y a 12 min",
    scopeBuildings: ["b1", "b3"],
    periodStart: "2026-01-01",
    periodEnd: "2026-12-31",
    perms: {
      dashboard: { actions: ["view"] },
      finances: { actions: ["view", "export"], amountCap: 50000 },
      impayes: { actions: ["view", "edit"], amountCap: 10000 },
      locataires: { actions: ["view", "edit"] },
      inbox: { actions: ["view", "edit"] },
    },
  },
  {
    id: "u3",
    name: "Yanis Bertrand",
    email: "yanis.bertrand@estala.fr",
    role: "sub_admin",
    status: "active",
    lastActive: "il y a 2 h",
    scopeBuildings: ["b2"],
    perms: {
      patrimoine: { actions: ["view", "edit"] },
      baux: { actions: ["view", "edit", "export"] },
      locataires: { actions: ["view"] },
    },
  },
  {
    id: "u4",
    name: "Inès Tahiri",
    email: "ines.tahiri@estala.fr",
    role: "sub_admin",
    status: "invited",
    lastActive: "—",
    scopeBuildings: [],
    perms: {},
  },
];

// ---------- helpers ----------

type ScopeMode = "all" | "include" | "exclude";

function scopeMode(scope: SubAdmin["scopeBuildings"]): ScopeMode {
  if (scope === "all") return "all";
  if (Array.isArray(scope)) return "include";
  return "exclude";
}

function scopeIncludesBuilding(scope: SubAdmin["scopeBuildings"], id: string, totalIds: string[]) {
  if (scope === "all") return true;
  if (Array.isArray(scope)) return scope.includes(id);
  return !scope.except.includes(id);
}

function effectiveBuildingCount(scope: SubAdmin["scopeBuildings"], total: number) {
  if (scope === "all") return total;
  if (Array.isArray(scope)) return scope.length;
  return Math.max(0, total - scope.except.length);
}

function countActions(a: SubAdmin) {
  if (a.role === "super_admin") return "Tous droits";
  const total = Object.values(a.perms).reduce((acc, p) => acc + (p?.actions.length || 0), 0);
  return `${total} action${total > 1 ? "s" : ""}`;
}

function scopeLabel(a: SubAdmin, totalBuildings: number) {
  if (a.role === "super_admin" || a.scopeBuildings === "all") return "Tout le patrimoine";
  if (Array.isArray(a.scopeBuildings)) {
    if (a.scopeBuildings.length === 0) return "Aucun immeuble";
    return `${a.scopeBuildings.length} immeuble${a.scopeBuildings.length > 1 ? "s" : ""}`;
  }
  const excluded = a.scopeBuildings.except.length;
  const effective = Math.max(0, totalBuildings - excluded);
  return `Tous sauf ${excluded} (${effective} actifs)`;
}

const statusStyles: Record<SubAdmin["status"], string> = {
  active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  invited: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabel: Record<SubAdmin["status"], string> = {
  active: "Actif",
  invited: "Invité",
  suspended: "Suspendu",
};

// ---------- Page ----------

export default function Admins() {
  const [admins, setAdmins] = useState<SubAdmin[]>(SEED);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<SubAdmin | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [previewing, setPreviewing] = useState<SubAdmin | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return admins;
    return admins.filter((a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q));
  }, [admins, query]);

  const stats = useMemo(() => {
    return {
      total: admins.length,
      active: admins.filter((a) => a.status === "active").length,
      invited: admins.filter((a) => a.status === "invited").length,
      sub: admins.filter((a) => a.role === "sub_admin").length,
    };
  }, [admins]);

  const handleSave = (next: SubAdmin) => {
    setAdmins((prev) => prev.map((a) => (a.id === next.id ? next : a)));
    setEditing(null);
    toast.success(`Permissions de ${next.name} mises à jour`);
  };

  const handleInvite = (payload: { name: string; email: string }) => {
    const newAdmin: SubAdmin = {
      id: `u${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: "sub_admin",
      status: "invited",
      lastActive: "—",
      scopeBuildings: [],
      perms: {},
    };
    setAdmins((prev) => [...prev, newAdmin]);
    setInviteOpen(false);
    toast.success(`Invitation envoyée à ${payload.email}`);
  };

  const handleSuspend = (a: SubAdmin) => {
    setAdmins((prev) =>
      prev.map((x) =>
        x.id === a.id ? { ...x, status: x.status === "suspended" ? "active" : "suspended" } : x,
      ),
    );
    toast.success(a.status === "suspended" ? `${a.name} réactivé` : `${a.name} suspendu`);
  };

  const handleDelete = (a: SubAdmin) => {
    setAdmins((prev) => prev.filter((x) => x.id !== a.id));
    toast.success(`${a.name} supprimé`);
  };

  const handleImport = (rows: ImportRow[]) => {
    const buildingIds = new Set(buildings.map((b) => b.id));
    const parseScope = (s?: string): SubAdmin["scopeBuildings"] => {
      if (!s || s.trim() === "" || s.trim().toLowerCase() === "all") return "all";
      const trimmed = s.trim();
      if (trimmed.toLowerCase().startsWith("except:")) {
        const ids = trimmed
          .slice(7)
          .split(",")
          .map((x) => x.trim())
          .filter((x) => buildingIds.has(x));
        return { except: ids };
      }
      return trimmed
        .split(",")
        .map((x) => x.trim())
        .filter((x) => buildingIds.has(x));
    };
    const validActions: ActionKey[] = ["view", "edit", "export", "delete"];
    const validModules = new Set(MODULES.map((m) => m.key));
    const parsePerms = (s?: string): SubAdmin["perms"] => {
      if (!s || !s.trim()) return {};
      const out: SubAdmin["perms"] = {};
      s.split(";")
        .map((p) => p.trim())
        .filter(Boolean)
        .forEach((entry) => {
          const [modPart, ...rest] = entry.split(":");
          const mod = modPart?.trim() as ModuleKey;
          if (!validModules.has(mod)) return;
          const right = rest.join(":").trim();
          const [actionsStr, capStr] = right.split("@");
          const actions = (actionsStr || "")
            .split("+")
            .map((a) => a.trim())
            .filter((a) => validActions.includes(a as ActionKey)) as ActionKey[];
          const amountCap = capStr ? Number(capStr) : undefined;
          out[mod] = {
            actions,
            amountCap: Number.isFinite(amountCap) ? (amountCap as number) : undefined,
          };
        });
      return out;
    };

    const newAdmins: SubAdmin[] = rows.map((r, i) => ({
      id: `u${Date.now()}_${i}`,
      name: r.name,
      email: r.email,
      role: r.role === "super_admin" ? "super_admin" : "sub_admin",
      status: "invited",
      lastActive: "—",
      scopeBuildings: parseScope(r.scope),
      periodStart: r.periodStart || undefined,
      periodEnd: r.periodEnd || undefined,
      perms: parsePerms(r.modules),
    }));
    setAdmins((prev) => [...prev, ...newAdmins]);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gouvernance"
        title="Sous-administrateurs"
        description="Délégation ABAC : périmètres dynamiques par immeuble, période, action et plafond de montant."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Importer
            </Button>
            <Button onClick={() => setInviteOpen(true)} className="bg-gradient-primary text-primary-foreground shadow-soft">
              <UserPlus className="mr-2 h-4 w-4" />
              Inviter un sous-admin
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 px-4 md:grid-cols-4 md:px-8">
        {[
          { label: "Administrateurs", value: stats.total, icon: ShieldCheck },
          { label: "Actifs", value: stats.active, icon: Crown },
          { label: "Invitations en attente", value: stats.invited, icon: UserPlus },
          { label: "Sous-admins", value: stats.sub, icon: Lock },
        ].map((s) => (
          <Card key={s.label} className="p-4 border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 font-display text-2xl font-semibold">{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="px-4 pt-6 md:px-8">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom ou email…"
            className="h-10 pl-9"
          />
        </div>
      </div>

      {/* List */}
      <div className="grid gap-3 p-4 md:p-8">
        {filtered.map((a) => (
          <Card
            key={a.id}
            className="group border-border/60 p-4 transition-all hover:shadow-elevated hover:-translate-y-0.5 md:p-5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <Avatar className="h-11 w-11 ring-2 ring-border">
                  <AvatarFallback className="bg-gradient-accent text-accent-foreground text-xs font-semibold">
                    {a.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium truncate">{a.name}</p>
                    {a.role === "super_admin" ? (
                      <Badge className="bg-gradient-primary text-primary-foreground border-0">
                        <Crown className="mr-1 h-3 w-3" />
                        Super Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-border/80">
                        Sous-admin
                      </Badge>
                    )}
                    <Badge variant="outline" className={cn("text-[10px]", statusStyles[a.status])}>
                      {statusLabel[a.status]}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{a.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {scopeLabel(a, buildings.length)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      {countActions(a)}
                    </span>
                    <span>Dernière activité : {a.lastActive}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <Button variant="ghost" size="sm" onClick={() => setPreviewing(a)}>
                  <EyeIcon className="mr-2 h-3.5 w-3.5" />
                  Aperçu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(a)}
                  disabled={a.role === "super_admin"}
                >
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  Permissions
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setPreviewing(a)}>
                      <EyeIcon className="mr-2 h-4 w-4" /> Voir l'aperçu
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditing(a)} disabled={a.role === "super_admin"}>
                      <Pencil className="mr-2 h-4 w-4" /> Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSuspend(a)}
                      disabled={a.role === "super_admin"}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {a.status === "suspended" ? "Réactiver" : "Suspendre"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(a)}
                      disabled={a.role === "super_admin"}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card className="p-10 text-center text-muted-foreground border-dashed">
            Aucun administrateur ne correspond à votre recherche.
          </Card>
        )}
      </div>

      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} onInvite={handleInvite} />
      <AdminsImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        existingEmails={admins.map((a) => a.email)}
        onImport={handleImport}
      />
      <PermissionsDialog admin={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      <AdminPreviewDialog
        admin={previewing}
        totalBuildings={buildings.length}
        onClose={() => setPreviewing(null)}
        onEdit={(a) => {
          setPreviewing(null);
          setEditing(a as SubAdmin);
        }}
      />
    </div>
  );
}

// ---------- Invite dialog ----------

function InviteDialog({
  open,
  onOpenChange,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onInvite: (payload: { name: string; email: string }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Nom et email requis");
      return;
    }
    onInvite({ name: name.trim(), email: email.trim() });
    setName("");
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inviter un sous-administrateur</DialogTitle>
          <DialogDescription>
            Une invitation sera envoyée par email. Vous pourrez configurer ses permissions ensuite.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <Label htmlFor="inv-name">Nom complet</Label>
            <Input id="inv-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont" />
          </div>
          <div>
            <Label htmlFor="inv-email">Email</Label>
            <Input
              id="inv-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean.dupont@estala.fr"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={submit} className="bg-gradient-primary text-primary-foreground">
            Envoyer l'invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Permissions dialog (ABAC editor) ----------

function PermissionsDialog({
  admin,
  onClose,
  onSave,
}: {
  admin: SubAdmin | null;
  onClose: () => void;
  onSave: (a: SubAdmin) => void;
}) {
  const [draft, setDraft] = useState<SubAdmin | null>(admin);
  const [scopeQuery, setScopeQuery] = useState("");

  // sync when opening on a different admin
  useMemo(() => setDraft(admin), [admin]);

  if (!admin || !draft) return null;

  const mode = scopeMode(draft.scopeBuildings);
  const allBuildingIds = buildings.map((b) => b.id);

  const togglePermAction = (mod: ModuleKey, action: ActionKey) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const current = prev.perms[mod] ?? { actions: [] };
      const has = current.actions.includes(action);
      const nextActions = has ? current.actions.filter((x) => x !== action) : [...current.actions, action];
      const nextPerms = { ...prev.perms };
      if (nextActions.length === 0) {
        delete nextPerms[mod];
      } else {
        nextPerms[mod] = { ...current, actions: nextActions };
      }
      return { ...prev, perms: nextPerms };
    });
  };

  const setCap = (mod: ModuleKey, value: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const current = prev.perms[mod];
      if (!current) return prev;
      const cap = value.trim() === "" ? null : Number(value.replace(/[^\d]/g, ""));
      return { ...prev, perms: { ...prev.perms, [mod]: { ...current, amountCap: cap } } };
    });
  };

  const setMode = (next: ScopeMode) => {
    setDraft((prev) => {
      if (!prev) return prev;
      if (next === "all") return { ...prev, scopeBuildings: "all" };
      if (next === "include") {
        // preserve current effective list when switching from exclude
        if (prev.scopeBuildings === "all") return { ...prev, scopeBuildings: [...allBuildingIds] };
        if (Array.isArray(prev.scopeBuildings)) return prev;
        const excluded = prev.scopeBuildings.except;
        return { ...prev, scopeBuildings: allBuildingIds.filter((id) => !excluded.includes(id)) };
      }
      // exclude
      if (prev.scopeBuildings === "all") return { ...prev, scopeBuildings: { except: [] } };
      if (Array.isArray(prev.scopeBuildings)) {
        const included = prev.scopeBuildings;
        return { ...prev, scopeBuildings: { except: allBuildingIds.filter((id) => !included.includes(id)) } };
      }
      return prev;
    });
  };

  const toggleBuildingInScope = (id: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      if (prev.scopeBuildings === "all") return prev;
      if (Array.isArray(prev.scopeBuildings)) {
        const list = [...prev.scopeBuildings];
        const idx = list.indexOf(id);
        if (idx >= 0) list.splice(idx, 1);
        else list.push(id);
        return { ...prev, scopeBuildings: list };
      }
      const except = [...prev.scopeBuildings.except];
      const idx = except.indexOf(id);
      if (idx >= 0) except.splice(idx, 1);
      else except.push(id);
      return { ...prev, scopeBuildings: { except } };
    });
  };

  const selectAllInScope = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      if (prev.scopeBuildings === "all") return prev;
      if (Array.isArray(prev.scopeBuildings)) return { ...prev, scopeBuildings: [...allBuildingIds] };
      return { ...prev, scopeBuildings: { except: [] } };
    });
  };

  const clearScope = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      if (prev.scopeBuildings === "all") return prev;
      if (Array.isArray(prev.scopeBuildings)) return { ...prev, scopeBuildings: [] };
      return { ...prev, scopeBuildings: { except: [...allBuildingIds] } };
    });
  };

  return (
    <Dialog open={!!admin} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="flex items-center gap-2 font-display">
            <ShieldCheck className="h-5 w-5 text-accent" />
            Permissions — {draft.name}
          </DialogTitle>
          <DialogDescription>
            Configurez le périmètre ABAC : modules, actions, immeubles, période, plafonds.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="mx-6 mt-4 grid w-[calc(100%-3rem)] grid-cols-3">
            <TabsTrigger value="modules">Modules & actions</TabsTrigger>
            <TabsTrigger value="scope">Périmètre</TabsTrigger>
            <TabsTrigger value="period">Période</TabsTrigger>
          </TabsList>

          {/* Modules */}
          <TabsContent value="modules" className="m-0">
            <ScrollArea className="h-[420px] px-6 py-4">
              <div className="space-y-2">
                {MODULES.map((m) => {
                  const perm = draft.perms[m.key];
                  const enabled = !!perm;
                  const showCap = m.key === "finances" || m.key === "impayes";
                  return (
                    <div
                      key={m.key}
                      className={cn(
                        "rounded-lg border border-border/60 p-3 transition-colors",
                        enabled && "bg-muted/30",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground">
                          <m.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{m.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {enabled ? `${perm!.actions.length} action(s) autorisée(s)` : "Aucun accès"}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {ACTIONS.map((act) => {
                            const on = perm?.actions.includes(act.key);
                            return (
                              <button
                                key={act.key}
                                onClick={() => togglePermAction(m.key, act.key)}
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] transition-colors",
                                  on
                                    ? "border-accent/40 bg-accent/15 text-accent"
                                    : "border-border/60 text-muted-foreground hover:bg-muted",
                                )}
                              >
                                <act.icon className="h-3 w-3" />
                                {act.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {enabled && showCap && (
                        <div className="mt-3 flex items-center gap-3 border-t border-border/60 pt-3">
                          <Label className="text-xs text-muted-foreground">Plafond montant (€)</Label>
                          <Input
                            value={perm!.amountCap ?? ""}
                            onChange={(e) => setCap(m.key, e.target.value)}
                            placeholder="Aucun plafond"
                            className="h-8 max-w-[180px]"
                          />
                          <span className="text-xs text-muted-foreground">par opération</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Scope */}
          <TabsContent value="scope" className="m-0">
            <div className="px-6 py-4 space-y-4">
              {/* Mode selector */}
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: "all", label: "Tous", desc: "Patrimoine entier, présents et futurs" },
                  { key: "include", label: "Sélection", desc: "Uniquement ces immeubles" },
                  { key: "exclude", label: "Tous sauf", desc: "Tout sauf ces immeubles" },
                ] as { key: ScopeMode; label: string; desc: string }[]).map((opt) => {
                  const active = mode === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setMode(opt.key)}
                      className={cn(
                        "rounded-lg border p-3 text-left transition-all",
                        active
                          ? "border-accent/60 bg-accent/10 shadow-soft"
                          : "border-border/60 hover:bg-muted/40",
                      )}
                    >
                      <p className={cn("text-sm font-medium", active && "text-accent")}>{opt.label}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>

              {mode !== "all" && (
                <>
                  <Separator />

                  {/* Summary + bulk actions + search */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-muted-foreground">
                      <Badge variant="outline" className="mr-2 border-accent/40 bg-accent/10 text-accent">
                        {effectiveBuildingCount(draft.scopeBuildings, buildings.length)} / {buildings.length}
                      </Badge>
                      {mode === "include" ? "immeubles inclus" : "immeubles accessibles (mode exclusion)"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={selectAllInScope}>
                        Tout cocher
                      </Button>
                      <Button variant="ghost" size="sm" onClick={clearScope}>
                        Tout décocher
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={scopeQuery}
                      onChange={(e) => setScopeQuery(e.target.value)}
                      placeholder="Filtrer les immeubles…"
                      className="h-9 pl-9"
                    />
                  </div>

                  <ScrollArea className="h-[260px] pr-2">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {buildings
                        .filter((b) => {
                          const q = scopeQuery.toLowerCase().trim();
                          if (!q) return true;
                          return b.nom.toLowerCase().includes(q) || b.adresse.toLowerCase().includes(q);
                        })
                        .map((b) => {
                          const inScope = scopeIncludesBuilding(draft.scopeBuildings, b.id, allBuildingIds);
                          // In include mode, "checked" means included.
                          // In exclude mode, "checked" means excluded (i.e. in the except list).
                          const checked =
                            mode === "include"
                              ? inScope
                              : !inScope;
                          return (
                            <label
                              key={b.id}
                              className={cn(
                                "flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors",
                                checked && (mode === "exclude"
                                  ? "border-destructive/40 bg-destructive/5"
                                  : "bg-muted/30"),
                              )}
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() => toggleBuildingInScope(b.id)}
                                className="mt-0.5"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{b.nom}</p>
                                <p className="text-xs text-muted-foreground truncate">{b.adresse}</p>
                              </div>
                              {mode === "exclude" && checked && (
                                <Badge variant="outline" className="text-[10px] border-destructive/40 text-destructive">
                                  Exclu
                                </Badge>
                              )}
                            </label>
                          );
                        })}
                    </div>
                  </ScrollArea>
                </>
              )}

              {mode === "all" && (
                <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                  Cet administrateur a accès à <span className="font-medium text-foreground">tous les {buildings.length} immeubles</span>, ainsi qu'à ceux ajoutés ultérieurement.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Period */}
          <TabsContent value="period" className="m-0">
            <div className="px-6 py-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Limitez l'accès à une fenêtre temporelle (utile pour gestionnaires temporaires, audits, stagiaires).
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="p-start">Début d'accès</Label>
                  <Input
                    id="p-start"
                    type="date"
                    value={draft.periodStart ?? ""}
                    onChange={(e) => setDraft({ ...draft, periodStart: e.target.value || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="p-end">Fin d'accès</Label>
                  <Input
                    id="p-end"
                    type="date"
                    value={draft.periodEnd ?? ""}
                    onChange={(e) => setDraft({ ...draft, periodEnd: e.target.value || undefined })}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Laissez vide pour un accès permanent. La suspension manuelle reste prioritaire.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={() => onSave(draft)} className="bg-gradient-primary text-primary-foreground">
            Enregistrer les permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
