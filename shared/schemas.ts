import { z } from 'zod';

// ---------- Job schemas ----------

export const jobSchema = z.object({
  id: z.string(),
  type: z.string(),
  location: z.string(),
  title: z.string(),
  description: z.string(),
  sector: z.string(),
  experience: z.string(),
  skills: z.array(z.string()),
  fullDescription: z.string(),
  responsibilities: z.array(z.string()),
  profile: z.array(z.string()),
  advantages: z.array(z.string()),
  remote: z.string(),
  publishedDate: z.string(),
});

export const createJobSchema = jobSchema.omit({ id: true }).extend({
  publishedDate: z.string().optional(),
});

export const updateJobSchema = createJobSchema.partial();

// ---------- Auth schemas ----------

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caracteres'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: z
      .string()
      .min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
    confirmPassword: z.string().min(1, 'Confirmation requise'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: 'Le nouveau mot de passe doit être différent de l\'actuel',
    path: ['newPassword'],
  });

// ---------- Admin Role ----------

export const adminRoleSchema = z.enum(['admin', 'editor']);

// ---------- Admin User schemas ----------

export const adminUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: adminRoleSchema,
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastLoginAt: z.string().nullable(),
  createdBy: z.string().nullable(),
});

export const createAdminSchema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caracteres'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caracteres'),
  role: adminRoleSchema,
});

export const updateAdminSchema = z.object({
  email: z.string().email('Email invalide').optional(),
  name: z.string().min(2).optional(),
  password: z.string().min(8).optional(),
  role: adminRoleSchema.optional(),
  isActive: z.boolean().optional(),
});

// ---------- Application schemas ----------

export const createApplicationSchema = z.object({
  jobId: z.string().optional().default(''),
  jobTitle: z.string().optional().default(''),
  isSpontaneous: z.boolean().optional().default(false),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').max(50),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50),
  email: z.string().email('Email invalide'),
  phone: z.string().max(20).optional().default(''),
  cvUrl: z.string().url('Lien invalide').optional().or(z.literal('')),
  message: z.string().max(3000).optional().default(''),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Le consentement au traitement des données est requis' }),
  }),
});

// ---------- Contact schemas ----------

export const contactSubjectSchema = z.enum([
  'Recrutement',
  'Consulting',
  'Partenariat',
  'Candidature spontanée',
  'Autre',
]);

export const createContactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  email: z.string().email('Email invalide'),
  phone: z.string().max(20).optional().default(''),
  subject: contactSubjectSchema,
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(5000),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Le consentement au traitement des données est requis' }),
  }),
});

export const contactMessageSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  subject: z.string(),
  message: z.string(),
  cvFilename: z.string().nullable(),
  isRead: z.boolean(),
  createdAt: z.string(),
});

export const updateContactMessageSchema = z.object({
  isRead: z.boolean(),
});

// ---------- Admin Application schemas ----------

export const applicationStatusSchema = z.enum(['new', 'reviewing', 'contacted', 'rejected', 'archived']);

export const applicationSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  jobTitle: z.string(),
  isSpontaneous: z.boolean().optional().default(false),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  cvUrl: z.string().nullable(),
  message: z.string().nullable(),
  status: applicationStatusSchema,
  createdAt: z.string(),
});

export const updateApplicationSchema = z.object({
  status: applicationStatusSchema,
});
