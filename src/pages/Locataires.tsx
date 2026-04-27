import { MessageCircle, Phone, Mail, MoreHorizontal, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { tenants, type TenantStatus } from "@/lib/mock-data";

const statusStyle: Record<TenantStatus, string> = {
  Actif: "bg-success/10 text-success border-success/20",
  Préavis: "bg-warning/10 text-warning border-warning/30",
  Contentieux: "bg-destructive/10 text-destructive border-destructive/20",
  Prospect: "bg-accent/10 text-accent border-accent/20",
};

export default function Locataires() {
  return (
    <div>
      <PageHeader
        eyebrow="Acteurs"
        title="Locataires & contacts"
        description="124 fiches actives. Communiquez en 1 clic — WhatsApp, appel, email."
        actions={
          <Button size="sm" className="h-9 gap-1.5 bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" /> Nouveau locataire</Button>
        }
      />

      <div className="p-4 md:p-8 space-y-4">
        <Card className="p-3 border-border/60 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher par nom, immeuble, type…" className="pl-9 h-9 border-transparent bg-muted/40" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9">Type</Button>
            <Button variant="outline" size="sm" className="h-9">Statut</Button>
            <Button variant="outline" size="sm" className="h-9">Immeuble</Button>
          </div>
        </Card>

        <Card className="border-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/60">
                  <TableHead className="text-xs uppercase tracking-wider">Locataire</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Type</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider hidden md:table-cell">Local</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Loyer</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Statut</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Contact rapide</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((t) => (
                  <TableRow key={t.id} className="group border-border/60">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">{t.initiales}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{t.nom}</p>
                          <p className="text-xs text-muted-foreground">{t.contact}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-medium">{t.type}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{t.immeuble}</TableCell>
                    <TableCell className="font-display font-medium text-sm">{t.loyer}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${statusStyle[t.statut]} font-medium`}>{t.statut}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-success/10 hover:text-success">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-accent/10 hover:text-accent">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
