import { z } from 'zod';

export const serviceSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  badge: z.string(),
});

export type Service = z.infer<typeof serviceSchema>;

export const services: Service[] = [
  {
    icon: 'Radio',
    title: 'Télécoms',
    description: 'Déploiement, ingénierie réseau, optimisation d\'infrastructures : nos consultants accompagnent opérateurs et équipementiers sur leurs projets les plus exigeants.',
    image: '/images/service-recrutement.jpg',
    badge: 'Infrastructure Réseau',
  },
  {
    icon: 'Code',
    title: 'IT / Digital',
    description: 'Intégrés directement au sein de vos équipes, nos experts pilotent vos projets de transformation digitale, développement logiciel et modernisation SI.',
    image: '/images/service-telecom.jpg',
    badge: 'Transformation Digitale',
  },
  {
    icon: 'ShieldCheck',
    title: 'Cybersécurité',
    description: 'Audit, gouvernance, conformité, réponse aux incidents — des profils spécialisés pour renforcer durablement la sécurité de vos infrastructures critiques.',
    image: '/images/service-cybersecurite.jpg',
    badge: 'Sécurité des SI',
  },
  {
    icon: 'Zap',
    title: 'Énergies renouvelables',
    description: 'Solaire, éolien, smart grids, efficacité énergétique : des ingénieurs-consultants engagés aux côtés des acteurs de la transition.',
    image: '/images/service-energie.jpg',
    badge: 'Transition Énergétique',
  },
  {
    icon: 'Factory',
    title: 'Industrie',
    description: 'En milieu industriel, nos équipes optimisent vos processus de production, votre supply chain et accompagnent la conduite du changement.',
    image: '/images/service-digital.jpg',
    badge: 'Performance Industrielle',
  },
];
