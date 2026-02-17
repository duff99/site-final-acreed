import { z } from 'zod';

export const expertiseSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  features: z.array(z.string()),
});

export type Expertise = z.infer<typeof expertiseSchema>;

export const expertises: Expertise[] = [
  {
    icon: 'Users',
    title: 'Consulting Externe sur Mesure',
    description: 'Mise à disposition de consultants spécialisés pour des missions temporaires ou longues dans les télécoms, IT et cybersécurité.',
    features: ['Consultants experts', 'Missions flexibles', 'Accompagnement personnalisé'],
  },
  {
    icon: 'UserPlus',
    title: 'Prestation + Internalisation',
    description: "Possibilité d'intégrer nos consultants chez le client après une première mission réussie.",
    features: ['Transition fluide', 'Intégration progressive', 'Formation continue'],
  },
  {
    icon: 'Search',
    title: 'Recrutement Interne',
    description: 'Assistance complète au recrutement de talents qualifiés pour répondre aux besoins spécifiques de nos clients.',
    features: ['Sourcing expert', 'Évaluation technique', 'Processus rigoureux'],
  },
  {
    icon: 'FolderKanban',
    title: 'Gestion de Projets',
    description: "Accompagnement complet avec création d'outils personnalisés, pilotage et coordination de projets complexes.",
    features: ['Outils sur-mesure', 'Pilotage expert', 'Coordination complète'],
  },
];
