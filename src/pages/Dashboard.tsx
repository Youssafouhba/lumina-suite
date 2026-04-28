import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp, ArrowUpRight, Building2, Users, FileText, AlertTriangle, Wallet, Sparkles, Download } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PeriodFilter } from "@/components/period-filter";
import { buildDashboardPdf, PeriodKey, PERIOD_LABELS } from "@/lib/pdf-export";
import { PdfPreviewDialog } from "@/components/pdf-preview-dialog";
import { toast } from "sonner";
import { kpis, revenueSeries, occupancyByBuilding, activity, messages } from "@/lib/mock-data";

const PERIOD_MONTHS: Record<PeriodKey, number> = { "7d": 1, "30d": 1, "90d": 3, ytd: 9, "12m": 9 };

const channelIcon: Record<string, string> = {
  WhatsApp: "💬",
  Email: "✉️",
  Appel: "📞",
  SMS: "📱",
};

export default function Dashboard() {
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const filteredRevenue = useMemo(
    () => revenueSeries.slice(-PERIOD_MONTHS[period]),
    [period],
  );

  const handleExport = () => {
    exportDashboardPdf({
      period,
      kpis,
      revenue: filteredRevenue,
      occupancy: occupancyByBuilding,
    });
    toast.success("Rapport PDF généré");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Vue d'ensemble"
        title="Bonjour Camille, voici votre portefeuille aujourd'hui."
        description="6 immeubles · 198 lots · 124 baux actifs. Tout est sous contrôle."
        actions={
          <>
            <PeriodFilter value={period} onChange={setPeriod} />
            <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={handleExport}>
              <Download className="h-4 w-4" /> Export PDF
            </Button>
            <Button size="sm" className="h-9 bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-95 gap-1.5">
              <Sparkles className="h-4 w-4" /> Rapport IA
            </Button>
          </>
        }
      />

      <div className="space-y-6 p-4 md:p-8">
        {/* KPI grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k, i) => {
            const Icon = [Wallet, Building2, AlertTriangle, FileText][i];
            const isUp = k.trend === "up";
            const positive = (i === 0 || i === 1) ? isUp : !isUp;
            return (
              <Card key={k.label} className="group relative overflow-hidden border-border/60 transition-all hover:shadow-elevated hover:-translate-y-0.5">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className={`gap-1 font-medium ${positive ? "text-success border-success/30 bg-success/5" : "text-destructive border-destructive/30 bg-destructive/5"}`}>
                      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {k.delta}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.label}</p>
                    <p className="mt-1 font-display text-2xl font-semibold tracking-tight">{k.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{k.hint}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/60">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="font-display text-lg">Revenus & charges</CardTitle>
                <p className="text-sm text-muted-foreground">Évolution sur 9 mois (en k€)</p>
              </div>
              <Badge variant="secondary" className="gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Temps réel</Badge>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={filteredRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gCh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="charges" stroke="hsl(var(--muted-foreground))" strokeWidth={2} fill="url(#gCh)" />
                  <Area type="monotone" dataKey="revenus" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#gRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg">Occupation par immeuble</CardTitle>
              <p className="text-sm text-muted-foreground">Taux d'occupation actuel (%)</p>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={occupancyByBuilding} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Activity + Messages */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="font-display text-lg">Activité récente</CardTitle>
                <p className="text-sm text-muted-foreground">Toutes les actions sur le portefeuille</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-accent hover:text-accent">Audit log <ArrowUpRight className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              {activity.map((a) => (
                <div key={a.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                      {a.who.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{a.who}</span>{" "}
                      <span className="text-muted-foreground">{a.what}</span>
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0">{a.tag}</Badge>
                      <span className="text-xs text-muted-foreground">{a.when}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" /> Messages
                </CardTitle>
                <p className="text-sm text-muted-foreground">Boîte unifiée</p>
              </div>
              <Badge className="bg-accent/15 text-accent hover:bg-accent/15 border-0">3 nouveaux</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {messages.slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-start gap-2.5 rounded-lg p-2.5 hover:bg-muted/50 transition-colors cursor-pointer">
                  <span className="mt-0.5 text-base">{channelIcon[m.channel]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">{m.from}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{m.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{m.preview}</p>
                  </div>
                  {m.unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
