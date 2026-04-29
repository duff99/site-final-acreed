import type { z } from 'zod';
import type {
  jobSchema,
  createJobSchema,
  updateJobSchema,
  loginSchema,
  adminRoleSchema,
  adminUserSchema,
  createAdminSchema,
  updateAdminSchema,
  createContactSchema,
  contactMessageSchema,
  updateContactMessageSchema,
  createApplicationSchema,
  applicationSchema,
  applicationStatusSchema,
  updateApplicationSchema,
} from './schemas';

export type Job = z.infer<typeof jobSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AdminRole = z.infer<typeof adminRoleSchema>;
export type AdminUser = z.infer<typeof adminUserSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type ContactMessage = z.infer<typeof contactMessageSchema>;
export type UpdateContactMessageInput = z.infer<typeof updateContactMessageSchema>;

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type Application = z.infer<typeof applicationSchema>;
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;

export interface AuthResponse {
  accessToken: string;
  user: { id: string; email: string; name: string; role: AdminRole };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
