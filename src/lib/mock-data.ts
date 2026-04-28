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

// ─── Locataires riches ────────────────────────────────────────────

export type ContactCanal = "WhatsApp" | "Email" | "Appel" | "SMS";

export interface TenantRich {
  id: string;
  nom: string;
  type: string;
  initiales: string;
  hue: number;            // pour le dégradé avatar (0–360)
  contact: string;
  phone: string;
  email: string;
  immeuble: string;
  local: string;
  surface: number;
  typeBail: string;
  debut: string;
  fin: string;
  loyer: number;
  charges: number;
  statut: TenantStatus;
  impayes: number;
  dernierContact: string;
  canal: ContactCanal;
  notes: string;
}

export const tenantsRich: TenantRich[] = [
  {
    id: "tr1", nom: "Atelier Verneuil SAS", type: "SAS", initiales: "AV", hue: 222,
    contact: "Léa Bertrand", phone: "+33 6 12 34 56 78", email: "lea.bertrand@atelier-verneuil.fr",
    immeuble: "Tour Haussmann", local: "1.01", surface: 120,
    typeBail: "Commercial 3/6/9", debut: "01/03/2023", fin: "28/02/2032",
    loyer: 8420, charges: 1260, statut: "Actif", impayes: 0,
    dernierContact: "il y a 8 min", canal: "WhatsApp",
    notes: "Excellent locataire. Paiement toujours à l'heure. Renouvellement anticipé envisagé en 2030.",
  },
  {
    id: "tr2", nom: "Nordica Conseil SARL", type: "SARL", initiales: "NC", hue: 195,
    contact: "Mathis Klein", phone: "+33 6 23 45 67 89", email: "m.klein@nordica-conseil.com",
    immeuble: "Atrium La Défense", local: "12.01", surface: 280,
    typeBail: "Commercial 3/6/9", debut: "15/06/2024", fin: "14/06/2033",
    loyer: 14800, charges: 2220, statut: "Actif", impayes: 0,
    dernierContact: "il y a 42 min", canal: "Email",
    notes: "Demande régularisation charges 2024. Prévoir envoi avant fin du mois.",
  },
  {
    id: "tr3", nom: "Studio Calame", type: "EI", initiales: "SC", hue: 38,
    contact: "Inès Calame", phone: "+33 6 34 56 78 90", email: "ines@studiocalame.fr",
    immeuble: "Le Carré Opéra", local: "RDC.01", surface: 90,
    typeBail: "Précaire", debut: "01/01/2024", fin: "31/12/2024",
    loyer: 3250, charges: 490, statut: "Préavis", impayes: 3250,
    dernierContact: "il y a 3 j", canal: "Email",
    notes: "Préavis donné le 15/10. Loyer de novembre non réglé — relance J+12 déclenchée.",
  },
  {
    id: "tr4", nom: "Mercure Notaires SCP", type: "SCP", initiales: "MN", hue: 270,
    contact: "Hugo Marchand", phone: "+33 6 45 67 89 01", email: "h.marchand@mercure-notaires.fr",
    immeuble: "Tour Haussmann", local: "7.01", surface: 120,
    typeBail: "Professionnel", debut: "01/09/2022", fin: "31/08/2031",
    loyer: 11600, charges: 1740, statut: "Actif", impayes: 0,
    dernierContact: "il y a 1 h", canal: "Appel",
    notes: "Appel manqué ce matin. Probablement pour l'avenant de surface. Rappeler demain matin.",
  },
  {
    id: "tr5", nom: "Kaizen Coworking SAS", type: "SAS", initiales: "KC", hue: 152,
    contact: "Alma Roussel", phone: "+33 6 56 78 90 12", email: "alma@kaizen-coworking.io",
    immeuble: "Le Hangar Bastille", local: "1.N", surface: 280,
    typeBail: "Commercial 3/6/9", debut: "01/05/2024", fin: "30/04/2033",
    loyer: 18950, charges: 2843, statut: "Actif", impayes: 0,
    dernierContact: "il y a 2 h", canal: "WhatsApp",
    notes: "Avenant en cours de signature. Surface étage 2 à discuter pour 2025.",
  },
  {
    id: "tr6", nom: "Forge Médias SARL", type: "SARL", initiales: "FM", hue: 0,
    contact: "Théo Lambert", phone: "+33 6 67 89 01 23", email: "t.lambert@forgemedias.com",
    immeuble: "Résidence Lumière", local: "1.01", surface: 65,
    typeBail: "Commercial 3/6/9", debut: "01/02/2022", fin: "31/01/2031",
    loyer: 6400, charges: 960, statut: "Contentieux", impayes: 12800,
    dernierContact: "Hier", canal: "Email",
    notes: "Impayés depuis 2 mois. Mise en demeure envoyée le 10/11. Dossier transmis à Me Dubois.",
  },
  {
    id: "tr7", nom: "Association Horizon", type: "Asso", initiales: "AH", hue: 180,
    contact: "Salima Daoud", phone: "+33 6 78 90 12 34", email: "salima@asso-horizon.org",
    immeuble: "Cours Saint-Michel", local: "1.01", surface: 55,
    typeBail: "Bail associatif", debut: "01/06/2021", fin: "31/05/2027",
    loyer: 2850, charges: 430, statut: "Actif", impayes: 0,
    dernierContact: "il y a 3 h", canal: "SMS",
    notes: "Locataire modèle. Quittance reçue avec accusé. Demande de travaux peinture à instruire.",
  },
  {
    id: "tr8", nom: "Cabinet Lumen SELARL", type: "SELARL", initiales: "CL", hue: 300,
    contact: "Pierre Vasseur", phone: "+33 6 89 01 23 45", email: "p.vasseur@cabinet-lumen.fr",
    immeuble: "Atrium La Défense", local: "8.01", surface: 95,
    typeBail: "Professionnel", debut: "01/02/2025", fin: "31/01/2034",
    loyer: 9720, charges: 1458, statut: "Prospect", impayes: 0,
    dernierContact: "il y a 2 j", canal: "Email",
    notes: "Dossier de candidature reçu. Visite prévue vendredi. Profil solide — CA 2,3 M€.",
  },
  {
    id: "tr9", nom: "Tech Partners SAS", type: "SAS", initiales: "TP", hue: 210,
    contact: "Camille Renard", phone: "+33 6 90 12 34 56", email: "c.renard@techpartners.io",
    immeuble: "Tour Haussmann", local: "3.01", surface: 200,
    typeBail: "Commercial 3/6/9", debut: "01/04/2023", fin: "31/03/2032",
    loyer: 14000, charges: 2100, statut: "Actif", impayes: 0,
    dernierContact: "il y a 4 h", canal: "WhatsApp",
    notes: "Très actif. Intérêt pour l'étage 4 si disponible en 2025.",
  },
  {
    id: "tr10", nom: "FinTech Solutions SA", type: "SA", initiales: "FS", hue: 160,
    contact: "Axel Moreau", phone: "+33 6 01 23 45 67", email: "a.moreau@fintechsolutions.eu",
    immeuble: "Atrium La Défense", local: "6.01", surface: 300,
    typeBail: "Commercial 3/6/9", debut: "15/09/2023", fin: "14/09/2032",
    loyer: 24000, charges: 3600, statut: "Actif", impayes: 0,
    dernierContact: "il y a 1 j", canal: "Email",
    notes: "Plus gros loyer du portefeuille. Satisfait. Renouvellement anticipé à prévoir.",
  },
  {
    id: "tr11", nom: "Horizon Avocats", type: "SCP", initiales: "HA", hue: 245,
    contact: "Charlotte Faure", phone: "+33 6 12 98 76 54", email: "c.faure@horizon-avocats.fr",
    immeuble: "Le Carré Opéra", local: "1.01", surface: 70,
    typeBail: "Professionnel", debut: "01/11/2022", fin: "31/10/2031",
    loyer: 5200, charges: 780, statut: "Actif", impayes: 0,
    dernierContact: "il y a 5 j", canal: "Email",
    notes: "RAS. Règlement ponctuel. Demande de domiciliation supplémentaire en cours.",
  },
  {
    id: "tr12", nom: "Volta Architectes", type: "SARL", initiales: "VA", hue: 60,
    contact: "Nora Blanc", phone: "+33 6 23 87 65 43", email: "n.blanc@volta-archi.fr",
    immeuble: "Le Hangar Bastille", local: "1.S", surface: 180,
    typeBail: "Commercial 3/6/9", debut: "01/06/2024", fin: "31/05/2033",
    loyer: 9800, charges: 1470, statut: "Actif", impayes: 3090,
    dernierContact: "Hier", canal: "SMS",
    notes: "Retard de 6 j sur le loyer de novembre. SMS amical envoyé. En attente.",
  },
  {
    id: "tr13", nom: "WeWork Opéra", type: "SAS", initiales: "WO", hue: 190,
    contact: "Jordan Petit", phone: "+33 6 34 76 54 32", email: "j.petit@wework.com",
    immeuble: "Le Carré Opéra", local: "4.01", surface: 180,
    typeBail: "Commercial 3/6/9", debut: "01/01/2024", fin: "31/12/2032",
    loyer: 12000, charges: 1800, statut: "Actif", impayes: 0,
    dernierContact: "il y a 6 h", canal: "Email",
    notes: "Bonne relation. Demande de badge accès parking supplémentaire.",
  },
  {
    id: "tr14", nom: "Lumen Conseil", type: "SARL", initiales: "LC", hue: 45,
    contact: "Marc Tissot", phone: "+33 6 45 65 43 21", email: "m.tissot@lumen-conseil.fr",
    immeuble: "Cours Saint-Michel", local: "2.01", surface: 55,
    typeBail: "Commercial 3/6/9", debut: "01/03/2022", fin: "28/02/2031",
    loyer: 4280, charges: 642, statut: "Actif", impayes: 4280,
    dernierContact: "il y a 2 j", canal: "Email",
    notes: "Impayé J+21. Email + WhatsApp envoyés. Attente de réponse.",
  },
  {
    id: "tr15", nom: "Bureau Solis", type: "EI", initiales: "BS", hue: 330,
    contact: "Diane Leroux", phone: "+33 6 56 54 32 10", email: "diane@bureausolis.fr",
    immeuble: "Tour Haussmann", local: "4.02", surface: 60,
    typeBail: "Professionnel", debut: "01/07/2023", fin: "30/06/2032",
    loyer: 4200, charges: 630, statut: "Actif", impayes: 6100,
    dernierContact: "il y a 8 j", canal: "SMS",
    notes: "Retard inhabituel. Contact par SMS J+8. Relance téléphonique à prévoir.",
  },
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

// ─── Patrimoine riche ─────────────────────────────────────────────

export type LocalType = 'bureau' | 'opensp' | 'commerce' | 'entrepot' | 'parking' | 'salle' | 'cowork';
export type LocalStatus = 'libre' | 'occupé' | 'travaux' | 'réservé';

export interface Local {
  id: string;
  ref: string;
  type: LocalType;
  floor: number;      // -1 = sous-sol, 0 = RDC, 1+ = étage
  surface: number;    // m²
  status: LocalStatus;
  tenant: string | null;
  rent: number;       // €/mois
  charges: number;    // €/mois
}

export interface BuildingRich {
  id: string;
  nom: string;
  adresse: string;
  image: string;
  floors: number;
  year: number;
  subAdmin: string;
  mapX: number;
  mapY: number;
  locals: Local[];
}

export const buildingsRich: BuildingRich[] = [
  {
    id: "b1",
    nom: "Tour Haussmann",
    adresse: "12 Bd Haussmann, 75009 Paris",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format&fit=crop",
    floors: 8,
    year: 2001,
    subAdmin: "Camille M.",
    mapX: 44,
    mapY: 33,
    locals: [
      { id: "l001", ref: "1.01", type: "bureau",   floor: 1,  surface: 120, status: "occupé",  tenant: "Atelier Verneuil SAS",  rent: 8420,  charges: 1260 },
      { id: "l002", ref: "1.02", type: "bureau",   floor: 1,  surface: 80,  status: "libre",   tenant: null,                    rent: 5600,  charges: 840  },
      { id: "l003", ref: "2.01", type: "bureau",   floor: 2,  surface: 80,  status: "occupé",  tenant: "Cabinet Faure & Assoc.", rent: 5600, charges: 840  },
      { id: "l004", ref: "3.01", type: "opensp",   floor: 3,  surface: 200, status: "occupé",  tenant: "Tech Partners SAS",     rent: 14000, charges: 2100 },
      { id: "l005", ref: "4.01", type: "bureau",   floor: 4,  surface: 60,  status: "travaux", tenant: null,                    rent: 4200,  charges: 630  },
      { id: "l006", ref: "4.02", type: "bureau",   floor: 4,  surface: 60,  status: "occupé",  tenant: "Bureau Solis",          rent: 4200,  charges: 630  },
      { id: "l007", ref: "5.01", type: "bureau",   floor: 5,  surface: 60,  status: "réservé", tenant: "(dossier en cours)",    rent: 4200,  charges: 630  },
      { id: "l008", ref: "7.01", type: "bureau",   floor: 7,  surface: 120, status: "occupé",  tenant: "Mercure Notaires SCP",  rent: 11600, charges: 1740 },
      { id: "l009", ref: "P.01", type: "parking",  floor: -1, surface: 15,  status: "occupé",  tenant: "(réservé 1.01)",        rent: 220,   charges: 0    },
    ],
  },
  {
    id: "b2",
    nom: "Atrium La Défense",
    adresse: "Esplanade nord, 92800 Puteaux",
    image: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=800&auto=format&fit=crop",
    floors: 14,
    year: 2012,
    subAdmin: "Yacine T.",
    mapX: 11,
    mapY: 27,
    locals: [
      { id: "l010", ref: "1.01",  type: "commerce", floor: 0,  surface: 160, status: "occupé",  tenant: "Brasserie Atrium",      rent: 15000, charges: 2200 },
      { id: "l011", ref: "3.01",  type: "bureau",   floor: 3,  surface: 85,  status: "occupé",  tenant: "Nordica Conseil SARL",  rent: 7200,  charges: 1080 },
      { id: "l012", ref: "3.02",  type: "bureau",   floor: 3,  surface: 85,  status: "libre",   tenant: null,                    rent: 7200,  charges: 1080 },
      { id: "l013", ref: "6.01",  type: "opensp",   floor: 6,  surface: 300, status: "occupé",  tenant: "FinTech Solutions SA",  rent: 24000, charges: 3600 },
      { id: "l014", ref: "8.01",  type: "bureau",   floor: 8,  surface: 95,  status: "occupé",  tenant: "Cabinet Lumen SELARL",  rent: 9720,  charges: 1458 },
      { id: "l015", ref: "12.01", type: "opensp",   floor: 12, surface: 280, status: "occupé",  tenant: "Nordica Conseil SARL",  rent: 14800, charges: 2220 },
      { id: "l016", ref: "12.02", type: "salle",    floor: 12, surface: 60,  status: "occupé",  tenant: "(mutualisée)",          rent: 3000,  charges: 450  },
      { id: "l017", ref: "P.01",  type: "parking",  floor: -1, surface: 15,  status: "occupé",  tenant: "(réservé 3.01)",        rent: 250,   charges: 0    },
      { id: "l018", ref: "P.02",  type: "parking",  floor: -1, surface: 15,  status: "occupé",  tenant: "(réservé 6.01)",        rent: 250,   charges: 0    },
      { id: "l019", ref: "P.03",  type: "parking",  floor: -1, surface: 15,  status: "libre",   tenant: null,                    rent: 250,   charges: 0    },
    ],
  },
  {
    id: "b3",
    nom: "Le Carré Opéra",
    adresse: "5 Rue Auber, 75009 Paris",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
    floors: 5,
    year: 1998,
    subAdmin: "Camille M.",
    mapX: 46,
    mapY: 36,
    locals: [
      { id: "l020", ref: "RDC.01", type: "commerce", floor: 0, surface: 90,  status: "occupé",  tenant: "Studio Calame",         rent: 3250,  charges: 490  },
      { id: "l021", ref: "RDC.02", type: "commerce", floor: 0, surface: 60,  status: "occupé",  tenant: "Copy Center Plus",      rent: 2800,  charges: 420  },
      { id: "l022", ref: "1.01",   type: "bureau",   floor: 1, surface: 70,  status: "occupé",  tenant: "Horizon Avocats",       rent: 5200,  charges: 780  },
      { id: "l023", ref: "2.01",   type: "bureau",   floor: 2, surface: 70,  status: "occupé",  tenant: "Agence Digital+",       rent: 5200,  charges: 780  },
      { id: "l024", ref: "3.01",   type: "bureau",   floor: 3, surface: 70,  status: "occupé",  tenant: "Études & Patrimoine",   rent: 5200,  charges: 780  },
      { id: "l025", ref: "4.01",   type: "cowork",   floor: 4, surface: 180, status: "occupé",  tenant: "WeWork Opéra",          rent: 12000, charges: 1800 },
    ],
  },
  {
    id: "b4",
    nom: "Résidence Lumière",
    adresse: "44 Av. de Wagram, 75017 Paris",
    image: "https://images.unsplash.com/photo-1554435493-93422e8220c8?w=800&auto=format&fit=crop",
    floors: 6,
    year: 2008,
    subAdmin: "Sofia L.",
    mapX: 32,
    mapY: 23,
    locals: [
      { id: "l026", ref: "1.01", type: "bureau",   floor: 1, surface: 65, status: "occupé",  tenant: "Forge Médias SARL",     rent: 6400,  charges: 960 },
      { id: "l027", ref: "1.02", type: "bureau",   floor: 1, surface: 65, status: "travaux", tenant: null,                    rent: 6400,  charges: 960 },
      { id: "l028", ref: "2.01", type: "bureau",   floor: 2, surface: 65, status: "occupé",  tenant: "Pivot Conseil",         rent: 5800,  charges: 870 },
      { id: "l029", ref: "2.02", type: "bureau",   floor: 2, surface: 65, status: "occupé",  tenant: "Studio Wagram",         rent: 5800,  charges: 870 },
      { id: "l030", ref: "3.01", type: "opensp",   floor: 3, surface: 180,status: "occupé",  tenant: "Lumière Cowork Hub",    rent: 12000, charges: 1800 },
      { id: "l031", ref: "4.01", type: "bureau",   floor: 4, surface: 70, status: "libre",   tenant: null,                    rent: 6200,  charges: 930 },
      { id: "l032", ref: "5.01", type: "bureau",   floor: 5, surface: 70, status: "occupé",  tenant: "BTP Wagram SARL",      rent: 6200,  charges: 930 },
      { id: "l033", ref: "P.01", type: "parking",  floor:-1, surface: 15, status: "occupé",  tenant: "(réservé 3.01)",        rent: 200,   charges: 0   },
    ],
  },
  {
    id: "b5",
    nom: "Cours Saint-Michel",
    adresse: "21 Bd Saint-Michel, 75005 Paris",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop",
    floors: 4,
    year: 2005,
    subAdmin: "Sofia L.",
    mapX: 49,
    mapY: 53,
    locals: [
      { id: "l034", ref: "RDC.01", type: "commerce", floor: 0, surface: 80,  status: "occupé",  tenant: "Librairie Quartier Latin", rent: 5200, charges: 780 },
      { id: "l035", ref: "1.01",   type: "bureau",   floor: 1, surface: 55,  status: "occupé",  tenant: "Association Horizon",       rent: 2850, charges: 430 },
      { id: "l036", ref: "1.02",   type: "bureau",   floor: 1, surface: 55,  status: "libre",   tenant: null,                        rent: 2850, charges: 430 },
      { id: "l037", ref: "2.01",   type: "bureau",   floor: 2, surface: 55,  status: "occupé",  tenant: "Lumen Conseil",             rent: 4280, charges: 642 },
      { id: "l038", ref: "2.02",   type: "salle",    floor: 2, surface: 35,  status: "occupé",  tenant: "(mutualisée)",              rent: 1800, charges: 270 },
      { id: "l039", ref: "3.01",   type: "bureau",   floor: 3, surface: 55,  status: "réservé", tenant: "(dossier en cours)",        rent: 2850, charges: 430 },
    ],
  },
  {
    id: "b6",
    nom: "Le Hangar Bastille",
    adresse: "8 Rue de la Roquette, 75011 Paris",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop",
    floors: 3,
    year: 2018,
    subAdmin: "Yacine T.",
    mapX: 62,
    mapY: 45,
    locals: [
      { id: "l040", ref: "1.N",  type: "cowork",   floor: 1, surface: 280, status: "occupé",  tenant: "Kaizen Coworking SAS",  rent: 18950, charges: 2843 },
      { id: "l041", ref: "1.S",  type: "opensp",   floor: 1, surface: 180, status: "occupé",  tenant: "Volta Architectes",     rent: 9800,  charges: 1470 },
      { id: "l042", ref: "2.01", type: "bureau",   floor: 2, surface: 70,  status: "occupé",  tenant: "Maison Riad Studio",    rent: 5200,  charges: 780  },
      { id: "l043", ref: "2.02", type: "bureau",   floor: 2, surface: 70,  status: "libre",   tenant: null,                    rent: 5200,  charges: 780  },
      { id: "l044", ref: "2.03", type: "bureau",   floor: 2, surface: 70,  status: "occupé",  tenant: "Forge Médias SARL",     rent: 5200,  charges: 780  },
      { id: "l045", ref: "3.01", type: "salle",    floor: 3, surface: 80,  status: "occupé",  tenant: "(mutualisée)",          rent: 4000,  charges: 600  },
      { id: "l046", ref: "P.01", type: "parking",  floor: -1,surface: 15,  status: "occupé",  tenant: "(réservé 1.N)",         rent: 250,   charges: 0    },
    ],
  },
];
