/**
 * Mock data — Documents réalistes pour Document Office Solution
 * Factures fournisseurs, factures clients, CR réunions, documents administratifs
 */

import type { Document, Folder } from "@/types/database";

/* ─── IDs dossiers ────────────────────────────────────────────────────── */

export const FOLDER_IDS = {
  facturesFournisseurs: "fold-fournisseurs",
  facturesClients: "fold-clients",
  reunions: "fold-reunions",
  comptabilite: "fold-compta",
  administration: "fold-admin",
} as const;

/* ─── Dossiers ────────────────────────────────────────────────────────── */

export const MOCK_FOLDERS: Folder[] = [
  {
    id: FOLDER_IDS.facturesFournisseurs,
    tenantId: "t1",
    name: "Factures Fournisseurs",
    path: "/Factures Fournisseurs",
    color: "#3b82f6",
    icon: "receipt",
    createdBy: "u1",
    createdAt: "2025-10-01T09:00:00.000Z",
  },
  {
    id: FOLDER_IDS.facturesClients,
    tenantId: "t1",
    name: "Factures Clients",
    path: "/Factures Clients",
    color: "#10b981",
    icon: "file-text",
    createdBy: "u1",
    createdAt: "2025-10-01T09:01:00.000Z",
  },
  {
    id: FOLDER_IDS.reunions,
    tenantId: "t1",
    name: "Réunions",
    path: "/Réunions",
    color: "#8b5cf6",
    icon: "users",
    createdBy: "u1",
    createdAt: "2025-10-01T09:02:00.000Z",
  },
  {
    id: FOLDER_IDS.comptabilite,
    tenantId: "t1",
    name: "Comptabilité",
    path: "/Comptabilité",
    color: "#f59e0b",
    icon: "calculator",
    createdBy: "u1",
    createdAt: "2025-10-01T09:03:00.000Z",
  },
  {
    id: FOLDER_IDS.administration,
    tenantId: "t1",
    name: "Administration",
    path: "/Administration",
    color: "#6366f1",
    icon: "folder-lock",
    createdBy: "u1",
    createdAt: "2025-10-01T09:04:00.000Z",
  },
];

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function id() {
  return Math.random().toString(36).slice(2, 10);
}

/** PDF minimal embarqué pour tester le viewer embed */
const SAMPLE_PDF_DATA_URL = "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCgoyIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iagoKMyAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDIgMCBSIC9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCiAgIC9Db250ZW50cyA0IDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA1IDAgUiA+PiA+PiA+PgplbmRvYmoKCjQgMCBvYmoKPDwgL0xlbmd0aCA0MjAgPj4Kc3RyZWFtCkJUCi9GMSAxOCBUZgo1MCA3ODAgVGQKKEZBQ1RVUkUgTi4gRE9TLUZBQy0yMDI2LTAwNTApIFRqCjAgLTMwIFRkCi9GMSAxMiBUZgooRG9jdW1lbnQgT2ZmaWNlIFNvbHV0aW9uIC0gU0FTKSBUagowIC0xOCBUZAooQkFUSU1FTlQgQiAtIDE2IFJVRSBEVSBHT0xGLCAyMTgwMCBRVUVUSUdOWSkgVGoKMCAtMzAgVGQKL0YxIDE0IFRmCihGQUNUVVJFIEEgOiBCcmFzc2VyaWUgZHUgTGFjIFNBUkwpIFRqCjAgLTE4IFRkCi9GMSAxMiBUZgooMTIgUm91dGUgZHUgTGFjLCAyMTAwMCBESUpPTikgVGoKMCAtMzAgVGQKKERhdGUgOiAyMDI2LTA0LTEwKSBUagowIC0zMCBUZAooTWlzZSBlbiBwbGFjZSBHRUQgLi4uLi4uLi4uLi4uIDggNTAwLDAwIEVVUiBIVCkgVGoKMCAtMTggVGQKKEZvcm1hdGlvbiBlcXVpcGUgLi4uLi4uLi4uLi4uLiAxIDIwMCwwMCBFVVIgSFQpIFRqCjAgLTMwIFRkCi9GMSAxNCBUZgooVE9UQUwgVFRDIDogMTEgNjQwLDAwIEVVUikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKNSAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCgp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNjYgMDAwMDAgbiAKMDAwMDAwMDczOCAwMDAwMCBuIAoKdHJhaWxlcgo8PCAvU2l6ZSA2IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgo4MTkKJSVFT0Y=";

