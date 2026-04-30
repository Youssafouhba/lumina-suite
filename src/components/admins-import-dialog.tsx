import { useMemo, useRef, useState } from "react";
import { Upload, FileUp, Download, AlertCircle, CheckCircle2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type ImportRow = {
  name: string;
  email: string;
  role?: "sub_admin" | "super_admin";
  scope?: string; // "all" | "b1,b2" | "except:b3"
  modules?: string; // "finances:view+edit+export@50000;impayes:view+edit"
  periodStart?: string;
  periodEnd?: string;
};

type ParsedRow = {
  index: number;
  raw: ImportRow;
  errors: string[];
  ok: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CSV_TEMPLATE = `name,email,role,scope,modules,periodStart,periodEnd
Léa Fontaine,lea.fontaine@estala.fr,sub_admin,"b1,b3","finances:view+edit+export@50000;impayes:view+edit@10000",2026-01-01,2026-12-31
Yanis Bertrand,yanis.bertrand@estala.fr,sub_admin,b2,"patrimoine:view+edit;baux:view+edit+export",,
Inès Tahiri,ines.tahiri@estala.fr,sub_admin,all,,,`;

const JSON_TEMPLATE = JSON.stringify(
  [
    {
      name: "Léa Fontaine",
      email: "lea.fontaine@estala.fr",
      role: "sub_admin",
      scope: "b1,b3",
      modules: "finances:view+edit+export@50000;impayes:view+edit@10000",
      periodStart: "2026-01-01",
      periodEnd: "2026-12-31",
    },
    {
      name: "Inès Tahiri",
      email: "ines.tahiri@estala.fr",
      role: "sub_admin",
      scope: "all",
    },
  ],
  null,
  2,
);

function parseCSV(text: string): ImportRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const headers = splitCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const obj: any = {};
    headers.forEach((h, i) => (obj[h] = (cells[i] ?? "").trim()));
    return obj as ImportRow;
  });
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

function validate(rows: ImportRow[], existingEmails: Set<string>): ParsedRow[] {
  const seen = new Set<string>();
  return rows.map((raw, index) => {
    const errors: string[] = [];
    const name = (raw.name ?? "").toString().trim();
    const email = (raw.email ?? "").toString().trim().toLowerCase();
    if (!name) errors.push("Nom manquant");
    if (!email) errors.push("Email manquant");
    else if (!EMAIL_RE.test(email)) errors.push("Email invalide");
    else if (existingEmails.has(email)) errors.push("Email déjà existant");
    else if (seen.has(email)) errors.push("Doublon dans le fichier");
    seen.add(email);
    if (raw.role && !["sub_admin", "super_admin"].includes(raw.role))
      errors.push("Rôle inconnu");
    if (raw.periodStart && Number.isNaN(Date.parse(raw.periodStart)))
      errors.push("Date début invalide");
    if (raw.periodEnd && Number.isNaN(Date.parse(raw.periodEnd)))
      errors.push("Date fin invalide");
    return { index, raw: { ...raw, name, email }, errors, ok: errors.length === 0 };
  });
}

