import { z } from 'zod';

export const expertiseSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  image: z.string(),
});

export type Expertise = z.infer<typeof expertiseSchema>;

export const expertises: Expertise[] = [
  {
    icon: 'Users',
    title: 'Consulting Externe sur Mesure',
    description: "Mise à disposition de consultants spécialisés pour des missions temporaires ou longues dans les télécoms, l'IT, la cybersécurité, les énergies renouvelables et l'industrie.",
    features: ['Consultants experts', 'Missions flexibles', 'Accompagnement personnalisé'],
    image: '/images/offre-consulting.jpg',
  },
  {
    icon: 'UserPlus',
    title: 'Prestation + Internalisation',
    description: "Possibilité d'intégrer nos consultants directement chez le client après une première mission réussie et validée.",
    features: ['Transition fluide', 'Intégration progressive', 'Formation continue'],
    image: '/images/offre-internalisation.jpg',
  },
  {
    icon: 'Search',
    title: 'Recrutement Interne',
    description: "Assistance complète au recrutement de talents qualifiés pour répondre avec précision aux besoins spécifiques de nos clients.",
    features: ['Sourcing expert', 'Évaluation technique', 'Processus rigoureux'],
    image: '/images/offre-recrutement.jpg',
  },
  {
    icon: 'KanbanSquare',
    title: 'Gestion de Projets',
    description: "Accompagnement complet avec création d'outils personnalisés, pilotage agile et coordination de vos projets complexes.",
    features: ['Outils sur-mesure', 'Pilotage expert', 'Coordination complète'],
    image: '/images/offre-gestion.jpg',
  },
];
