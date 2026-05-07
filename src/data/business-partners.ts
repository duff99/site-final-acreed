import { z } from 'zod';

export const businessPartnerSchema = z.object({
  name: z.string(),
  tagline: z.string().optional(),
  logo: z.string().optional(),
  href: z.string().url().optional(),
});

export type BusinessPartner = z.infer<typeof businessPartnerSchema>;

export const businessPartners: BusinessPartner[] = [
  {
    name: 'Michelin',
    tagline: 'Industriel partenaire',
    logo: '/images/partners/michelin.jpg',
  },
  {
    name: 'La Brasserie du Digital',
    tagline: 'Studio digital partenaire',
    logo: '/images/partners/brasserie-digital.png',
  },
  {
    name: 'Veilio',
    tagline: 'Sécurité & tokenisation',
    logo: '/images/partners/veilio.png',
    href: 'https://veilio.xyz',
  },
];
