// Données BMC de l'écosystème GenZ Apps — hardcodées (source de vérité de la grille Active Units).
export type AppStatus = 'LIVE' | 'DEPLOYED' | 'READY' | 'STANDBY' | 'PIPELINE' | 'DEV' | 'FLAGSHIP'

export type AppBMC = {
  key: string; name: string; nameAr?: string; icon: string;
  status: AppStatus;
  tagline: string; url?: string;
  bmc: { revenu: string; couts: string; prudent: string; optimiste: string; levier: string };
}

export const ECOSYSTEM: AppBMC[] = [
  { key: 'artisanadz', name: 'ArtisanaDZ', icon: '🔨', status: 'LIVE', tagline: 'Réseau social + marketplace artisans (cash cow)',
    url: 'https://artisanadz.com',
    bmc: { revenu: 'Commission ~15% sur ventes de formations', couts: 'Infra mutualisée',
      prudent: '~19 000 DA/mois (50 ventes/mois)', optimiste: '~75 000 DA/mois (200 ventes/mois)',
      levier: 'Jeu de volume — décolle quand le réseau grossit' } },
  { key: 'makine', name: 'Makine', icon: '🛠️', status: 'DEPLOYED', tagline: 'ERP production artisanale (power-up)',
    url: 'https://makine-app.vercel.app',
    bmc: { revenu: 'Abo ~2 000 DA/mois (Pro), freemium en dessous', couts: 'Infra + support',
      prudent: '60 000 DA/mois (30 payants)', optimiste: '160 000 DA/mois (80 payants)',
      levier: 'SSO ArtisanaDZ = acquisition croisée gratuite' } },
  { key: 'kodiane', name: 'Kodiane', icon: '🛒', status: 'READY', tagline: 'Achats + comparateur de prix (B2C)',
    url: 'https://kodiane-app-5enx.vercel.app/',
    bmc: { revenu: 'Freemium 490 DA/mois + AdMob sur le gratuit', couts: 'Infra + stores',
      prudent: '49 000 DA/mois (100 payants)', optimiste: '147 000 DA/mois (300 payants)',
      levier: 'API recettes ↔ ArtisanaDZ = acquisition croisée' } },
  { key: 'aizen', name: 'Aizen', icon: '🌐', status: 'DEPLOYED', tagline: 'Sites web clients pour artisans',
    url: 'https://aizen-algerie.com',
    bmc: { revenu: '—', couts: '—', prudent: '—', optimiste: '—', levier: '—' } },
  { key: 'quranlearn', name: 'QuranLearn', nameAr: 'قرآن ليرن', icon: '📖', status: 'FLAGSHIP',
    tagline: 'Cœur de l’incubateur — projet waqf', url: 'https://quranlearn.artisanadz.com',
    bmc: { revenu: 'Forfaits Shaykh/Madrassa — 100% reversé (bourses talibine 3ilm + umra)', couts: 'Infra',
      prudent: 'Profit Genz = 0 (waqf par design)', optimiste: '—',
      levier: 'Légitimité + baraka + porte vers sponsors/mécènes' } },
  { key: 'comptadz', name: 'ComptaDZ', icon: '📊', status: 'STANDBY', tagline: 'Compta artisans/PME algériennes',
    bmc: { revenu: 'Abo 5 000 DA/mois + % par requête OCR', couts: 'API OCR (coût variable répercuté sur le %)',
      prudent: '100 000 DA/mois (20 payants)', optimiste: '250 000 DA/mois (50 payants)',
      levier: 'Besoin d’un comptable pour valider la logique des calculs' } },
  { key: 'toredalio', name: 'toredalio', icon: '📷', status: 'DEV', tagline: 'Portfolio SaaS pour photographes (international)',
    bmc: { revenu: 'Abo 10 €/mois (~2 500 DA)', couts: 'Infra',
      prudent: '~75 000 DA/mois (30 photographes)', optimiste: '~250 000 DA/mois (100 photographes)',
      levier: 'Facturation EUR = meilleure marge, cible diaspora/international' } },
  { key: 'prixdz', name: 'PrixDZ', icon: '🔒', status: 'PIPELINE', tagline: 'Comparateur de prix',
    bmc: { revenu: '—', couts: '—', prudent: '—', optimiste: '—', levier: 'Pipeline' } },
]

// Métadonnées d'affichage par statut (label + tonalité couleur).
export const STATUS_META: Record<AppStatus, { label: string; tone: 'live' | 'standby' | 'pipeline' | 'dev' | 'flagship' }> = {
  LIVE: { label: 'LIVE', tone: 'live' },
  DEPLOYED: { label: 'DEPLOYED', tone: 'live' },
  READY: { label: 'READY TO SHIP', tone: 'live' },
  FLAGSHIP: { label: 'FLAGSHIP', tone: 'flagship' },
  STANDBY: { label: 'STANDBY', tone: 'standby' },
  PIPELINE: { label: 'PIPELINE', tone: 'pipeline' },
  DEV: { label: 'IN DEV', tone: 'dev' },
}

/** Apps affichées dans la grille (le flagship QuranLearn est rendu en hero, pas en carte). */
export const GRID_APPS = ECOSYSTEM.filter((a) => a.status !== 'FLAGSHIP')

export const getApp = (key: string): AppBMC | undefined => ECOSYSTEM.find((a) => a.key === key)
