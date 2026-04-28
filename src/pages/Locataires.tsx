import { useState, useCallback } from "react";
import {
  MessageCircle, Phone, Mail, Plus, Search, X, LayoutGrid, List,
  AlertCircle, Building2, MapPin, FileText, ChevronRight,
  ArrowUpRight, CheckCircle2, Clock, Shield,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { tenantsRich, type TenantRich, type TenantStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TenantStatus, { label: string; className: string; dot: string; icon: typeof CheckCircle2 }> = {
  Actif:       { label: "Actif",       className: "bg-success/10 text-success border-success/20",           dot: "bg-success",              icon: CheckCircle2 },
  Préavis:     { label: "Préavis",     className: "bg-warning/10 text-warning border-warning/30",           dot: "bg-warning",              icon: Clock        },
  Contentieux: { label: "Contentieux", className: "bg-destructive/10 text-destructive border-destructive/20", dot: "bg-destructive",        icon: AlertCircle  },
  Prospect:    { label: "Prospect",    className: "bg-accent/10 text-accent border-accent/20",              dot: "bg-accent",               icon: Shield       },
};

const ALL_STATUTS: TenantStatus[] = ["Actif", "Préavis", "Contentieux", "Prospect"];

const TYPE_LIST = ["SAS", "SARL", "SCP", "SA", "EI", "SELARL", "Asso"];

const uid = () => Math.random().toString(36).slice(2, 9);
const fmtN = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

// ─── Avatar gradient helper ───────────────────────────────────────

function TenantAvatar({ t, size = "md" }: { t: TenantRich; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "h-16 w-16 text-lg" : size === "sm" ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs";
  return (
    <Avatar className={cn(sz, "flex-shrink-0 ring-2 ring-background")}>
      <AvatarFallback
        className="font-bold text-white"
        style={{
          background: `linear-gradient(135deg, hsl(${t.hue} 60% 35%), hsl(${(t.hue + 40) % 360} 55% 55%))`,
        }}
      >
        {t.initiales}
      </AvatarFallback>
    </Avatar>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────

function StatusBadge({ statut, small }: { statut: TenantStatus; small?: boolean }) {
  const s = STATUS_CONFIG[statut];
  return (
    <Badge
      variant="outline"
      className={cn(s.className, "font-medium gap-1", small ? "text-[10px] px-1.5 py-0.5" : "text-[11px]")}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
      {s.label}
    </Badge>
  );
}

// ─── Quick contact buttons ────────────────────────────────────────

function ContactButtons({ t, compact }: { t: TenantRich; compact?: boolean }) {
  const sz = compact ? "h-7 w-7" : "h-8 w-8";
  return (
    <div className="flex items-center gap-1">
      <Button size="icon" variant="ghost" className={cn(sz, "hover:bg-success/10 hover:text-success")} title="WhatsApp">
        <MessageCircle className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" variant="ghost" className={cn(sz, "hover:bg-accent/10 hover:text-accent")} title="Appel">
        <Phone className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" variant="ghost" className={cn(sz, "hover:bg-muted")} title="Email">
        <Mail className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// ─── Tenant Card (grid view) ──────────────────────────────────────

function TenantCard({ t, onClick }: { t: TenantRich; onClick: () => void }) {
  const hasImpayes = t.impayes > 0;
  return (
    <Card
      className="group border-border/60 cursor-pointer transition-all hover:shadow-elevated hover:-translate-y-0.5 overflow-hidden"
      onClick={onClick}
    >
      {/* Impayes warning strip */}
      {hasImpayes && (
        <div className="h-0.5 bg-destructive" />
      )}
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start gap-3 mb-4">
          <TenantAvatar t={t} />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[14px] truncate text-foreground leading-tight">{t.nom}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{t.contact}</div>
          </div>
          <StatusBadge statut={t.statut} small />
        </div>

        {/* Infos */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{t.immeuble}</span>
          </div>
          <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Local {t.local} · {t.surface} m²</span>
          </div>
          <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
            <FileText className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{t.typeBail}</span>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Loyer + badges */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Loyer / mois</div>
            <div className="font-display text-xl font-semibold text-foreground">
              {fmtN(t.loyer)} <span className="text-sm font-normal text-muted-foreground">€</span>
            </div>
          </div>
          {hasImpayes && (
            <div className="text-right">
              <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-destructive mb-0.5">Impayés</div>
              <div className="font-display text-base font-semibold text-destructive">{fmtN(t.impayes)} €</div>
            </div>
          )}
        </div>

        {/* Type badge + contact */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-mono text-[9.5px]">{t.type}</Badge>
          <ContactButtons t={t} compact />
        </div>

        {/* Last contact */}
        <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-[10.5px] text-muted-foreground">
          <span>{t.canal} · {t.dernierContact}</span>
          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Card>
  );
}

// ─── Tenant Table Row (list view) ────────────────────────────────

function TenantRow({ t, onClick }: { t: TenantRich; onClick: () => void }) {
  return (
    <TableRow
      className="group border-border/60 cursor-pointer hover:bg-muted/40 transition-colors"
      onClick={onClick}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <TenantAvatar t={t} size="sm" />
          <div>
            <div className="font-medium text-sm text-foreground flex items-center gap-2">
              {t.nom}
              {t.impayes > 0 && (
                <span className="font-mono text-[9px] px-1 py-0.5 rounded bg-destructive/10 text-destructive">
                  {fmtN(t.impayes)} € impayés
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{t.contact}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-[10px] font-mono">{t.type}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="text-sm text-muted-foreground truncate max-w-[180px]">{t.immeuble} · {t.local}</div>
      </TableCell>
      <TableCell className="hidden lg:table-cell text-[11px] text-muted-foreground">{t.typeBail}</TableCell>
      <TableCell>
        <div className="font-display font-semibold text-sm">{fmtN(t.loyer)} <span className="text-xs font-normal text-muted-foreground">€</span></div>
      </TableCell>
      <TableCell>
        <StatusBadge statut={t.statut} small />
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <ContactButtons t={t} compact />
          <Button size="icon" variant="ghost" className="h-7 w-7">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Tenant Detail Sheet ──────────────────────────────────────────

function TenantDetail({
  tenant,
  onClose,
  onUpdate,
}: {
  tenant: TenantRich;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<TenantRich>) => void;
}) {
  const [notes, setNotes] = useState(tenant.notes);
  const total = tenant.loyer + tenant.charges;
  const s = STATUS_CONFIG[tenant.statut];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-border/60">
        <div className="flex items-start gap-4">
          <TenantAvatar t={tenant} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="font-display text-xl font-semibold text-foreground leading-tight">{tenant.nom}</div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge variant="outline" className="font-mono text-[10px]">{tenant.type}</Badge>
              <StatusBadge statut={tenant.statut} small />
            </div>
            <div className="text-[12px] text-muted-foreground mt-1.5">{tenant.contact}</div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick contact */}
        <div className="flex items-center gap-2 mt-4">
          <Button size="sm" variant="outline" className="flex-1 h-8 gap-1.5 text-xs hover:bg-success/10 hover:text-success hover:border-success/30">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </Button>
          <Button size="sm" variant="outline" className="flex-1 h-8 gap-1.5 text-xs hover:bg-accent/10 hover:text-accent hover:border-accent/30">
            <Phone className="h-3.5 w-3.5" /> Appeler
          </Button>
          <Button size="sm" variant="outline" className="flex-1 h-8 gap-1.5 text-xs">
            <Mail className="h-3.5 w-3.5" /> Email
          </Button>
        </div>

        {/* Impayes alert */}
        {tenant.impayes > 0 && (
          <div className="mt-3 flex items-center gap-2.5 rounded-lg px-3 py-2 bg-destructive/8 border border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
            <div className="text-[12px]">
              <span className="font-semibold text-destructive">{fmtN(tenant.impayes)} € d'impayés</span>
              <span className="text-muted-foreground"> — relance en cours</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="bail" className="flex-1 flex flex-col min-h-0">
        <TabsList className="rounded-none border-b border-border/60 bg-transparent h-auto px-4 gap-1 justify-start shrink-0">
          {[
            { value: "bail",    label: "Bail" },
            { value: "contact", label: "Contact" },
            { value: "notes",   label: "Notes" },
          ].map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-accent font-mono text-[10.5px] uppercase tracking-[0.12em] px-3 py-2.5"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* BAIL TAB */}
        <TabsContent value="bail" className="flex-1 overflow-y-auto mt-0 p-5 space-y-5">
          {/* Loyer / charges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Loyer",   value: `${fmtN(tenant.loyer)} €`,   sub: "hors charges" },
              { label: "Charges", value: `${fmtN(tenant.charges)} €`, sub: "provisions" },
              { label: "Total",   value: `${fmtN(total)} €`,           sub: "/ mois" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl bg-muted/40 p-3 text-center">
                <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-1">{s.label}</div>
                <div className="font-display text-base font-semibold text-foreground">{s.value}</div>
                <div className="font-mono text-[9px] text-muted-foreground mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Local info */}
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Bien loué</div>
            <div className="rounded-xl border border-border/60 overflow-hidden">
              {[
                { label: "Immeuble",   value: tenant.immeuble },
                { label: "Local",      value: `${tenant.local} · ${tenant.surface} m²` },
                { label: "Type de bail", value: tenant.typeBail },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 last:border-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
                  <span className="text-[13px] font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Période</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/40 p-3">
                <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">Début</div>
                <div className="font-semibold text-sm text-foreground">{tenant.debut}</div>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">Fin</div>
                <div className="font-semibold text-sm text-foreground">{tenant.fin}</div>
              </div>
            </div>
          </div>

          {/* Statut change */}
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Statut</div>
            <Select
              value={tenant.statut}
              onValueChange={v => onUpdate(tenant.id, { statut: v as TenantStatus })}
            >
              <SelectTrigger className="h-9 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUTS.map(s => (
                  <SelectItem key={s} value={s} className="text-[12px]">
                    {STATUS_CONFIG[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        {/* CONTACT TAB */}
        <TabsContent value="contact" className="flex-1 overflow-y-auto mt-0 p-5 space-y-4">
          <div className="space-y-3">
            {[
              { icon: Phone,         label: "Téléphone",    value: tenant.phone,  href: `tel:${tenant.phone}`,           btnLabel: "Appeler",   btnCls: "hover:bg-accent/10 hover:text-accent hover:border-accent/30"  },
              { icon: Mail,          label: "Email",        value: tenant.email,  href: `mailto:${tenant.email}`,        btnLabel: "Envoyer",   btnCls: "hover:bg-muted"  },
              { icon: MessageCircle, label: "WhatsApp",     value: tenant.phone,  href: `https://wa.me/${tenant.phone}`, btnLabel: "Message",   btnCls: "hover:bg-success/10 hover:text-success hover:border-success/30" },
            ].map(({ icon: Icon, label, value, href, btnLabel, btnCls }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3">
                <div className="w-9 h-9 rounded-lg grid place-items-center bg-muted/60 text-muted-foreground flex-shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">{label}</div>
                  <div className="text-[13px] font-medium text-foreground truncate">{value}</div>
                </div>
                <Button size="sm" variant="outline" className={cn("h-8 text-xs", btnCls)} asChild>
                  <a href={href} target="_blank" rel="noreferrer">{btnLabel}</a>
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Dernier contact</div>
            <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
              <div>
                <div className="text-[13px] font-medium text-foreground">{tenant.canal}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{tenant.dernierContact}</div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* NOTES TAB */}
        <TabsContent value="notes" className="flex-1 overflow-y-auto mt-0 p-5 flex flex-col gap-4">
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Notes internes</div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full h-48 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none resize-none focus:border-accent/60 transition-colors"
              placeholder="Ajouter une note…"
            />
          </div>
          <Button
            size="sm"
            className="self-end bg-gradient-primary text-primary-foreground"
            onClick={() => onUpdate(tenant.id, { notes })}
          >
            Enregistrer les notes
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Add Tenant Dialog ────────────────────────────────────────────

function AddTenantDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (t: TenantRich) => void;
}) {
  const [form, setForm] = useState({
    nom: "", type: "SAS", contact: "", phone: "", email: "",
    immeuble: "", local: "", surface: "", loyer: "", charges: "",
    typeBail: "Commercial 3/6/9", debut: "", fin: "", statut: "Prospect" as TenantStatus,
  });
  const h = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.nom || !form.contact) return;
    const ini = form.nom.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
    onAdd({
      id: "tr" + uid(),
      nom: form.nom,
      type: form.type,
      initiales: ini,
      hue: Math.floor(Math.random() * 360),
      contact: form.contact,
      phone: form.phone,
      email: form.email,
      immeuble: form.immeuble,
      local: form.local,
      surface: parseInt(form.surface) || 0,
      typeBail: form.typeBail,
      debut: form.debut,
      fin: form.fin,
      loyer: parseInt(form.loyer) || 0,
      charges: parseInt(form.charges) || 0,
      statut: form.statut,
      impayes: 0,
      dernierContact: "—",
      canal: "Email",
      notes: "",
    });
    setForm({ nom: "", type: "SAS", contact: "", phone: "", email: "", immeuble: "", local: "", surface: "", loyer: "", charges: "", typeBail: "Commercial 3/6/9", debut: "", fin: "", statut: "Prospect" });
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Nouveau locataire</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Raison sociale</Label>
              <Input value={form.nom} onChange={e => h("nom", e.target.value)} placeholder="Atelier Verneuil SAS" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Type juridique</Label>
              <Select value={form.type} onValueChange={v => h("type", v)}>
                <SelectTrigger className="h-9 text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPE_LIST.map(t => <SelectItem key={t} value={t} className="text-[12px]">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Statut</Label>
              <Select value={form.statut} onValueChange={v => h("statut", v)}>
                <SelectTrigger className="h-9 text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_STATUTS.map(s => <SelectItem key={s} value={s} className="text-[12px]">{STATUS_CONFIG[s].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Contact</Label>
              <Input value={form.contact} onChange={e => h("contact", e.target.value)} placeholder="Prénom Nom" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Téléphone</Label>
              <Input value={form.phone} onChange={e => h("phone", e.target.value)} placeholder="+33 6 …" className="h-9" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Email</Label>
            <Input value={form.email} onChange={e => h("email", e.target.value)} placeholder="contact@societe.fr" className="h-9" type="email" />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Immeuble</Label>
              <Input value={form.immeuble} onChange={e => h("immeuble", e.target.value)} placeholder="Tour Haussmann" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Local</Label>
              <Input value={form.local} onChange={e => h("local", e.target.value)} placeholder="4.01" className="h-9" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Surface m²</Label>
              <Input value={form.surface} onChange={e => h("surface", e.target.value)} placeholder="80" type="number" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Loyer €</Label>
              <Input value={form.loyer} onChange={e => h("loyer", e.target.value)} placeholder="5000" type="number" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Charges €</Label>
              <Input value={form.charges} onChange={e => h("charges", e.target.value)} placeholder="750" type="number" className="h-9" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Début bail</Label>
              <Input value={form.debut} onChange={e => h("debut", e.target.value)} placeholder="01/01/2025" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">Fin bail</Label>
              <Input value={form.fin} onChange={e => h("fin", e.target.value)} placeholder="31/12/2033" className="h-9" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button className="bg-gradient-primary text-primary-foreground" onClick={submit}>
            Créer le locataire
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── KPI Bar ──────────────────────────────────────────────────────

function KpiBar({ tenants }: { tenants: TenantRich[] }) {
  const actifs      = tenants.filter(t => t.statut === "Actif").length;
  const preavis     = tenants.filter(t => t.statut === "Préavis").length;
  const contentieux = tenants.filter(t => t.statut === "Contentieux").length;
  const totalRev    = tenants.filter(t => t.statut === "Actif").reduce((s, t) => s + t.loyer, 0);
  const totalImp    = tenants.reduce((s, t) => s + t.impayes, 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 px-4 py-4 md:px-8 border-b border-border/60 bg-card/40">
      {[
        { label: "Total locataires",  value: tenants.length.toString(),       sub: `${actifs} actifs`                        },
        { label: "Actifs",            value: actifs.toString(),               sub: "baux en cours",   color: "text-success"  },
        { label: "Préavis",           value: preavis.toString(),              sub: "sorties prévues",  color: "text-warning"  },
        { label: "Contentieux",       value: contentieux.toString(),          sub: "dossiers actifs",  color: "text-destructive" },
        { label: "Impayés",           value: totalImp > 0 ? `${fmtN(totalImp)} €` : "—", sub: "en attente", color: totalImp > 0 ? "text-destructive" : undefined },
      ].map((k, i) => (
        <div key={i}>
          <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">{k.label}</p>
          <p className={cn("font-display text-2xl font-semibold mt-0.5", k.color ?? "text-foreground")}>{k.value}</p>
          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{k.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────

type ViewMode = "grid" | "list";

export default function Locataires() {
  const [tenants, setTenants] = useState<TenantRich[]>(tenantsRich);
  const [view, setView]       = useState<ViewMode>("list");
  const [search, setSearch]   = useState("");
  const [statusF, setStatusF] = useState<TenantStatus | "Tous">("Tous");
  const [typeF, setTypeF]     = useState("all");
  const [selected, setSelected] = useState<TenantRich | null>(null);
  const [showAdd, setShowAdd]   = useState(false);

  const filtered = tenants.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      t.nom.toLowerCase().includes(q) ||
      t.contact.toLowerCase().includes(q) ||
      t.immeuble.toLowerCase().includes(q) ||
      t.local.toLowerCase().includes(q);
    const matchStatus = statusF === "Tous" || t.statut === statusF;
    const matchType   = typeF === "all" || t.type === typeF;
    return matchSearch && matchStatus && matchType;
  });

  const updateTenant = useCallback((id: string, patch: Partial<TenantRich>) => {
    setTenants(prev => prev.map(t => t.id !== id ? t : { ...t, ...patch }));
    setSelected(prev => prev?.id !== id ? prev : { ...prev, ...patch });
  }, []);

  const addTenant = useCallback((t: TenantRich) => {
    setTenants(prev => [t, ...prev]);
  }, []);

  const totalLoyers = tenants.filter(t => t.statut === "Actif").reduce((s, t) => s + t.loyer, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        eyebrow="Acteurs"
        title={`${tenants.length} locataires · ${fmtN(totalLoyers)} € / mois`}
        description="Communiquez en 1 clic — WhatsApp, appel, email. Suivez chaque bail et relancez les impayés."
        actions={
          <Button size="sm" className="h-9 gap-1.5 bg-gradient-primary text-primary-foreground" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4" /> Nouveau locataire
          </Button>
        }
      />

      <KpiBar tenants={tenants} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-8 border-b border-border/60 bg-background sticky top-16 z-10">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs h-9 rounded-lg border border-border/60 px-3 bg-card">
          <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nom, immeuble, local…"
            className="flex-1 bg-transparent outline-none text-[13px] text-foreground placeholder:text-muted-foreground/60"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-1">
          {(["Tous", ...ALL_STATUTS] as (TenantStatus | "Tous")[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusF(s)}
              className={cn(
                "h-8 px-3 rounded-lg text-[11.5px] font-medium transition-colors",
                statusF === s
                  ? s === "Tous"
                    ? "bg-foreground text-background"
                    : cn("border font-semibold", STATUS_CONFIG[s as TenantStatus].className)
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <Select value={typeF} onValueChange={setTypeF}>
          <SelectTrigger className="h-9 w-[110px] text-[12px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            {TYPE_LIST.map(t => <SelectItem key={t} value={t} className="text-[12px]">{t}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-1 rounded-lg border border-border/60 p-0.5 bg-card">
          {([
            { mode: "list" as ViewMode, Icon: List,       label: "Liste"  },
            { mode: "grid" as ViewMode, Icon: LayoutGrid, label: "Cartes" },
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
          {filtered.length} locataire{filtered.length > 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 pb-20">
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(t => (
              <TenantCard key={t.id} t={t} onClick={() => setSelected(t)} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                <Shield className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-mono text-[11px] uppercase tracking-[0.2em]">Aucun locataire trouvé</p>
              </div>
            )}
          </div>
        )}

        {view === "list" && (
          <Card className="border-border/60 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/60">
                    <TableHead className="font-mono text-[9px] uppercase tracking-wider">Locataire</TableHead>
                    <TableHead className="font-mono text-[9px] uppercase tracking-wider">Type</TableHead>
                    <TableHead className="font-mono text-[9px] uppercase tracking-wider hidden md:table-cell">Local</TableHead>
                    <TableHead className="font-mono text-[9px] uppercase tracking-wider hidden lg:table-cell">Bail</TableHead>
                    <TableHead className="font-mono text-[9px] uppercase tracking-wider">Loyer</TableHead>
                    <TableHead className="font-mono text-[9px] uppercase tracking-wider">Statut</TableHead>
                    <TableHead className="font-mono text-[9px] uppercase tracking-wider text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(t => (
                    <TenantRow key={t.id} t={t} onClick={() => setSelected(t)} />
                  ))}
                </TableBody>
              </Table>
              {filtered.length === 0 && (
                <div className="py-16 text-center text-muted-foreground">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Aucun locataire trouvé</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={v => !v && setSelected(null)}>
        <SheetContent side="right" className="w-[500px] sm:max-w-none p-0 flex flex-col overflow-hidden">
          {selected && (
            <TenantDetail
              tenant={selected}
              onClose={() => setSelected(null)}
              onUpdate={updateTenant}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Add dialog */}
      <AddTenantDialog open={showAdd} onClose={() => setShowAdd(false)} onAdd={addTenant} />
    </div>
  );
}
