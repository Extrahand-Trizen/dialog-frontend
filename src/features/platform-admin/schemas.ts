import { z } from 'zod';

export const platformLoginFormSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type PlatformLoginFormValues = z.infer<typeof platformLoginFormSchema>;

export const createOrganizationFormSchema = z.object({
  name: z.string().trim().min(2, 'Enter the business name').max(120),
  adminEmail: z.string().email('Enter a valid email'),
  adminFirstName: z.string().trim().min(1, 'Required').max(100),
  adminLastName: z.string().trim().min(1, 'Required').max(100),
  adminPassword: z.string().min(8, 'At least 8 characters').max(200),
});

export type CreateOrganizationFormValues = z.infer<typeof createOrganizationFormSchema>;

export const updateOrganizationNameFormSchema = z.object({
  name: z.string().trim().min(2, 'Enter the business name').max(120),
});

export type UpdateOrganizationNameFormValues = z.infer<typeof updateOrganizationNameFormSchema>;

export const updateWhatsAppAccountNameFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter a display name').max(200),
});

export type UpdateWhatsAppAccountNameFormValues = z.infer<
  typeof updateWhatsAppAccountNameFormSchema
>;