export function AdminsImportDialog({
  open,
  onOpenChange,
  existingEmails,
  onImport,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existingEmails: string[];
  onImport: (rows: ImportRow[]) => void;
}) {
  const [tab, setTab] = useState<"csv" | "json">("csv");
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const existingSet = useMemo(
    () => new Set(existingEmails.map((e) => e.toLowerCase())),
    [existingEmails],
  );

  const parsed = useMemo<ParsedRow[]>(() => {
    if (!text.trim()) return [];
    try {
      const rows = tab === "csv" ? parseCSV(text) : (JSON.parse(text) as ImportRow[]);
      if (!Array.isArray(rows)) return [];
      return validate(rows, existingSet);
    } catch {
      return [];
    }
  }, [text, tab, existingSet]);

  const okCount = parsed.filter((p) => p.ok).length;
  const errCount = parsed.length - okCount;
  const parseError =
    text.trim().length > 0 && parsed.length === 0
      ? tab === "json"
        ? "JSON invalide"
        : "Format CSV invalide"
      : null;

  const allValidSelected =
    parsed.filter((p) => p.ok).every((p) => selected[p.index]) && okCount > 0;

  const toggleAll = () => {
    if (allValidSelected) {
      setSelected({});
    } else {
      const next: Record<number, boolean> = {};
      parsed.forEach((p) => {
        if (p.ok) next[p.index] = true;
      });
      setSelected(next);
    }
  };

  const handleFile = async (file: File) => {
    const content = await file.text();
    setText(content);
    setTab(file.name.toLowerCase().endsWith(".json") ? "json" : "csv");
    setSelected({});
  };

  const downloadTemplate = () => {
    const blob = new Blob([tab === "csv" ? CSV_TEMPLATE : JSON_TEMPLATE], {
      type: tab === "csv" ? "text/csv" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sous-admins-template.${tab}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const submit = () => {
    const toImport = parsed.filter((p) => p.ok && selected[p.index]).map((p) => p.raw);
    if (toImport.length === 0) {
      toast.error("Sélectionnez au moins une ligne valide");
      return;
    }
    onImport(toImport);
    toast.success(
      `${toImport.length} sous-admin${toImport.length > 1 ? "s" : ""} importé${toImport.length > 1 ? "s" : ""}`,
    );
    setText("");
    setSelected({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Importer des sous-administrateurs
          </DialogTitle>
          <DialogDescription>
            Collez vos données ou chargez un fichier CSV / JSON. Les permissions sont décrites au format{" "}
            <code className="text-xs">module:action1+action2@plafond</code>.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "csv" | "json")}>
          <div className="flex items-center justify-between gap-2">
            <TabsList>
              <TabsTrigger value="csv">CSV</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="mr-2 h-3.5 w-3.5" />
                Modèle
              </Button>
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-2 h-3.5 w-3.5" />
                Charger
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.json,text/csv,application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = "";
                }}
              />
            </div>
          </div>

          <TabsContent value="csv" className="mt-3">
            <Textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setSelected({});
              }}
              placeholder={CSV_TEMPLATE}
              className="font-mono text-xs min-h-[140px]"
            />
          </TabsContent>
          <TabsContent value="json" className="mt-3">
            <Textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setSelected({});
              }}
              placeholder={JSON_TEMPLATE}
              className="font-mono text-xs min-h-[140px]"
            />
          </TabsContent>
        </Tabs>

        {/* Summary */}
        {(parsed.length > 0 || parseError) && (
          <div className="flex flex-wrap items-center gap-2">
            {parseError ? (
              <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
                <AlertCircle className="mr-1 h-3 w-3" />
                {parseError}
              </Badge>
            ) : (
              <>
                <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  {okCount} valide{okCount > 1 ? "s" : ""}
                </Badge>
                {errCount > 0 && (
                  <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
                    <X className="mr-1 h-3 w-3" />
                    {errCount} en erreur
                  </Badge>
                )}
                {okCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={toggleAll} className="h-7 text-xs">
                    {allValidSelected ? "Tout décocher" : "Tout sélectionner"}
                  </Button>
                )}
              </>
            )}
          </div>
        )}

        {/* Preview */}
        {parsed.length > 0 && (
          <ScrollArea className="h-64 rounded-md border border-border/60">
            <div className="divide-y divide-border/60">
              {parsed.map((p) => (
                <Card
                  key={p.index}
                  className={cn(
                    "rounded-none border-0 p-3 flex items-start gap-3",
                    !p.ok && "bg-destructive/5",
                  )}
                >
                  <Checkbox
                    checked={!!selected[p.index]}
                    disabled={!p.ok}
                    onCheckedChange={(v) =>
                      setSelected((s) => ({ ...s, [p.index]: !!v }))
                    }
                    className="mt-1"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {p.raw.name || <em className="text-muted-foreground">sans nom</em>}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">{p.raw.email}</span>
                      {p.raw.scope && (
                        <Badge variant="outline" className="text-[10px]">
                          scope: {p.raw.scope}
                        </Badge>
                      )}
                    </div>
                    {p.raw.modules && (
                      <p className="mt-1 text-[11px] text-muted-foreground font-mono truncate">
                        {p.raw.modules}
                      </p>
                    )}
                    {p.errors.length > 0 && (
                      <p className="mt-1 text-xs text-destructive">{p.errors.join(" · ")}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={submit}
            disabled={Object.values(selected).filter(Boolean).length === 0}
            className="bg-gradient-primary text-primary-foreground"
          >
            Importer la sélection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
