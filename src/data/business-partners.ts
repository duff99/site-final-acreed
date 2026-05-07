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
  },
  {
    name: 'La Brasserie du Digital',
    tagline: 'Studio digital partenaire',
  },
  {
    name: 'Veilio',
    tagline: 'Sécurité & tokenisation',
    href: 'https://veilio.xyz',
  },
];
