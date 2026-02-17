import { z } from 'zod';

export const partnerSchema = z.object({
  name: z.string(),
  category: z.enum(['telecom', 'esn', 'soutien']),
  logo: z.string(),
});

export type Partner = z.infer<typeof partnerSchema>;

export const partners: Partner[] = [
  { name: 'Orange', category: 'telecom', logo: '/images/partners/orange.png' },
  { name: 'SFR', category: 'telecom', logo: '/images/partners/sfr.png' },
  { name: 'Free Pro', category: 'telecom', logo: '/images/partners/free.png' },
  { name: 'SPIE', category: 'esn', logo: '/images/partners/spie.png' },
  { name: 'Axians', category: 'esn', logo: '/images/partners/axians.png' },
  { name: 'Circet', category: 'esn', logo: '/images/partners/circet.png' },
  { name: 'Davidson', category: 'esn', logo: '/images/partners/davidson.png' },
  { name: 'Rhon Telecom', category: 'telecom', logo: '/images/partners/rhon_telecom.png' },
  { name: 'TIBCO', category: 'esn', logo: '/images/partners/tibco.png' },
  { name: 'ERT', category: 'esn', logo: '/images/partners/ert.png' },
  { name: 'Amaris', category: 'esn', logo: '/images/partners/amaris.png' },
  { name: 'Snef', category: 'esn', logo: '/images/partners/snef.png' },
  { name: 'Eiffage', category: 'esn', logo: '/images/partners/eiffage.png' },
];
