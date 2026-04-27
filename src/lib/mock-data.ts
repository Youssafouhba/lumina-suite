// Mock data for the Estala property management platform

export const kpis = [
  { label: "Revenus mensuels", value: "€ 487 250", delta: "+8,2 %", trend: "up" as const, hint: "vs. mois dernier" },
  { label: "Taux d'occupation", value: "92,4 %", delta: "+1,1 pts", trend: "up" as const, hint: "183 / 198 lots" },
  { label: "Impayés en cours", value: "€ 38 940", delta: "-12,4 %", trend: "down" as const, hint: "7 dossiers actifs" },
  { label: "Tickets maintenance", value: "23", delta: "+4", trend: "up" as const, hint: "5 urgents" },
];

export const revenueSeries = [
  { month: "Jan", revenus: 412, charges: 168 },
  { month: "Fév", revenus: 428, charges: 172 },
  { month: "Mar", revenus: 441, charges: 165 },
  { month: "Avr", revenus: 455, charges: 180 },
  { month: "Mai", revenus: 462, charges: 175 },
  { month: "Juin", revenus: 470, charges: 182 },
  { month: "Juil", revenus: 478, charges: 188 },
  { month: "Août", revenus: 485, charges: 192 },
  { month: "Sep", revenus: 487, charges: 195 },
];

export const occupancyByBuilding = [
  { name: "Tour Haussmann", value: 96 },
  { name: "Résidence Lumière", value: 88 },
  { name: "Le Carré Opéra", value: 100 },
  { name: "Atrium Défense", value: 84 },
  { name: "Cours Saint-Michel", value: 91 },
];

export const buildings = [
  {
    id: "b1",
    nom: "Tour Haussmann",
    adresse: "12 Bd Haussmann, 75009 Paris",
    lots: 42,
    occupes: 40,
    surface: "8 240 m²",
    revenus: "€ 142 800 / mois",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format&fit=crop",
  },
  {
    id: "b2",
    nom: "Atrium La Défense",
    adresse: "Esplanade nord, 92800 Puteaux",
    lots: 56,
    occupes: 47,
    surface: "12 100 m²",
    revenus: "€ 198 400 / mois",
    image: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=800&auto=format&fit=crop",
  },
  {
    id: "b3",
    nom: "Le Carré Opéra",
    adresse: "5 Rue Auber, 75009 Paris",
    lots: 18,
    occupes: 18,
    surface: "3 480 m²",
    revenus: "€ 72 600 / mois",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
  },
  {
    id: "b4",
    nom: "Résidence Lumière",
    adresse: "44 Av. de Wagram, 75017 Paris",
    lots: 32,
    occupes: 28,
    surface: "5 920 m²",
    revenus: "€ 88 250 / mois",
    image: "https://images.unsplash.com/photo-1554435493-93422e8220c8?w=800&auto=format&fit=crop",
  },
  {
    id: "b5",
    nom: "Cours Saint-Michel",
    adresse: "21 Bd Saint-Michel, 75005 Paris",
    lots: 24,
    occupes: 22,
    surface: "4 180 m²",
    revenus: "€ 64 100 / mois",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop",
  },
  {
    id: "b6",
    nom: "Le Hangar Bastille",
    adresse: "8 Rue de la Roquette, 75011 Paris",
    lots: 26,
    occupes: 23,
    surface: "6 050 m²",
    revenus: "€ 78 900 / mois",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop",
  },
];

export type TenantStatus = "Actif" | "Préavis" | "Contentieux" | "Prospect";
export const tenants: {
  id: string;
  nom: string;
  type: string;
  contact: string;
  immeuble: string;
  loyer: string;
  statut: TenantStatus;
  initiales: string;
}[] = [
  { id: "t1", nom: "Atelier Verneuil SAS", type: "SAS", contact: "Léa Bertrand", immeuble: "Tour Haussmann · 4e", loyer: "€ 8 420", statut: "Actif", initiales: "AV" },
  { id: "t2", nom: "Nordica Conseil", type: "SARL", contact: "Mathis Klein", immeuble: "Atrium La Défense · 12e", loyer: "€ 14 800", statut: "Actif", initiales: "NC" },
  { id: "t3", nom: "Studio Calame", type: "EI", contact: "Inès Calame", immeuble: "Le Carré Opéra · RDC", loyer: "€ 3 250", statut: "Préavis", initiales: "SC" },
  { id: "t4", nom: "Mercure Notaires", type: "SCP", contact: "Hugo Marchand", immeuble: "Tour Haussmann · 7e", loyer: "€ 11 600", statut: "Actif", initiales: "MN" },
  { id: "t5", nom: "Kaizen Coworking", type: "SAS", contact: "Alma Roussel", immeuble: "Le Hangar Bastille · 1er", loyer: "€ 18 950", statut: "Actif", initiales: "KC" },
  { id: "t6", nom: "Forge Médias", type: "SARL", contact: "Théo Lambert", immeuble: "Résidence Lumière · 3e", loyer: "€ 6 400", statut: "Contentieux", initiales: "FM" },
  { id: "t7", nom: "Association Horizon", type: "Asso", contact: "Salima Daoud", immeuble: "Cours Saint-Michel · 2e", loyer: "€ 2 850", statut: "Actif", initiales: "AH" },
  { id: "t8", nom: "Cabinet Lumen", type: "SELARL", contact: "Pierre Vasseur", immeuble: "Atrium La Défense · 8e", loyer: "€ 9 720", statut: "Prospect", initiales: "CL" },
];

