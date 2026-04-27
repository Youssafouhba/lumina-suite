import { Settings, Tag, FileText, Workflow, Users, Database, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sections = [
  { icon: Tag, title: "Types & catégories", desc: "Types de local, bail, locataire, charges, modes de paiement…", count: "47 entrées" },
  { icon: FileText, title: "Champs personnalisés", desc: "Ajoutez vos propres champs sur chaque entité (texte, devise, liste…).", count: "12 champs" },
  { icon: Workflow, title: "Workflows métier", desc: "États successifs, transitions conditionnelles, automatisations.", count: "6 workflows" },
  { icon: Users, title: "Permissions ABAC", desc: "Périmètres dynamiques par immeuble, période, montant, action.", count: "8 sous-admins" },
  { icon: Database, title: "Modèles de documents", desc: "Bail, quittance, mise en demeure — variables dynamiques multilingues.", count: "23 templates" },
  { icon: Settings, title: "Préférences générales", desc: "Devise, fuseau, indices de révision (ICC/ILC/ILAT), branding.", count: "Système" },
];

export default function Configuration() {
  return (
    <div>
      <PageHeader
        eyebrow="Méta-modèle"
        title="Configuration"
        description="Tout est configurable. Aucun type ou statut n'est codé en dur — vous pilotez."
      />

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:p-8 xl:grid-cols-3">
        {sections.map((s) => (
          <Card key={s.title} className="group p-5 border-border/60 transition-all hover:shadow-elevated hover:-translate-y-0.5 cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-sm">
                <s.icon className="h-5 w-5" />
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <h3 className="mt-4 font-display text-base font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            <Badge variant="outline" className="mt-3 text-[10px]">{s.count}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