function dateISO(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function dateShort(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

/* ─── Factures Fournisseurs ───────────────────────────────────────────── */

const facturesFournisseurs: Document[] = [
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Google Ireland - Google Workspace Business.pdf",
    originalName: "GOOGLE-INV-2026-03.pdf",
    mimeType: "application/pdf",
    sizeBytes: 145_200,
    storagePath: "/vault/google-ws-03",
    version: 1,
    ocrStatus: "completed",
    ocrText: `INVOICE #GWS-2026-8841

Google Ireland Limited
Gordon House, Barrow Street, Dublin 4, Ireland
VAT: IE6388047V

BILL TO:
Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF
21800 QUETIGNY — FRANCE

Date: ${dateShort(8)}

DESCRIPTION                                     QTY    UNIT PRICE    TOTAL
────────────────────────────────────────────────────────────────────────────────
Google Workspace Business Standard — 5 users     5      €11.50/mo     €57.50
Google Workspace storage add-on (2TB)             1      €8.00/mo       €8.00
Google Voice Standard — 2 users                   2      €10.00/mo     €20.00
────────────────────────────────────────────────────────────────────────────────
                                        SUBTOTAL :                    €85.50
                                        VAT (23%) :                   €19.67
                                        TOTAL    :                   €105.17

Paid via credit card ending 7821.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Google Ireland Limited",
      adresse: "Gordon House, Barrow Street, Dublin 4, Ireland",
      numero: "GWS-2026-8841",
      date: dateShort(8),
      montantHT: 85.50,
      tva: 19.67,
      montantTTC: 105.17,
      objet: "Google Workspace Business Standard + stockage + Voice",
    },
    tags: ["bureautique", "Google", "email", "cloud", "messagerie", "abonnement"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(8),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Microsoft Ireland - Microsoft 365 Business.pdf",
    originalName: "MS365-INV-2026-03.pdf",
    mimeType: "application/pdf",
    sizeBytes: 167_400,
    storagePath: "/vault/ms365-03",
    version: 1,
    ocrStatus: "completed",
    ocrText: `INVOICE #MSI-2026-4721

Microsoft Ireland Operations Limited
One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Ireland

BILL TO:
Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY, FR

Date: ${dateShort(5)}

DESCRIPTION                                     QTY    UNIT PRICE    TOTAL
────────────────────────────────────────────────────────────────────────────────
Microsoft 365 Business Standard — 5 licences     5      €11.70/mo     €58.50
Microsoft Defender for Business                   5       €3.00/mo     €15.00
────────────────────────────────────────────────────────────────────────────────
                                        SUBTOTAL :                    €73.50
                                        VAT (23%) :                   €16.91
                                        TOTAL    :                    €90.41

Payment via SEPA direct debit.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Microsoft Ireland Operations Limited",
      adresse: "One Microsoft Place, Dublin 18, Ireland",
      numero: "MSI-2026-4721",
      date: dateShort(5),
      montantHT: 73.50,
      tva: 16.91,
      montantTTC: 90.41,
      objet: "Microsoft 365 Business Standard + Defender (5 licences)",
    },
    tags: ["bureautique", "Microsoft", "Office", "email", "sécurité", "abonnement"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(5),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Orange Business - Fibre Pro + Mobile.pdf",
    originalName: "ORANGE-FAC-2026-03.pdf",
    mimeType: "application/pdf",
    sizeBytes: 234_800,
    storagePath: "/vault/orange-03",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° OBS-2026-7812934

Orange Business
1 Avenue du Président Nelson Mandela, 94110 ARCUEIL
SIRET : 380 129 866 04781
TVA : FR44380129866

CLIENT :
Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY
Réf. client : PRO-210800-4521

Date : ${dateShort(3)}
Période : Mars 2026

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Fibre Pro — Débit symétrique 1 Gbps              1       89,00 €       89,00 €
IP fixe professionnelle                           1       10,00 €       10,00 €
Forfait mobile Pro 5G — 100Go (Valentin)         1       35,00 €       35,00 €
Forfait mobile Pro 5G — 100Go (Thomas)           1       35,00 €       35,00 €
Forfait mobile Pro 5G — 60Go (Emma)              1       29,00 €       29,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                   198,00 €
                                        TVA 20%  :                    39,60 €
                                        TOTAL TTC :                  237,60 €

Prélèvement automatique SEPA le 05 du mois.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Orange Business",
      adresse: "1 Avenue du Président Nelson Mandela, 94110 ARCUEIL",
      numero: "OBS-2026-7812934",
      date: dateShort(3),
      montantHT: 198,
      tva: 39.60,
      montantTTC: 237.60,
      objet: "Fibre Pro 1 Gbps + 3 forfaits mobiles Pro 5G",
    },
    tags: ["télécom", "Orange", "fibre", "mobile", "internet", "forfait"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(3),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture EDF Entreprises - Electricité bureaux.pdf",
    originalName: "EDF-FAC-2026-03.pdf",
    mimeType: "application/pdf",
    sizeBytes: 198_300,
    storagePath: "/vault/edf-03",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° EDF-ENT-2026-892341

EDF Entreprises
22-30 Avenue de Wagram, 75008 PARIS
SIRET : 552 081 317 23456
TVA : FR03552081317

CLIENT :
Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY
Réf. contrat : PRO-BFC-78231

Date : ${dateShort(10)}
Période : 01/03/2026 — 31/03/2026

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Abonnement Tarif Bleu Pro                         1       32,45 €       32,45 €
Consommation : 1 240 kWh                       1240       0,1842 €     228,41 €
Contribution tarifaire d'acheminement             1       18,72 €       18,72 €
TURPE (transport)                                 1       12,30 €       12,30 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                   291,88 €
                                        TVA 20%  :                    58,38 €
                                        TOTAL TTC :                  350,26 €

Prélèvement automatique le 15 du mois.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "EDF Entreprises",
      adresse: "22-30 Avenue de Wagram, 75008 PARIS",
      numero: "EDF-ENT-2026-892341",
      date: dateShort(10),
      montantHT: 291.88,
      tva: 58.38,
      montantTTC: 350.26,
      objet: "Électricité bureaux — mars 2026 (1 240 kWh)",
    },
    tags: ["énergie", "électricité", "EDF", "charges", "bureaux"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(10),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Lyreco - Fournitures de bureau.pdf",
    originalName: "LYR-FAC-2026-18923.pdf",
    mimeType: "application/pdf",
    sizeBytes: 287_600,
    storagePath: "/vault/lyreco-18923",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° LYR-2026-18923

Lyreco France SAS
Rue du 19 Mars 1962, 59770 MARLY
SIRET : 342 376 332 01234
TVA : FR78342376332

LIVRÉ À :
Document Office Solution
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

Date : ${dateShort(15)}
N° commande : WEB-892134

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Ramettes papier A4 80g Navigator (carton 5x500)   3       24,90 €       74,70 €
Cartouche toner HP 207X noir                      2       89,90 €      179,80 €
Cartouche toner HP 207A couleur (pack CMY)        1      149,90 €      149,90 €
Stylos Pilot G2 noir (boîte 12)                   2        9,50 €       19,00 €
Post-it 76x76mm jaune (lot 12 blocs)              2        8,90 €       17,80 €
Classeurs à levier A4 dos 80mm (lot 10)           1       29,90 €       29,90 €
Chemises à rabats A4 carte 300g (lot 50)          1       18,50 €       18,50 €
Agrafeuse Rapid F30 + agrafes                     1       23,90 €       23,90 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                   513,50 €
                                        TVA 20%  :                   102,70 €
                                        TOTAL TTC :                  616,20 €

Paiement sous 30 jours.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Lyreco France SAS",
      adresse: "Rue du 19 Mars 1962, 59770 MARLY",
      numero: "LYR-2026-18923",
      date: dateShort(15),
      montantHT: 513.50,
      tva: 102.70,
      montantTTC: 616.20,
      objet: "Fournitures de bureau — papier, toner, classeurs, stylos",
    },
    tags: ["fournitures", "bureau", "papier", "toner", "Lyreco", "consommables"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(15),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Imprimerie Dijonnaise - Cartes de visite + plaquettes.pdf",
    originalName: "IMPD-FAC-2026-0341.pdf",
    mimeType: "application/pdf",
    sizeBytes: 198_700,
    storagePath: "/vault/impd-0341",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° IMPD-FAC-2026-0341

Imprimerie Dijonnaise — SARL
27 Rue des Forges, 21000 DIJON
SIRET : 423 891 234 00019
TVA : FR12423891234

FACTURÉ À :
Document Office Solution
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

Date : ${dateShort(20)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Cartes de visite recto/verso 350g mat (500 ex.)   3       45,00 €      135,00 €
Plaquette commerciale A4 3 volets (200 ex.)       1      380,00 €      380,00 €
Chemises à rabats personnalisées A4 (100 ex.)     1      290,00 €      290,00 €
Bloc-notes entête A5 (10 blocs x 50 feuilles)    1       85,00 €       85,00 €
Frais de maquette et BAT                          1       60,00 €       60,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                   950,00 €
                                        TVA 20%  :                   190,00 €
                                        TOTAL TTC :                1 140,00 €

Paiement sous 15 jours. RIB joint.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Imprimerie Dijonnaise",
      adresse: "27 Rue des Forges, 21000 DIJON",
      numero: "IMPD-FAC-2026-0341",
      date: dateShort(20),
      montantHT: 950,
      tva: 190,
      montantTTC: 1140,
      objet: "Cartes de visite, plaquettes commerciales, chemises, bloc-notes",
    },
    tags: ["impression", "imprimerie", "cartes de visite", "plaquettes", "communication"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(20),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Manpower - Intérim assistante administrative.pdf",
    originalName: "MAN-FAC-2026-7234.pdf",
    mimeType: "application/pdf",
    sizeBytes: 312_500,
    storagePath: "/vault/manpower-7234",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° MAN-FAC-2026-7234

Manpower France SAS
13 Rue Carnot, 21000 DIJON
SIRET : 422 234 567 08912
TVA : FR89422234567

FACTURÉ À :
Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

Date : ${dateShort(7)}
Période : Mars 2026

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Mise à disposition assistante administrative
  Mme Claire DUPONT — 35h/semaine                 4 sem   920,00 €    3 680,00 €
Coefficient de facturation (1.95)                                     3 506,00 €
Indemnités de fin de mission (IFM 10%)                                  368,00 €
Indemnités compensatrices de congés payés (10%)                         368,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :               7 922,00 €
                                        TVA 20%  :               1 584,40 €
                                        TOTAL TTC :              9 506,40 €

Paiement sous 30 jours fin de mois.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Manpower France SAS",
      adresse: "13 Rue Carnot, 21000 DIJON",
      numero: "MAN-FAC-2026-7234",
      date: dateShort(7),
      montantHT: 7922,
      tva: 1584.40,
      montantTTC: 9506.40,
      objet: "Intérim assistante administrative — mars 2026",
    },
    tags: ["intérim", "Manpower", "ressources humaines", "assistante", "personnel"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(7),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Boulanger Pro - Matériel informatique.pdf",
    originalName: "BPRO-FAC-2026-4512.pdf",
    mimeType: "application/pdf",
    sizeBytes: 245_100,
    storagePath: "/vault/bpro-4512",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° BPRO-2026-4512

Boulanger Pro — Groupe Mulliez
Avenue de la Fosse aux Chênes, 59491 VILLENEUVE-D'ASCQ
SIRET : 347 384 925 00789

LIVRÉ À :
Document Office Solution — BATIMENT B
16 RUE DU GOLF, 21800 QUETIGNY

Date : ${dateShort(35)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
MacBook Pro 14" M3 Pro — 18Go RAM / 512Go        1    1 832,50 €    1 832,50 €
Dell UltraSharp U2723QE 27" 4K USB-C             2      445,83 €      891,66 €
Logitech MX Master 3S                             3       83,25 €      249,75 €
Logitech MX Keys S                                3       91,58 €      274,74 €
Hub USB-C Anker PowerExpand 8-en-1                2       54,16 €      108,32 €
Câble USB-C Thunderbolt 4 (2m)                    3       29,08 €       87,24 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :               3 444,21 €
                                        TVA 20%  :                 688,84 €
                                        TOTAL TTC :              4 133,05 €

Paiement comptant par virement.
Garantie 3 ans pièces et main d'œuvre.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Boulanger Pro",
      adresse: "Avenue de la Fosse aux Chênes, 59491 VILLENEUVE-D'ASCQ",
      numero: "BPRO-2026-4512",
      date: dateShort(35),
      montantHT: 3444.21,
      tva: 688.84,
      montantTTC: 4133.05,
      objet: "MacBook Pro + écrans Dell 4K + périphériques Logitech",
    },
    tags: ["informatique", "matériel", "MacBook", "écran", "équipement", "immobilisation"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(35),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Sodexo - Titres-restaurant mars 2026.pdf",
    originalName: "SODEXO-FAC-2026-03.pdf",
    mimeType: "application/pdf",
    sizeBytes: 134_200,
    storagePath: "/vault/sodexo-03",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° SOD-2026-BFC-8912

Sodexo Pass France
19 Rue Ernest Renan, 92130 ISSY-LES-MOULINEAUX
SIRET : 340 393 065 00123
TVA : FR67340393065

CLIENT :
Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

Date : ${dateShort(6)}
Mois de référence : Mars 2026

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Titres-restaurant dématérialisés (valeur 9,00€)
  Part employeur (60%) : 5,40 €/titre
  — Valentin Louot                               22       5,40 €      118,80 €
  — Thomas Bernard                               21       5,40 €      113,40 €
  — Emma Dubois                                  22       5,40 €      118,80 €
  — Lucas Martin                                 20       5,40 €      108,00 €
  — Léa Rousseau                                 22       5,40 €      118,80 €
Frais de gestion mensuels                         5       3,50 €       17,50 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                   595,30 €
                                        TVA 5.5% :                    32,74 €
                                        TOTAL TTC :                  628,04 €

Prélèvement SEPA le 10 du mois suivant.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Sodexo Pass France",
      adresse: "19 Rue Ernest Renan, 92130 ISSY-LES-MOULINEAUX",
      numero: "SOD-2026-BFC-8912",
      date: dateShort(6),
      montantHT: 595.30,
      tva: 32.74,
      montantTTC: 628.04,
      objet: "Titres-restaurant dématérialisés — 5 salariés — mars 2026",
    },
    tags: ["titres-restaurant", "Sodexo", "avantages", "salariés", "social"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(6),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture SAUR - Eau bureaux Q1 2026.pdf",
    originalName: "SAUR-FAC-2026-Q1.pdf",
    mimeType: "application/pdf",
    sizeBytes: 156_800,
    storagePath: "/vault/saur-q1",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° SAUR-2026-210800-4521

SAUR — Agence Côte-d'Or
15 Rue de la Maladière, 21000 DIJON
SIRET : 339 379 984 01234

CLIENT :
Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY
Compteur : 210800-78912

Date : ${dateShort(12)}
Période : Janvier — Mars 2026

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Abonnement trimestriel                            1       42,50 €       42,50 €
Consommation eau : 18 m³                         18        3,85 €       69,30 €
Assainissement collectif                         18        2,12 €       38,16 €
Redevance pollution domestique                   18        0,34 €        6,12 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                   156,08 €
                                        TVA 5.5% :                     8,58 €
                                        TOTAL TTC :                  164,66 €`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "SAUR — Agence Côte-d'Or",
      adresse: "15 Rue de la Maladière, 21000 DIJON",
      numero: "SAUR-2026-210800-4521",
      date: dateShort(12),
      montantHT: 156.08,
      tva: 8.58,
      montantTTC: 164.66,
      objet: "Eau + assainissement bureaux — Q1 2026 (18 m³)",
    },
    tags: ["eau", "assainissement", "charges", "bureaux", "SAUR"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(12),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Ménage Express 21 - Nettoyage bureaux mars.pdf",
    originalName: "ME21-FAC-2026-03.pdf",
    mimeType: "application/pdf",
    sizeBytes: 112_400,
    storagePath: "/vault/me21-03",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° ME21-2026-0387

Ménage Express 21 — SARL
8 Rue des Perrières, 21800 QUETIGNY
SIRET : 891 234 567 00012
TVA : FR45891234567

FACTURÉ À :
Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

Date : ${dateShort(2)}
Période : Mars 2026

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Nettoyage bureaux 120m² (3x/semaine)            12 pass.  35,00 €      420,00 €
Nettoyage vitres intérieures/extérieures          1       85,00 €       85,00 €
Fourniture produits d'entretien                   1       32,00 €       32,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                   537,00 €
                                        TVA 20%  :                   107,40 €
                                        TOTAL TTC :                  644,40 €

Paiement sous 15 jours.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Ménage Express 21",
      adresse: "8 Rue des Perrières, 21800 QUETIGNY",
      numero: "ME21-2026-0387",
      date: dateShort(2),
      montantHT: 537,
      tva: 107.40,
      montantTTC: 644.40,
      objet: "Nettoyage bureaux 3x/semaine + vitres + produits — mars 2026",
    },
    tags: ["nettoyage", "entretien", "bureaux", "ménage", "prestation"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(2),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Loyer bureaux - SCI Les Golfs.pdf",
    originalName: "SCI-GOLFS-FAC-2026-03.pdf",
    mimeType: "application/pdf",
    sizeBytes: 189_300,
    storagePath: "/vault/sci-golfs-03",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE / APPEL DE LOYER N° SCI-2026-03

SCI Les Golfs
16 Rue du Golf, 21800 QUETIGNY
SIRET : 512 345 678 00015
TVA : FR89512345678

LOCATAIRE :
Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY
Bail commercial n° BC-2024-017

Date : ${dateShort(1)}
Période : Avril 2026

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Loyer bureaux — 120 m² (Bâtiment B, RDC)         1    1 450,00 €    1 450,00 €
Charges locatives (provision)                     1      280,00 €      280,00 €
Taxe foncière (provision mensuelle)               1      145,00 €      145,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :               1 875,00 €
                                        TVA 20%  :                 375,00 €
                                        TOTAL TTC :              2 250,00 €

Virement bancaire au 1er du mois.
RIB : FR76 3000 4028 7100 0123 4567 891`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "SCI Les Golfs",
      adresse: "16 Rue du Golf, 21800 QUETIGNY",
      numero: "SCI-2026-03",
      date: dateShort(1),
      montantHT: 1875,
      tva: 375,
      montantTTC: 2250,
      objet: "Loyer bureaux 120 m² + charges + taxe foncière — avril 2026",
    },
    tags: ["loyer", "bail", "bureaux", "charges", "immobilier", "SCI"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(1),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture LDLC Pro - Serveur NAS + disques.pdf",
    originalName: "LDLC-FAC-2026-891234.pdf",
    mimeType: "application/pdf",
    sizeBytes: 213_400,
    storagePath: "/vault/ldlc-891234",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° LDLC-PRO-2026-891234

LDLC.com — LDLC Pro
2 Rue des Érables, 69760 LIMONEST
SIRET : 403 554 181 00234
TVA : FR73403554181

LIVRÉ À :
Document Office Solution — BATIMENT B
16 RUE DU GOLF, 21800 QUETIGNY

Date : ${dateShort(42)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Synology DS923+ NAS 4 baies                       1      487,50 €      487,50 €
Seagate IronWolf Pro 8 To NAS (ST8000NE001)      4      199,17 €      796,68 €
Mémoire DDR4 ECC 16 Go Synology                   1       74,17 €       74,17 €
Câble Ethernet Cat6a 3m (lot 2)                   1       12,42 €       12,42 €
Onduleur Eaton 5E 850i USB                        1      104,17 €      104,17 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :               1 474,94 €
                                        TVA 20%  :                 294,99 €
                                        TOTAL TTC :              1 769,93 €

Paiement comptant. Garantie constructeur.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "LDLC Pro",
      adresse: "2 Rue des Érables, 69760 LIMONEST",
      numero: "LDLC-PRO-2026-891234",
      date: dateShort(42),
      montantHT: 1474.94,
      tva: 294.99,
      montantTTC: 1769.93,
      objet: "NAS Synology DS923+ + 4 disques 8 To + onduleur",
    },
    tags: ["informatique", "NAS", "stockage", "serveur", "Synology", "immobilisation"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(42),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Norauto Fleet - Entretien véhicule société.pdf",
    originalName: "NORAUTO-FAC-2026-5612.pdf",
    mimeType: "application/pdf",
    sizeBytes: 178_600,
    storagePath: "/vault/norauto-5612",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° NOR-2026-5612

Norauto — Centre de Quetigny
Zone Commerciale Cap Vert, 21800 QUETIGNY
SIRET : 325 198 456 03456

VÉHICULE :
Peugeot 308 SW — EX-234-FG
Document Office Solution — SAS

Date : ${dateShort(18)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Révision complète (vidange + filtres)             1      189,00 €      189,00 €
Huile moteur Total Quartz 5W-30 (5L)             1       42,00 €       42,00 €
Plaquettes de frein avant                         1       87,00 €       87,00 €
Contrôle géométrie + parallélisme                 1       59,00 €       59,00 €
Main d'œuvre (2h)                                 2       55,00 €      110,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                   487,00 €
                                        TVA 20%  :                    97,40 €
                                        TOTAL TTC :                  584,40 €

Paiement comptant par carte bancaire.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Norauto — Centre de Quetigny",
      adresse: "Zone Commerciale Cap Vert, 21800 QUETIGNY",
      numero: "NOR-2026-5612",
      date: dateShort(18),
      montantHT: 487,
      tva: 97.40,
      montantTTC: 584.40,
      objet: "Révision complète Peugeot 308 SW + plaquettes freins",
    },
    tags: ["véhicule", "entretien", "automobile", "Norauto", "révision", "flotte"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(18),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture La Poste - Affranchissement + Colissimo.pdf",
    originalName: "LAPOSTE-FAC-2026-03.pdf",
    mimeType: "application/pdf",
    sizeBytes: 123_400,
    storagePath: "/vault/laposte-03",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° LP-PRO-2026-BFC-4521

La Poste — Solutions Business
9 Rue du Colonel Rol-Tanguy, 93100 MONTREUIL
SIRET : 356 000 000 48231

CLIENT :
Document Office Solution — SAS
Compte Pro n° PRO-2108-789

Date : ${dateShort(9)}
Période : Mars 2026

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Machine à affranchir — location mensuelle         1       45,00 €       45,00 €
Recharge affranchissement                         1      150,00 €      150,00 €
Colissimo entreprise (12 envois)                 12        6,80 €       81,60 €
Lettre recommandée AR (8 envois)                  8        5,92 €       47,36 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                   323,96 €
                                        TVA 20%  :                    64,79 €
                                        TOTAL TTC :                  388,75 €`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "La Poste — Solutions Business",
      adresse: "9 Rue du Colonel Rol-Tanguy, 93100 MONTREUIL",
      numero: "LP-PRO-2026-BFC-4521",
      date: dateShort(9),
      montantHT: 323.96,
      tva: 64.79,
      montantTTC: 388.75,
      objet: "Affranchissement + Colissimo + recommandés — mars 2026",
    },
    tags: ["courrier", "La Poste", "affranchissement", "Colissimo", "envoi"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(9),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Cabinet Maître Renaud - Conseil juridique.pdf",
    originalName: "RENAUD-FAC-2026-018.pdf",
    mimeType: "application/pdf",
    sizeBytes: 198_200,
    storagePath: "/vault/renaud-018",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° REN-2026-018

Cabinet Maître Renaud — Avocat au Barreau de Dijon
34 Boulevard de Brosses, 21000 DIJON
SIRET : 478 912 345 00021
TVA : FR12478912345

FACTURÉ À :
Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

Date : ${dateShort(25)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Rédaction CGV v2.1                                1      800,00 €      800,00 €
Rédaction DPA (Data Processing Agreement)         1      600,00 €      600,00 €
Revue contrat de prestation type                  1      450,00 €      450,00 €
Consultation RGPD — conformité plateforme         2h     250,00 €      500,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :               2 350,00 €
                                        TVA 20%  :                 470,00 €
                                        TOTAL TTC :              2 820,00 €

Paiement sous 30 jours.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Cabinet Maître Renaud",
      adresse: "34 Boulevard de Brosses, 21000 DIJON",
      numero: "REN-2026-018",
      date: dateShort(25),
      montantHT: 2350,
      tva: 470,
      montantTTC: 2820,
      objet: "Rédaction CGV, DPA, contrat type + consultation RGPD",
    },
    tags: ["avocat", "juridique", "CGV", "RGPD", "contrat", "DPA"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(25),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Leaseplan - Location Peugeot 308 SW.pdf",
    originalName: "LP-FAC-2026-03.pdf",
    mimeType: "application/pdf",
    sizeBytes: 176_500,
    storagePath: "/vault/leaseplan-03",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° LPF-2026-BFC-3891

LeasePlan France SAS
1-3 Rue Colonel Pierre Avia, 75015 PARIS
SIRET : 313 606 203 00567
TVA : FR28313606203

CLIENT :
Document Office Solution — SAS
Contrat n° LOA-2025-8912

Date : ${dateShort(4)}
Période : Avril 2026

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Peugeot 308 SW GT 1.5 BlueHDi 130
  Location longue durée (48 mois / 25 000 km/an)  1      395,00 €      395,00 €
Assurance tous risques incluse                     1       65,00 €       65,00 €
Assistance 24h/24                                  1       12,00 €       12,00 €
Pneumatiques inclus                                1       18,00 €       18,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                   490,00 €
                                        TVA 20%  :                    98,00 €
                                        TOTAL TTC :                  588,00 €

Prélèvement SEPA mensuel.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "LeasePlan France SAS",
      adresse: "1-3 Rue Colonel Pierre Avia, 75015 PARIS",
      numero: "LPF-2026-BFC-3891",
      date: dateShort(4),
      montantHT: 490,
      tva: 98,
      montantTTC: 588,
      objet: "LLD Peugeot 308 SW GT + assurance + assistance — avril 2026",
    },
    tags: ["véhicule", "LLD", "leasing", "Peugeot", "automobile", "LeasePlan"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(4),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Cerfrance - Formation professionnelle.pdf",
    originalName: "CERF-FAC-2026-2341.pdf",
    mimeType: "application/pdf",
    sizeBytes: 198_900,
    storagePath: "/vault/cerf-2341",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° CERF-2026-2341

Cerfrance Bourgogne — Centre de Dijon
5 Rue Pierre de Coubertin, 21000 DIJON
SIRET : 778 912 345 00034
TVA : FR56778912345
N° déclaration activité : 26 21 00891 21

FACTURÉ À :
Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

Date : ${dateShort(30)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Formation "Gestion financière pour dirigeants"
  2 jours — Valentin Louot                        1      890,00 €      890,00 €
Formation "Management d'équipe et leadership"
  1 jour — Valentin Louot                         1      490,00 €      490,00 €
Support pédagogique et attestation                2       25,00 €       50,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :               1 430,00 €
                                        TVA 20%  :                 286,00 €
                                        TOTAL TTC :              1 716,00 €

Convention de formation jointe. Éligible OPCO.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Cerfrance Bourgogne",
      adresse: "5 Rue Pierre de Coubertin, 21000 DIJON",
      numero: "CERF-2026-2341",
      date: dateShort(30),
      montantHT: 1430,
      tva: 286,
      montantTTC: 1716,
      objet: "Formations gestion financière + management — Valentin Louot",
    },
    tags: ["formation", "Cerfrance", "management", "gestion", "OPCO", "dirigeant"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(30),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Bruneau - Mobilier bureau.pdf",
    originalName: "BRUN-FAC-2026-78234.pdf",
    mimeType: "application/pdf",
    sizeBytes: 267_300,
    storagePath: "/vault/bruneau-78234",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° BRUN-2026-78234

JM Bruneau SA
19 Avenue de la Pépinière, 94260 FRESNES
SIRET : 542 065 765 00312
TVA : FR23542065765

LIVRÉ À :
Document Office Solution — BATIMENT B
16 RUE DU GOLF, 21800 QUETIGNY

Date : ${dateShort(55)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Bureau assis-debout électrique 160x80cm           2      449,00 €      898,00 €
Fauteuil ergonomique Steelcase Series 1           2      389,00 €      778,00 €
Caisson mobile 3 tiroirs à clé                    2      159,00 €      318,00 €
Lampe de bureau LED articulée                     2       69,00 €      138,00 €
Tableau blanc magnétique 120x90cm                 1       89,00 €       89,00 €
Livraison et montage                              1      120,00 €      120,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :               2 341,00 €
                                        TVA 20%  :                 468,20 €
                                        TOTAL TTC :              2 809,20 €

Paiement sous 30 jours.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "JM Bruneau SA",
      adresse: "19 Avenue de la Pépinière, 94260 FRESNES",
      numero: "BRUN-2026-78234",
      date: dateShort(55),
      montantHT: 2341,
      tva: 468.20,
      montantTTC: 2809.20,
      objet: "Bureaux assis-debout + fauteuils ergonomiques + mobilier",
    },
    tags: ["mobilier", "bureau", "Bruneau", "ergonomie", "équipement", "immobilisation"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(55),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Valentin Louot - Mission marketing.pdf",
    originalName: "VL-FAC-2026-007.pdf",
    mimeType: "application/pdf",
    sizeBytes: 198_700,
    storagePath: "/vault/vl-007",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° VL-FAC-2026-007

Valentin Louot — Auto-entrepreneur
12 Avenue des Tilleuls, 21000 DIJON
SIRET : 923 456 789 00015

FACTURÉ À :
Document Office Solution
BATIMENT B — 16 RUE DU GOLF
21800 QUETIGNY

Date : ${dateShort(18)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Stratégie marketing digital Q1 2026              1    2 800,00 €    2 800,00 €
Rédaction contenus LinkedIn (12 posts)          12      120,00 €    1 440,00 €
Gestion campagnes Google Ads — mars 2026         1      850,00 €      850,00 €
Création landing page conversion                 1    1 200,00 €    1 200,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :               6 290,00 €
                                     TVA non applicable, art. 293 B du CGI

Paiement sous 15 jours.
IBAN : FR76 2004 1010 1234 5678 9012 345`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Valentin Louot",
      adresse: "12 Avenue des Tilleuls, 21000 DIJON",
      numero: "VL-FAC-2026-007",
      date: dateShort(18),
      montantHT: 6290,
      tva: 0,
      montantTTC: 6290,
      objet: "Marketing digital + contenus LinkedIn + Google Ads + landing page",
    },
    tags: ["marketing", "LinkedIn", "Google Ads", "landing page", "contenu", "freelance"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(18),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture OVHcloud - Hébergement serveur dédié.pdf",
    originalName: "OVH-FR-2026-248912.pdf",
    mimeType: "application/pdf",
    sizeBytes: 245_600,
    storagePath: "/vault/ovh-248912",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° FR-2026-248912

OVHcloud
2 rue Kellermann, 59100 ROUBAIX
SIRET : 424 761 419 00045
TVA : FR22424761419

CLIENT :
Document Office Solution
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY
Réf. client : ns1234567

Date : ${dateShort(3)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Serveur dédié Advance-1 (32Go RAM)               1      89,99 €       89,99 €
Stockage Block Storage 500Go                     1      25,00 €       25,00 €
IP failover x2                                   2       2,00 €        4,00 €
Backup FTP 500Go                                 1       5,00 €        5,00 €
Nom de domaine documentsofficesolutions.fr       1       8,99 €        8,99 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                 132,98 €
                                        TVA 20%  :                  26,60 €
                                        TOTAL TTC :                159,58 €

Prélèvement automatique SEPA.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "OVHcloud",
      adresse: "2 rue Kellermann, 59100 ROUBAIX",
      numero: "FR-2026-248912",
      date: dateShort(3),
      montantHT: 132.98,
      tva: 26.60,
      montantTTC: 159.58,
      objet: "Serveur dédié + stockage + IP failover + backup + domaine",
    },
    tags: ["hébergement", "OVH", "serveur", "infrastructure", "cloud", "domaine"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(3),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Valentin Louot - SEO & contenu.pdf",
    originalName: "VL-FAC-2026-012.pdf",
    mimeType: "application/pdf",
    sizeBytes: 176_400,
    storagePath: "/vault/vl-012",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° VL-FAC-2026-012

Valentin Louot — Auto-entrepreneur
12 Avenue des Tilleuls, 21000 DIJON
SIRET : 923 456 789 00015

FACTURÉ À :
Document Office Solution — BATIMENT B
16 RUE DU GOLF, 21800 QUETIGNY

Date : ${dateShort(40)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Audit SEO technique complet                      1    1 800,00 €    1 800,00 €
Rédaction articles blog (8 articles x 1500 mots) 8     250,00 €    2 000,00 €
Optimisation on-page (20 pages)                 20      75,00 €    1 500,00 €
Rapport mensuel analytics                        1      400,00 €      400,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :               5 700,00 €
                                     TVA non applicable, art. 293 B du CGI`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Valentin Louot",
      adresse: "12 Avenue des Tilleuls, 21000 DIJON",
      numero: "VL-FAC-2026-012",
      date: dateShort(40),
      montantHT: 5700,
      tva: 0,
      montantTTC: 5700,
      objet: "Audit SEO + articles blog + optimisation on-page + analytics",
    },
    tags: ["SEO", "contenu", "blog", "analytics", "optimisation", "marketing digital", "freelance"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(40),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Sécuritas - Alarme et vidéosurveillance.pdf",
    originalName: "SECU-FAC-2026-03.pdf",
    mimeType: "application/pdf",
    sizeBytes: 154_300,
    storagePath: "/vault/securitas-03",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° SEC-2026-BFC-7812

Securitas Direct SAS
Tour Sequoia, 1 Place Carpeaux, 92800 PUTEAUX
SIRET : 345 123 789 00456
TVA : FR78345123789

CLIENT :
Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY
Contrat n° SD-2025-892

Date : ${dateShort(4)}
Période : Avril 2026

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Abonnement télésurveillance 24h/24                1       49,90 €       49,90 €
Maintenance système alarme intrusion              1       15,00 €       15,00 €
Vidéosurveillance 4 caméras — stockage cloud      1       29,90 €       29,90 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                    94,80 €
                                        TVA 20%  :                    18,96 €
                                        TOTAL TTC :                  113,76 €

Prélèvement mensuel SEPA.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Securitas Direct SAS",
      adresse: "Tour Sequoia, 92800 PUTEAUX",
      numero: "SEC-2026-BFC-7812",
      date: dateShort(4),
      montantHT: 94.80,
      tva: 18.96,
      montantTTC: 113.76,
      objet: "Télésurveillance + alarme + vidéosurveillance — avril 2026",
    },
    tags: ["sécurité", "alarme", "vidéosurveillance", "Securitas", "bureaux"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(4),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Total Energies - Carburant mars 2026.pdf",
    originalName: "TOTAL-FAC-2026-03.pdf",
    mimeType: "application/pdf",
    sizeBytes: 98_400,
    storagePath: "/vault/total-03",
    version: 1,
    ocrStatus: "completed",
    ocrText: `RELEVÉ CARTE CARBURANT N° TCF-2026-03-4521

TotalEnergies Marketing France
2 Place Jean Millier, 92078 PARIS LA DÉFENSE
SIRET : 542 034 921 00789

TITULAIRE :
Document Office Solution — SAS
Carte n° 7045 **** **** 3891

Période : Mars 2026

DATE         STATION                       LITRES    PU/L       TOTAL TTC
────────────────────────────────────────────────────────────────────────────────
05/03/2026   Total Quetigny                42,5 L    1,689 €      71,78 €
12/03/2026   Total Dijon Toison d'Or       38,2 L    1,699 €      64,90 €
19/03/2026   Total Chalon-sur-Saône        45,1 L    1,679 €      75,72 €
27/03/2026   Total Quetigny                40,8 L    1,695 €      69,16 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                 234,63 €
                                        TVA 20%  :                  46,93 €
                                        TOTAL TTC :                281,56 €

Prélèvement le 10 du mois suivant.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "TotalEnergies Marketing France",
      adresse: "2 Place Jean Millier, 92078 PARIS LA DÉFENSE",
      numero: "TCF-2026-03-4521",
      date: dateShort(9),
      montantHT: 234.63,
      tva: 46.93,
      montantTTC: 281.56,
      objet: "Carburant véhicule société — mars 2026 (166,6 L)",
    },
    tags: ["carburant", "Total", "véhicule", "essence", "déplacement", "carte"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(9),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesFournisseurs,
    name: "Facture Café Richard - Machine + capsules.pdf",
    originalName: "CR-FAC-2026-891.pdf",
    mimeType: "application/pdf",
    sizeBytes: 87_600,
    storagePath: "/vault/cafe-richard-891",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° CR-2026-891

Cafés Richard
38 Rue Mersenne, 75014 PARIS
SIRET : 582 123 456 00234

LIVRÉ À :
Document Office Solution — BATIMENT B
16 RUE DU GOLF, 21800 QUETIGNY

Date : ${dateShort(14)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Location machine Espresso Perle — mensuel         1       35,00 €       35,00 €
Capsules Espresso Classique (boîte 100)           3       29,00 €       87,00 €
Capsules Décaféiné (boîte 50)                     1       16,50 €       16,50 €
Gobelets carton 15cl (lot 200)                    1       12,80 €       12,80 €
Sucres emballés (lot 500)                         1        8,90 €        8,90 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :                   160,20 €
                                        TVA 20%  :                    32,04 €
                                        TOTAL TTC :                  192,24 €`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Cafés Richard",
      adresse: "38 Rue Mersenne, 75014 PARIS",
      numero: "CR-2026-891",
      date: dateShort(14),
      montantHT: 160.20,
      tva: 32.04,
      montantTTC: 192.24,
      objet: "Location machine café + capsules + consommables",
    },
    tags: ["café", "boissons", "machine", "consommables", "bureaux"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(14),
  },
];

/* ─── Comptabilité & Fiscalité ────────────────────────────────────────── */

const comptabilite: Document[] = [
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.comptabilite,
    name: "Facture Cabinet EXCO - Mission comptable Q1.pdf",
    originalName: "EXCO-FAC-2026-1201.pdf",
    mimeType: "application/pdf",
    sizeBytes: 324_800,
    storagePath: "/vault/exco-1201",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° EXCO-FAC-2026-1201

Cabinet EXCO Bourgogne
3 Boulevard de la Trémouille, 21000 DIJON
SIRET : 312 567 890 00034
TVA : FR67312567890

CLIENT :
Document Office Solution
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

Date : ${dateShort(28)}
Période : Janvier — Mars 2026

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Tenue comptable mensuelle — Q1 2026              3      450,00 €    1 350,00 €
Établissement déclarations TVA (3 mois)          3       80,00 €      240,00 €
Conseil fiscal — optimisation charges            1      350,00 €      350,00 €
Révision comptes trimestrielle                   1      600,00 €      600,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :               2 540,00 €
                                        TVA 20%  :                 508,00 €
                                        TOTAL TTC :              3 048,00 €

Prélèvement SEPA le 10 du mois suivant.`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Cabinet EXCO Bourgogne",
      adresse: "3 Boulevard de la Trémouille, 21000 DIJON",
      numero: "EXCO-FAC-2026-1201",
      date: dateShort(28),
      montantHT: 2540,
      tva: 508,
      montantTTC: 3048,
      objet: "Tenue comptable Q1 + déclarations TVA + conseil fiscal",
    },
    tags: ["comptabilité", "expert-comptable", "TVA", "fiscal", "EXCO", "trimestre"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(28),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.comptabilite,
    name: "Avis CFE 2026 - Document Office Solution.pdf",
    originalName: "CFE-2026-DOS.pdf",
    mimeType: "application/pdf",
    sizeBytes: 412_300,
    storagePath: "/vault/cfe-2026",
    version: 1,
    ocrStatus: "completed",
    ocrText: `AVIS D'IMPOSITION
COTISATION FONCIÈRE DES ENTREPRISES (CFE)
ANNÉE 2026

Direction Générale des Finances Publiques
SIE de DIJON SUD-EST

CONTRIBUABLE :
Document Office Solution — SAS
BATIMENT B, 16 RUE DU GOLF
21800 QUETIGNY

N° SIRET : 912 345 678 00012
Code APE : 6201Z — Programmation informatique

Base d'imposition :                              18 500 €
Taux communal :                                  24,87 %
Cotisation :                                      4 601 €
Frais de gestion :                                   46 €
────────────────────────────────────────────────────────
TOTAL À PAYER :                                   4 647 €

Date limite de paiement : 15/12/2026
Référence : 2026-CFE-210800-9123456`,
    extractedData: {
      type: "facture_fournisseur",
      fournisseur: "Direction Générale des Finances Publiques",
      adresse: "SIE de DIJON SUD-EST",
      numero: "2026-CFE-210800-9123456",
      date: dateShort(60),
      montantHT: 4647,
      tva: 0,
      montantTTC: 4647,
      objet: "Cotisation Foncière des Entreprises (CFE) 2026",
    },
    tags: ["impôt", "CFE", "fiscalité", "collectivité", "taxe professionnelle", "Quetigny"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(60),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.comptabilite,
    name: "Déclaration TVA - Février 2026.pdf",
    originalName: "TVA-CA3-022026.pdf",
    mimeType: "application/pdf",
    sizeBytes: 289_400,
    storagePath: "/vault/tva-022026",
    version: 1,
    ocrStatus: "completed",
    ocrText: `DÉCLARATION DE TVA — CA3
Période : Février 2026

Document Office Solution — SAS
BATIMENT B, 16 RUE DU GOLF, 21800 QUETIGNY
N° TVA : FR45912345678

Chiffre d'affaires HT du mois :                 42 800,00 €

TVA collectée (20%) :                             8 560,00 €
TVA déductible sur biens et services :            3 214,00 €
TVA déductible sur immobilisations :                  0,00 €
────────────────────────────────────────────────────────────
TVA NETTE À PAYER :                               5 346,00 €

Date de dépôt : ${dateShort(35)}
Télérèglement effectué le ${dateShort(34)}`,
    extractedData: {
      type: "administratif",
      fournisseur: "DGFIP — Déclaration TVA",
      numero: "CA3-022026",
      date: dateShort(35),
      montantHT: 42800,
      tva: 5346,
      montantTTC: 5346,
      objet: "Déclaration TVA CA3 — Février 2026",
    },
    tags: ["TVA", "déclaration", "fiscal", "CA3", "DGFIP", "février"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(35),
  },
];

/* ─── Factures Clients ────────────────────────────────────────────────── */

const facturesClients: Document[] = [
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesClients,
    name: "Facture DOS → Maison Lefebvre - Audit documentaire.pdf",
    originalName: "DOS-FAC-2026-0031.pdf",
    mimeType: "application/pdf",
    sizeBytes: 267_800,
    storagePath: "/vault/dos-031",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° DOS-FAC-2026-0031

Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF
21800 QUETIGNY
SIRET : 912 345 678 00012
TVA : FR45912345678

FACTURÉ À :
Maison Lefebvre SARL
45 Rue de la Liberté, 21000 DIJON

Date : ${dateShort(22)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Audit processus documentaire                     3j   1 400,00 €    4 200,00 €
Recommandations + roadmap transformation         1    2 000,00 €    2 000,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :               6 200,00 €
                                        TVA 20%  :               1 240,00 €
                                        TOTAL TTC :              7 440,00 €

Paiement à 30 jours date de facture.`,
    extractedData: {
      type: "facture_client",
      client: "Maison Lefebvre SARL",
      adresse: "45 Rue de la Liberté, 21000 DIJON",
      numero: "DOS-FAC-2026-0031",
      date: dateShort(22),
      montantHT: 6200,
      tva: 1240,
      montantTTC: 7440,
      objet: "Audit processus documentaire & recommandations",
    },
    tags: ["facture client", "audit", "transformation digitale", "GED"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(22),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesClients,
    name: "Facture DOS → BTP Morin - Déploiement GED.pdf",
    originalName: "DOS-FAC-2026-0034.pdf",
    mimeType: "application/pdf",
    sizeBytes: 345_200,
    storagePath: "/vault/dos-034",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° DOS-FAC-2026-0034

Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

FACTURÉ À :
BTP Morin SA
Zone Industrielle Les Granges, 71100 CHALON-SUR-SAÔNE

Date : ${dateShort(10)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Déploiement plateforme GED intelligente          1   15 000,00 €   15 000,00 €
Configuration OCR + extraction automatique       5j   1 200,00 €    6 000,00 €
Formation utilisateurs (2 sessions x 10 pers.)   2    1 800,00 €    3 600,00 €
Support technique — 3 mois inclus                1    2 400,00 €    2 400,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :              27 000,00 €
                                        TVA 20%  :               5 400,00 €
                                        TOTAL TTC :             32 400,00 €

Acompte 40% encaissé. Solde à 30 jours.`,
    extractedData: {
      type: "facture_client",
      client: "BTP Morin SA",
      adresse: "Zone Industrielle Les Granges, 71100 CHALON-SUR-SAÔNE",
      numero: "DOS-FAC-2026-0034",
      date: dateShort(10),
      montantHT: 27000,
      tva: 5400,
      montantTTC: 32400,
      objet: "Déploiement GED + OCR + formation + support",
    },
    tags: ["facture client", "GED", "OCR", "BTP", "formation", "déploiement"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(10),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesClients,
    name: "Facture DOS → Cabinet Droit & Associés - Automatisation.pdf",
    originalName: "DOS-FAC-2026-0037.pdf",
    mimeType: "application/pdf",
    sizeBytes: 234_100,
    storagePath: "/vault/dos-037",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° DOS-FAC-2026-0037

Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

FACTURÉ À :
Cabinet Droit & Associés
28 Place Darcy, 21000 DIJON

Date : ${dateShort(14)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Automatisation traitement courrier entrant       1    8 500,00 €    8 500,00 €
Intégration avec logiciel métier (API custom)    4j   1 100,00 €    4 400,00 €
Maintenance annuelle                             1    3 600,00 €    3 600,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :              16 500,00 €
                                        TVA 20%  :               3 300,00 €
                                        TOTAL TTC :             19 800,00 €`,
    extractedData: {
      type: "facture_client",
      client: "Cabinet Droit & Associés",
      adresse: "28 Place Darcy, 21000 DIJON",
      numero: "DOS-FAC-2026-0037",
      date: dateShort(14),
      montantHT: 16500,
      tva: 3300,
      montantTTC: 19800,
      objet: "Automatisation courrier + intégration API + maintenance",
    },
    tags: ["facture client", "automatisation", "courrier", "juridique", "API", "maintenance"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(14),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesClients,
    name: "Facture DOS → Agence Immo 21 - Chatbot prise de RDV.pdf",
    originalName: "DOS-FAC-2026-0039.pdf",
    mimeType: "application/pdf",
    sizeBytes: 278_900,
    storagePath: "/vault/dos-039",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° DOS-FAC-2026-0039

Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

FACTURÉ À :
Agence Immo 21
15 Rue du Château, 21000 DIJON

Date : ${dateShort(6)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Chatbot conversationnel — prise de RDV           1   12 000,00 €   12 000,00 €
Intégration CRM Immo + agenda                    3j   1 000,00 €    3 000,00 €
Formation équipe commerciale                     1    1 500,00 €    1 500,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :              16 500,00 €
                                        TVA 20%  :               3 300,00 €
                                        TOTAL TTC :             19 800,00 €`,
    extractedData: {
      type: "facture_client",
      client: "Agence Immo 21",
      adresse: "15 Rue du Château, 21000 DIJON",
      numero: "DOS-FAC-2026-0039",
      date: dateShort(6),
      montantHT: 16500,
      tva: 3300,
      montantTTC: 19800,
      objet: "Chatbot conversationnel + intégration CRM + formation",
    },
    tags: ["facture client", "chatbot", "immobilier", "CRM", "formation"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(6),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesClients,
    name: "Facture DOS → Groupe Bourgogne Énergie - Data pipeline.pdf",
    originalName: "DOS-FAC-2026-0041.pdf",
    mimeType: "application/pdf",
    sizeBytes: 312_700,
    storagePath: "/vault/dos-041",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° DOS-FAC-2026-0041

Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

FACTURÉ À :
Groupe Bourgogne Énergie
Parc Technologique, 21800 QUETIGNY

Date : ${dateShort(4)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Pipeline extraction données factures              1   18 000,00 €   18 000,00 €
Dashboard analytics temps réel                   1    9 500,00 €    9 500,00 €
Module de recherche intelligente                  1    7 000,00 €    7 000,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :              34 500,00 €
                                        TVA 20%  :               6 900,00 €
                                        TOTAL TTC :             41 400,00 €`,
    extractedData: {
      type: "facture_client",
      client: "Groupe Bourgogne Énergie",
      adresse: "Parc Technologique, 21800 QUETIGNY",
      numero: "DOS-FAC-2026-0041",
      date: dateShort(4),
      montantHT: 34500,
      tva: 6900,
      montantTTC: 41400,
      objet: "Pipeline extraction + dashboard analytics + recherche intelligente",
    },
    tags: ["facture client", "data", "analytics", "recherche", "énergie"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(4),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesClients,
    name: "Facture DOS → Mairie de Chenôve - Numérisation archives.pdf",
    originalName: "DOS-FAC-2026-0043.pdf",
    mimeType: "application/pdf",
    sizeBytes: 289_400,
    storagePath: "/vault/dos-043",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° DOS-FAC-2026-0043

Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

FACTURÉ À :
Mairie de Chenôve
1 Rue de la Mairie, 21300 CHENÔVE

Date : ${dateShort(16)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Numérisation archives papier (12 000 pages)   12000       0,35 €    4 200,00 €
OCR + indexation automatique                      1    3 500,00 €    3 500,00 €
Mise en ligne sur plateforme GED                  1    2 800,00 €    2 800,00 €
Formation agents municipaux (1 session)           1    1 200,00 €    1 200,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :              11 700,00 €
                                        TVA 20%  :               2 340,00 €
                                        TOTAL TTC :             14 040,00 €`,
    extractedData: {
      type: "facture_client",
      client: "Mairie de Chenôve",
      adresse: "1 Rue de la Mairie, 21300 CHENÔVE",
      numero: "DOS-FAC-2026-0043",
      date: dateShort(16),
      montantHT: 11700,
      tva: 2340,
      montantTTC: 14040,
      objet: "Numérisation 12 000 pages + OCR + GED + formation",
    },
    tags: ["facture client", "numérisation", "archives", "collectivité", "OCR", "formation"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(16),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesClients,
    name: "Facture DOS → Vignobles Durand - GED cave coopérative.pdf",
    originalName: "DOS-FAC-2026-0045.pdf",
    mimeType: "application/pdf",
    sizeBytes: 234_500,
    storagePath: "/vault/dos-045",
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° DOS-FAC-2026-0045

Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

FACTURÉ À :
Vignobles Durand — SCA
Route de Beaune, 21190 MEURSAULT

Date : ${dateShort(8)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Déploiement GED coopérative viticole              1    8 000,00 €    8 000,00 €
Module traçabilité parcellaire                    1    4 500,00 €    4 500,00 €
Intégration logiciel de cave (Isagri)             3j   1 100,00 €    3 300,00 €
Formation viticulteurs (2 sessions terrain)       2      900,00 €    1 800,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :              17 600,00 €
                                        TVA 20%  :               3 520,00 €
                                        TOTAL TTC :             21 120,00 €`,
    extractedData: {
      type: "facture_client",
      client: "Vignobles Durand — SCA",
      adresse: "Route de Beaune, 21190 MEURSAULT",
      numero: "DOS-FAC-2026-0045",
      date: dateShort(8),
      montantHT: 17600,
      tva: 3520,
      montantTTC: 21120,
      objet: "GED viticole + traçabilité parcellaire + intégration Isagri",
    },
    tags: ["facture client", "GED", "viticulture", "traçabilité", "Bourgogne", "formation"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(8),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.facturesClients,
    name: "Facture DOS → Brasserie du Lac - GED + Formation.pdf",
    originalName: "DOS-FAC-2026-0050.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1_042,
    storagePath: "/vault/dos-050",
    previewUrl: SAMPLE_PDF_DATA_URL,
    version: 1,
    ocrStatus: "completed",
    ocrText: `FACTURE N° DOS-FAC-2026-0050

Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

FACTURÉ À :
Brasserie du Lac SARL
12 Route du Lac, 21000 DIJON

Date : ${dateShort(3)}

DÉSIGNATION                                     QTÉ     PU HT        TOTAL HT
────────────────────────────────────────────────────────────────────────────────
Mise en place GED                                 1    8 500,00 €    8 500,00 €
Formation équipe                                  1    1 200,00 €    1 200,00 €
────────────────────────────────────────────────────────────────────────────────
                                        TOTAL HT :               9 700,00 €
                                        TVA 20%  :               1 940,00 €
                                        TOTAL TTC :             11 640,00 €`,
    extractedData: {
      type: "facture_client",
      client: "Brasserie du Lac SARL",
      adresse: "12 Route du Lac, 21000 DIJON",
      numero: "DOS-FAC-2026-0050",
      date: dateShort(3),
      montantHT: 9700,
      tva: 1940,
      montantTTC: 11640,
      objet: "Mise en place GED + formation équipe",
    },
    tags: ["facture client", "GED", "formation", "brasserie", "restauration"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(3),
  },
];

/* ─── Comptes-rendus de réunions ──────────────────────────────────────── */

const reunions: Document[] = [
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.reunions,
    name: "CR Réunion commerciale - BTP Morin.pdf",
    originalName: "CR-COM-20260325.pdf",
    mimeType: "application/pdf",
    sizeBytes: 187_400,
    storagePath: "/vault/cr-com-0325",
    version: 1,
    ocrStatus: "completed",
    ocrText: `COMPTE-RENDU DE RÉUNION COMMERCIALE

Date : ${dateShort(18)}
Lieu : Visioconférence Teams
Participants : Valentin Louot (DOS), Marc Morin (BTP Morin SA), Julie Perrin (BTP Morin)

OBJET : Présentation offre GED intelligente pour chantiers BTP

POINTS ABORDÉS :
1. Contexte client — BTP Morin gère 45 chantiers simultanés, 200+ documents/semaine
2. Problématique : perte de documents, doublons, absence de traçabilité réglementaire
3. Solution présentée : plateforme GED avec OCR automatique, classement intelligent, recherche
4. Démonstration live : upload facture → extraction automatique → classement

DÉCISIONS :
- BTP Morin souhaite un POC sur 2 chantiers pilotes (Chalon + Beaune)
- Budget prévisionnel : 25-35K€ selon périmètre final
- Prochaine étape : envoi proposition commerciale sous 5 jours

ACTIONS :
- [ ] Valentin : rédiger proposition commerciale avant ${dateShort(13)}
- [ ] Marc : fournir échantillon de 50 documents types
- [ ] Julie : valider le planning interne pour le POC

Prochaine réunion : ${dateShort(11)} à 14h00`,
    extractedData: {
      type: "compte_rendu",
      objet: "Réunion commerciale — présentation GED pour BTP Morin",
      date: dateShort(18),
      participants: ["Valentin Louot", "Marc Morin", "Julie Perrin"],
    },
    tags: ["réunion", "commercial", "BTP", "prospect", "GED", "POC", "chantier"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(18),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.reunions,
    name: "CR Réunion marketing - Stratégie Q2 2026.pdf",
    originalName: "CR-MKT-20260320.pdf",
    mimeType: "application/pdf",
    sizeBytes: 234_100,
    storagePath: "/vault/cr-mkt-0320",
    version: 1,
    ocrStatus: "completed",
    ocrText: `COMPTE-RENDU — RÉUNION MARKETING

Date : ${dateShort(23)}
Lieu : Bureaux BATIMENT B, Salle Côte-d'Or
Participants : Valentin Louot, Emma Dubois (Marketing), Lucas Martin (Growth)

OBJET : Planification stratégie marketing Q2 2026

1. BILAN Q1 :
   - 47 leads générés (objectif 40 → +17%)
   - Coût par lead : 85€ (vs 120€ Q4 2025 → -29%)
   - Taux conversion lead→client : 12%
   - Meilleurs canaux : LinkedIn (38%), Google Ads (28%), referral (22%)

2. STRATÉGIE Q2 :
   - Lancement campagne "Zéro papier en BTP" sur LinkedIn
   - Webinaire mensuel "GED pour PME" (objectif 100 inscrits/session)
   - Partenariat avec la FFB Côte-d'Or pour événement physique
   - Budget Q2 : 12 000€ (vs 8 500€ Q1)

3. CONTENU :
   - 3 études de cas clients à publier
   - Série vidéo "La GED en 60 secondes" (8 épisodes)
   - Livre blanc "Guide GED BTP 2026"

ACTIONS :
- [ ] Emma : brief créatif campagne LinkedIn avant ${dateShort(18)}
- [ ] Lucas : setup tracking UTM pour tous les canaux
- [ ] Valentin : valider budget avec DAF`,
    extractedData: {
      type: "compte_rendu",
      objet: "Stratégie marketing Q2 2026",
      date: dateShort(23),
      participants: ["Valentin Louot", "Emma Dubois", "Lucas Martin"],
    },
    tags: ["réunion", "marketing", "stratégie", "Q2", "LinkedIn", "webinaire", "BTP", "leads"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(23),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.reunions,
    name: "CR Réunion interne - Roadmap produit.pdf",
    originalName: "CR-PROD-20260315.pdf",
    mimeType: "application/pdf",
    sizeBytes: 198_700,
    storagePath: "/vault/cr-prod-0315",
    version: 1,
    ocrStatus: "completed",
    ocrText: `COMPTE-RENDU — RÉUNION PRODUIT

Date : ${dateShort(28)}
Lieu : BATIMENT B, Salle Bourgogne
Participants : Valentin Louot (CEO), Thomas Bernard (CTO), Léa Rousseau (Product)

OBJET : Roadmap produit GEDOS — S1 2026

1. ÉTAT ACTUEL :
   - V1.2 déployée (OCR + classement intelligent + recherche full-text)
   - 12 clients en production, 3 en onboarding
   - Uptime 99.7%, temps moyen OCR : 2.3s

2. PRIORITÉS Q2 :
   - P0 : Recherche sémantique avancée — livraison fin avril
   - P0 : Multi-tenant avec isolation complète — livraison mi-mai
   - P1 : Dashboard analytics avancé — livraison juin
   - P2 : App mobile (consultation) — étude de faisabilité

3. DETTE TECHNIQUE :
   - Optimisation sync multi-devices
   - Refacto du pipeline OCR (parallélisation)
   - Tests E2E manquants sur 60% des flows

DÉCISIONS :
- Embauche d'un dev fullstack senior validée (budget 55K€/an)
- Sprint planning : cycles de 2 semaines`,
    extractedData: {
      type: "compte_rendu",
      objet: "Roadmap produit GEDOS S1 2026",
      date: dateShort(28),
      participants: ["Valentin Louot", "Thomas Bernard", "Léa Rousseau"],
    },
    tags: ["réunion", "produit", "roadmap", "GEDOS", "technique", "sprint", "R&D"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(28),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.reunions,
    name: "CR Réunion commerciale - Agence Immo 21.pdf",
    originalName: "CR-COM-20260402.pdf",
    mimeType: "application/pdf",
    sizeBytes: 165_300,
    storagePath: "/vault/cr-com-0402",
    version: 1,
    ocrStatus: "completed",
    ocrText: `COMPTE-RENDU DE RÉUNION COMMERCIALE

Date : ${dateShort(10)}
Lieu : 15 Rue du Château, Dijon (locaux Agence Immo 21)
Participants : Valentin Louot (DOS), Sophie Blanc (Agence Immo 21)

OBJET : Closing contrat chatbot conversationnel

RÉSUMÉ :
- Sophie confirme le besoin : 300+ appels/semaine, 40% non traités
- Le chatbot doit gérer prise de RDV, qualification prospect, relance automatique
- Intégration avec leur CRM Immo (API REST disponible)

DÉCISION : Contrat signé — démarrage ${dateShort(3)}
Montant : 19 800€ TTC

PLANNING :
- Semaine 1-2 : Configuration chatbot + intégration CRM
- Semaine 3 : Tests avec 5 agents (utilisateurs pilotes)
- Semaine 4 : Déploiement production + formation équipe`,
    extractedData: {
      type: "compte_rendu",
      objet: "Closing contrat chatbot — Agence Immo 21",
      date: dateShort(10),
      participants: ["Valentin Louot", "Sophie Blanc"],
    },
    tags: ["réunion", "commercial", "closing", "immobilier", "chatbot", "CRM", "contrat"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(10),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.reunions,
    name: "CR Réunion marketing - Campagne LinkedIn.pdf",
    originalName: "CR-MKT-20260408.pdf",
    mimeType: "application/pdf",
    sizeBytes: 178_200,
    storagePath: "/vault/cr-mkt-0408",
    version: 1,
    ocrStatus: "completed",
    ocrText: `COMPTE-RENDU — POINT MARKETING

Date : ${dateShort(4)}
Participants : Valentin Louot, Emma Dubois

OBJET : Lancement campagne "Zéro papier en BTP"

RÉSULTATS PREMIERS JOURS :
- 12 500 impressions sur 3 posts (vs moy. 4 200)
- 89 interactions (likes, commentaires, partages)
- 7 demandes de démo via formulaire
- CPL estimé : 62€ (objectif < 80€)

TOP PERFORMING :
- Post vidéo "Avant/Après GED" : 5 200 impressions, 34 interactions
- Carousel "5 erreurs documentaires en BTP" : 4 100 impressions

AJUSTEMENTS :
- Augmenter budget ads LinkedIn de 500€ → 800€/semaine
- Ajouter retargeting sur visiteurs site web
- Créer un post témoignage client (demander à BTP Morin)

Prochain point : ${dateShort(-3)}`,
    extractedData: {
      type: "compte_rendu",
      objet: "Point campagne LinkedIn — Zéro papier en BTP",
      date: dateShort(4),
      participants: ["Valentin Louot", "Emma Dubois"],
    },
    tags: ["réunion", "marketing", "LinkedIn", "campagne", "BTP", "ads", "performance"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(4),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.reunions,
    name: "CR Réunion interne - Point hebdo équipe.pdf",
    originalName: "CR-HEBDO-20260407.pdf",
    mimeType: "application/pdf",
    sizeBytes: 145_600,
    storagePath: "/vault/cr-hebdo-0407",
    version: 1,
    ocrStatus: "completed",
    ocrText: `POINT HEBDOMADAIRE — ÉQUIPE DOS

Date : ${dateShort(5)}
Participants : Valentin, Thomas, Emma, Lucas, Léa

TOUR DE TABLE :

Thomas (CTO) :
- Pipeline OCR v2 terminé — gain de 40% sur temps de traitement
- Bug critique corrigé sur l'extraction PDF multi-pages
- Prochain sprint : recherche sémantique avancée

Emma (Marketing) :
- Campagne LinkedIn lancée — bons résultats (voir CR dédié)
- Livre blanc en cours de rédaction (livraison S16)

Lucas (Growth) :
- 4 démos planifiées cette semaine
- Taux ouverture emails séquence outbound : 34%

Léa (Product) :
- Specs recherche sémantique finalisées
- User research : 8 interviews clients complétées
- NPS actuel : 72 (vs 65 en Q4 2025)

BLOQUANTS :
- Aucun bloquant critique
- Attente retour juridique sur CGV v2`,
    extractedData: {
      type: "compte_rendu",
      objet: "Point hebdomadaire équipe DOS",
      date: dateShort(5),
      participants: ["Valentin Louot", "Thomas Bernard", "Emma Dubois", "Lucas Martin", "Léa Rousseau"],
    },
    tags: ["réunion", "hebdo", "équipe", "standup", "interne", "sprint"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(5),
  },
];

/* ─── Documents administratifs ────────────────────────────────────────── */

const administration: Document[] = [
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.administration,
    name: "CGV Document Office Solution - v2.1.pdf",
    originalName: "CGV-DOS-v2.1.pdf",
    mimeType: "application/pdf",
    sizeBytes: 456_200,
    storagePath: "/vault/cgv-v21",
    version: 1,
    ocrStatus: "completed",
    ocrText: `CONDITIONS GÉNÉRALES DE VENTE
Document Office Solution — SAS au capital de 10 000 €
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY
SIRET : 912 345 678 00012 — RCS DIJON

Version 2.1 — Mise à jour ${dateShort(50)}

ARTICLE 1 — OBJET
Les présentes CGV régissent les relations entre Document Office Solution (ci-après "DOS") et ses clients professionnels pour la fourniture de solutions de gestion documentaire intelligente et de services associés.

ARTICLE 2 — PRESTATIONS
DOS propose :
- Déploiement de plateformes GED avec OCR et classement intelligent
- Développement de chatbots conversationnels
- Automatisation de workflows documentaires
- Formation et accompagnement

ARTICLE 3 — TARIFICATION
Les prix sont exprimés en euros hors taxes. La TVA applicable est celle en vigueur au jour de la facturation.
Tarif journalier standard : 900 € — 1 400 € HT selon profil intervenant.

ARTICLE 4 — PAIEMENT
Paiement à 30 jours date de facture. Pénalités de retard : 3x taux d'intérêt légal.

ARTICLE 5 — PROPRIÉTÉ INTELLECTUELLE
Les développements spécifiques réalisés pour le client deviennent sa propriété après paiement intégral.
Les outils, frameworks et librairies développés par DOS restent la propriété de DOS.

ARTICLE 6 — CONFIDENTIALITÉ
Les parties s'engagent à maintenir la confidentialité de toutes les informations échangées.
Durée de l'obligation : 3 ans après la fin du contrat.

ARTICLE 7 — RGPD
DOS s'engage au respect du RGPD. Les données traitées pour le compte du client font l'objet d'un DPA dédié.`,
    extractedData: {
      type: "administratif",
      objet: "Conditions Générales de Vente — DOS v2.1",
      date: dateShort(50),
    },
    tags: ["CGV", "juridique", "contrat", "conditions", "RGPD", "propriété intellectuelle"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(50),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.administration,
    name: "Attestation URSSAF - Mars 2026.pdf",
    originalName: "URSSAF-ATT-032026.pdf",
    mimeType: "application/pdf",
    sizeBytes: 189_300,
    storagePath: "/vault/urssaf-032026",
    version: 1,
    ocrStatus: "completed",
    ocrText: `ATTESTATION DE VIGILANCE

URSSAF Bourgogne — Franche-Comté
3 Rue Martin Luther King, 21000 DIJON

Nous attestons que :

Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF
21800 QUETIGNY
SIRET : 912 345 678 00012

est à jour de ses obligations déclaratives et de paiement au ${dateShort(30)}.

Cette attestation est valable 6 mois à compter de sa date de délivrance.

Référence : ATT-2026-BFC-089123
Date de délivrance : ${dateShort(30)}`,
    extractedData: {
      type: "administratif",
      fournisseur: "URSSAF Bourgogne — Franche-Comté",
      objet: "Attestation de vigilance URSSAF",
      date: dateShort(30),
    },
    tags: ["URSSAF", "attestation", "social", "conformité", "vigilance"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(30),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.administration,
    name: "Contrat assurance RC Pro - AXA.pdf",
    originalName: "AXA-RCPRO-2026.pdf",
    mimeType: "application/pdf",
    sizeBytes: 567_800,
    storagePath: "/vault/axa-rcpro-2026",
    version: 1,
    ocrStatus: "completed",
    ocrText: `ATTESTATION D'ASSURANCE
RESPONSABILITÉ CIVILE PROFESSIONNELLE

AXA France — Agence de Dijon
12 Place de la République, 21000 DIJON

ASSURÉ :
Document Office Solution — SAS
BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY

Contrat n° : AXA-PRO-2026-892341
Période : 01/01/2026 au 31/12/2026

GARANTIES :
- RC Professionnelle : 2 000 000 € par sinistre
- RC Exploitation : 1 500 000 € par sinistre
- Dommages immatériels consécutifs : 500 000 €
- Protection juridique : 100 000 €
- Cyber-risques : 300 000 €

Prime annuelle TTC : 2 847,00 €
Franchise par sinistre : 1 500 €

Cette attestation est délivrée pour servir et valoir ce que de droit.`,
    extractedData: {
      type: "administratif",
      fournisseur: "AXA France",
      adresse: "12 Place de la République, 21000 DIJON",
      numero: "AXA-PRO-2026-892341",
      date: dateShort(90),
      montantTTC: 2847,
      objet: "Assurance RC Professionnelle 2026",
    },
    tags: ["assurance", "RC Pro", "AXA", "cyber", "juridique", "contrat"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(90),
  },
  {
    id: id(),
    tenantId: "t1",
    folderId: FOLDER_IDS.administration,
    name: "Kbis Document Office Solution.pdf",
    originalName: "KBIS-DOS-2026.pdf",
    mimeType: "application/pdf",
    sizeBytes: 234_500,
    storagePath: "/vault/kbis-2026",
    version: 1,
    ocrStatus: "completed",
    ocrText: `EXTRAIT DU REGISTRE DU COMMERCE ET DES SOCIÉTÉS

Greffe du Tribunal de Commerce de DIJON

Dénomination : DOCUMENT OFFICE SOLUTION
Forme juridique : Société par actions simplifiée (SAS)
Capital : 10 000,00 €
Siège social : BATIMENT B — 16 RUE DU GOLF, 21800 QUETIGNY
SIREN : 912 345 678
SIRET (siège) : 912 345 678 00012
N° TVA : FR45912345678
Code APE : 6201Z — Programmation informatique

Dirigeant : Valentin LOUOT, Président
Date d'immatriculation : 15/03/2024
Début d'activité : 01/04/2024

Activité : Développement de solutions de gestion documentaire intelligente, automatisation, conseil et formation en transformation digitale.

Extrait délivré le ${dateShort(45)}
Certifié conforme par le greffier.`,
    extractedData: {
      type: "administratif",
      objet: "Extrait Kbis — Document Office Solution SAS",
      date: dateShort(45),
    },
    tags: ["Kbis", "juridique", "société", "immatriculation", "RCS", "Dijon"],
    metadata: {},
    createdBy: "u1",
    createdAt: dateISO(45),
  },
];

/* ─── Export ──────────────────────────────────────────────────────────── */

export const ALL_MOCK_DOCUMENTS: Document[] = [
  ...facturesFournisseurs,
  ...comptabilite,
  ...facturesClients,
  ...reunions,
  ...administration,
];
