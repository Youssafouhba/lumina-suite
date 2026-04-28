import { useEffect, useMemo, useState } from "react";
import type jsPDF from "jspdf";
import { Download, FileText, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PdfPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Lazy builder so we only generate the PDF when the dialog opens. */
  build: () => { doc: jsPDF; filename: string };
}

export function PdfPreviewDialog({ open, onOpenChange, title, description, build }: PdfPreviewDialogProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("document.pdf");
  const [pages, setPages] = useState<number>(0);
  const [size, setSize] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    const { doc, filename } = build();
    const blob = doc.output("blob");
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    setFilename(filename);
    setPages(doc.getNumberOfPages());
    setSize(`${(blob.size / 1024).toFixed(1)} Ko`);
    return () => URL.revokeObjectURL(objectUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleDownload = () => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="font-display text-lg flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" /> {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="mt-1">{description}</DialogDescription>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {pages > 0 && <Badge variant="outline">{pages} page{pages > 1 ? "s" : ""}</Badge>}
              {size && <Badge variant="outline">{size}</Badge>}
            </div>
          </div>
        </DialogHeader>

        <div className="bg-muted/40 h-[65vh] w-full">
          {url ? (
            <iframe
              title="Aperçu du PDF"
              src={`${url}#toolbar=0&navpanes=0`}
              className="h-full w-full border-0 bg-white"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              Génération de l'aperçu…
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/60 flex-row sm:justify-between gap-2">
          <p className="text-xs text-muted-foreground truncate">
            Fichier : <span className="font-medium text-foreground">{filename}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="gap-1.5">
              <X className="h-4 w-4" /> Annuler
            </Button>
            <Button size="sm" onClick={handleDownload} className="gap-1.5 bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-95">
              <Download className="h-4 w-4" /> Confirmer & télécharger
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
