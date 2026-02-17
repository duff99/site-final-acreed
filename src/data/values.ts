import { z } from 'zod';

export const valueSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export type Value = z.infer<typeof valueSchema>;

export const values: Value[] = [
  {
    icon: 'Zap',
    title: "Rapidité d'Intervention",
    description: 'Efficacité opérationnelle avec des déploiements rapides et adaptés.',
  },
  {
    icon: 'BadgeEuro',
    title: 'Politique Tarifaire Compétitive',
    description: 'Tarifs inférieurs à la moyenne du marché sans compromis sur la qualité.',
  },
  {
    icon: 'Radio',
    title: 'Expertise Télécoms Pointue',
    description: "Savoir-faire reconnu grâce à l'expertise du fondateur dans le secteur.",
  },
  {
    icon: 'Eye',
    title: 'Transparence & Confiance',
    description: 'Relations basées sur la franchise et la transparence totale.',
  },
];

export const growthTimeline = [
  { year: '2020', title: "Création d'Acreed", metric: 'De 1 à 5 consultants' },
  { year: '2022', title: 'Expansion IT & Cyber', metric: '20+ missions réalisées' },
  { year: '2023', title: 'Croissance accélérée', metric: '15+ consultants actifs' },
  { year: '2024', title: 'Maturité', metric: '30 consultants · Staffing < 1 semaine · 2M€ CA' },
  { year: '2025', title: 'Nouvelle diversification', metric: 'Énergie renouvelable · Industrie · Nucléaire' },
  { year: '2026', title: 'La suite avec vous ?', metric: '' },
];

export interface HistoryBlock {
  id: string;
  period: string;
  title: string;
  description: string;
  icon: string;
  highlight: string;
  link?: string;
}

export const historyBlocks: HistoryBlock[] = [
  {
    id: 'origin',
    period: '2020-2022',
    title: "L'Origine",
    description:
      "Lancée par son fondateur, l'aventure Acreed a rapidement fédéré une première équipe de 5 consultants. Dès le début, une seule obsession : la qualité technique qui a permis de sécuriser plus de 20 missions critiques.",
    icon: 'Rocket',
    highlight: '20+ missions critiques',
  },
  {
    id: 'performance',
    period: '2023-2024',
    title: 'La Performance',
    description:
      "Le cap de la maturité. 30 consultants, 2M€ de CA et un staffing en moins d'une semaine. Mais au-delà des chiffres, c'est la qualité de nos missions et la fidélisation de nos clients qui témoignent de notre exigence.",
    icon: 'TrendingUp',
    highlight: '2M€ de CA',
  },
  {
    id: 'horizon',
    period: '2025-2026',
    title: "L'Horizon",
    description:
      "L'ère de l'innovation. Fin 2025 marque la naissance d'Acreed IA Solutions, notre filière dédiée à l'intelligence artificielle. Une expertise de pointe qui vient compléter notre ouverture vers l'Industrie et les Énergies Renouvelables.",
    icon: 'Sparkles',
    highlight: 'Acreed IA Solutions',
    link: 'https://acreediasolutions.com/',
  },
];

export const philosophy = "Fantastique simplicité — Créativité d'une startup, puissance d'un grand groupe, transparence et confiance dans chaque relation client-consultant.";