export const leases = [
  { id: "l1", ref: "BAIL-2024-0142", locataire: "Atelier Verneuil SAS", local: "Bureau 4-12", type: "Commercial 3/6/9", debut: "01/03/2023", fin: "28/02/2032", loyer: "€ 8 420", statut: "Actif" as const },
  { id: "l2", ref: "BAIL-2024-0156", locataire: "Nordica Conseil", local: "Plateau 12-A", type: "Commercial 3/6/9", debut: "15/06/2024", fin: "14/06/2033", loyer: "€ 14 800", statut: "Actif" as const },
  { id: "l3", ref: "BAIL-2024-0173", locataire: "Studio Calame", local: "Boutique RDC-3", type: "Précaire", debut: "01/01/2024", fin: "31/12/2024", loyer: "€ 3 250", statut: "Préavis" as const },
  { id: "l4", ref: "BAIL-2024-0188", locataire: "Mercure Notaires", local: "Étage 7 entier", type: "Professionnel", debut: "01/09/2022", fin: "31/08/2031", loyer: "€ 11 600", statut: "Actif" as const },
  { id: "l5", ref: "BAIL-2024-0201", locataire: "Kaizen Coworking", local: "Hangar 1-Nord", type: "Commercial 3/6/9", debut: "01/05/2024", fin: "30/04/2033", loyer: "€ 18 950", statut: "Actif" as const },
  { id: "l6", ref: "BAIL-2023-0098", locataire: "Forge Médias", local: "Bureau 3-08", type: "Commercial 3/6/9", debut: "01/02/2022", fin: "31/01/2031", loyer: "€ 6 400", statut: "Contentieux" as const },
];

export const arrears = [
  { id: "a1", locataire: "Forge Médias", immeuble: "Résidence Lumière", montant: "€ 12 800", retard: "47 j", etape: "Mise en demeure", risque: "Élevé" as const },
  { id: "a2", locataire: "Studio Calame", immeuble: "Le Carré Opéra", montant: "€ 3 250", retard: "12 j", etape: "Email + WhatsApp", risque: "Moyen" as const },
  { id: "a3", locataire: "Bureau Solis", immeuble: "Tour Haussmann", montant: "€ 6 100", retard: "8 j", etape: "SMS amical", risque: "Faible" as const },
  { id: "a4", locataire: "Atelier Pivoine", immeuble: "Atrium La Défense", montant: "€ 9 420", retard: "33 j", etape: "Appel automatique", risque: "Élevé" as const },
  { id: "a5", locataire: "Lumen Conseil", immeuble: "Cours Saint-Michel", montant: "€ 4 280", retard: "21 j", etape: "Email + WhatsApp", risque: "Moyen" as const },
  { id: "a6", locataire: "Volta Architectes", immeuble: "Le Hangar Bastille", montant: "€ 3 090", retard: "6 j", etape: "SMS amical", risque: "Faible" as const },
];

export const messages = [
  { id: "m1", from: "Léa Bertrand", role: "Atelier Verneuil SAS", channel: "WhatsApp" as const, preview: "Merci pour le rappel, le virement est parti ce matin.", time: "il y a 8 min", unread: true },
  { id: "m2", from: "Mathis Klein", role: "Nordica Conseil", channel: "Email" as const, preview: "Bonjour, pourriez-vous m'envoyer la régularisation des charges 2024 ?", time: "il y a 42 min", unread: true },
  { id: "m3", from: "Hugo Marchand", role: "Mercure Notaires", channel: "Appel" as const, preview: "Appel manqué — laisse un message vocal de 1:24", time: "il y a 1 h", unread: false },
  { id: "m4", from: "Alma Roussel", role: "Kaizen Coworking", channel: "WhatsApp" as const, preview: "Top, on signe l'avenant cette semaine 👍", time: "il y a 2 h", unread: true },
  { id: "m5", from: "Salima Daoud", role: "Association Horizon", channel: "SMS" as const, preview: "Bien reçu la quittance, merci !", time: "il y a 3 h", unread: false },
  { id: "m6", from: "Théo Lambert", role: "Forge Médias", channel: "Email" as const, preview: "Suite à notre échange, voici le calendrier d'apurement proposé…", time: "Hier", unread: false },
];

export const activity = [
  { id: "ac1", who: "Camille M.", what: "a généré 47 quittances", when: "il y a 12 min", tag: "Quittancement" },
  { id: "ac2", who: "Yacine T.", what: "a validé un avenant pour Nordica Conseil", when: "il y a 1 h", tag: "Bail" },
  { id: "ac3", who: "Système", what: "a déclenché 3 relances J+15 automatiques", when: "il y a 2 h", tag: "Impayés" },
  { id: "ac4", who: "Sofia L.", what: "a clôturé un ticket maintenance — Tour Haussmann", when: "il y a 3 h", tag: "Maintenance" },
  { id: "ac5", who: "Camille M.", what: "a ajouté l'immeuble « Le Hangar Bastille »", when: "Hier", tag: "Patrimoine" },
];

export const mapPins = [
  { id: "p1", nom: "Tour Haussmann", x: 38, y: 32, occ: 96 },
  { id: "p2", nom: "Atrium Défense", x: 18, y: 28, occ: 84 },
  { id: "p3", nom: "Le Carré Opéra", x: 42, y: 36, occ: 100 },
  { id: "p4", nom: "Résidence Lumière", x: 36, y: 26, occ: 88 },
  { id: "p5", nom: "Cours Saint-Michel", x: 46, y: 54, occ: 91 },
  { id: "p6", nom: "Le Hangar Bastille", x: 56, y: 48, occ: 88 },
];
