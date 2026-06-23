import { z } from 'zod';

export const connectAccountSchema = z.object({
  metaWabaId: z.string().min(1, 'WABA ID is required'),
  name: z.string().max(200).optional(),
  accessToken: z.string().min(1, 'Access token is required'),
  appSecret: z.string().min(1, 'App secret is required'),
  webhookVerifyToken: z.string().optional(),
  syncPhones: z.boolean(),
});

export type ConnectAccountFormValues = z.infer<typeof connectAccountSchema>;
