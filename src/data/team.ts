import { z } from 'zod';

export const teamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  bio: z.string().optional(),
  image: z.string(),
  linkedin: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;

export const team: TeamMember[] = [
  {
    name: 'Steven',
    role: 'Président & Fondateur',
    bio: 'Passionné par les télécoms depuis 2011, avec une expérience confirmée en missions de consulting auprès de PME et de grands comptes.',
    image: '/images/photo_steven.jpg',
    linkedin: 'https://www.linkedin.com/in/steven-breuil-824330110/',
    email: 'steven.breuil@acreedconsulting.com',
  },
  {
    name: 'Maxime',
    role: 'Business Manager',
    image: '/images/maxime.jpg',
    linkedin: 'https://www.linkedin.com/in/maxime-riffard-6011a4289/',
    email: 'maxime.riffard@acreedconsulting.com',
  },
  {
    name: 'Tristan',
    role: 'Business Developer',
    image: '/images/tristan.jpg',
    linkedin: 'https://www.linkedin.com/in/tristan-dufraisseix-3a713893/',
    email: 'tristan.dufraisseix@acreedconsulting.com',
  },
];
