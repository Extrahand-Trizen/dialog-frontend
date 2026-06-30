import { apiClient } from '@/lib/api-client';
import type { ApiSuccessBody } from '@/types/api';
import type { UploadTemplateMediaResponse } from '@/features/templates/types';

export async function uploadTemplateMedia(
  whatsAppAccountId: string,
  file: File,
): Promise<UploadTemplateMediaResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('whatsAppAccountId', whatsAppAccountId);

  const response = await apiClient.post<ApiSuccessBody<UploadTemplateMediaResponse>>(
    '/media/upload',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return response.data.data;
}
