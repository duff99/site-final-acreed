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
