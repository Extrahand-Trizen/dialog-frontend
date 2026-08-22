import { get, patch, post } from '@/lib/api-client';
import type { NumberCatalog, VirtualNumber } from '../types';

export async function listVirtualNumbers(): Promise<VirtualNumber[]> {
  return get<VirtualNumber[]>('/virtual-numbers');
}

export async function getVirtualNumber(id: string): Promise<VirtualNumber> {
  return get<VirtualNumber>(`/virtual-numbers/${id}`);
}

export async function listAvailableNumbers(country?: string): Promise<NumberCatalog> {
  return get<NumberCatalog>('/virtual-numbers/available', country ? { country } : undefined);
}

export async function activateVirtualNumber(body: {
  inventoryId: string;
  assignedApplication?: string;
}): Promise<VirtualNumber> {
  return post<VirtualNumber, typeof body>('/virtual-numbers', body);
}

export async function updateVirtualNumber(
  id: string,
  body: Partial<
    Pick<
      VirtualNumber,
      | 'incomingEnabled'
      | 'outgoingEnabled'
      | 'destinationE164'
      | 'assignedApplication'
      | 'webhookUrl'
      | 'maskingEnabled'
    >
  > & { status?: 'ACTIVE' | 'INACTIVE' },
): Promise<VirtualNumber> {
  return patch<VirtualNumber, typeof body>(`/virtual-numbers/${id}`, body);
}
