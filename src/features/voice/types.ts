export type VirtualNumber = {
  id: string;
  e164: string;
  displayNumber: string;
  countryCode: string;
  countryName: string;
  locality: string;
  status: 'active' | 'inactive';
  incomingEnabled: boolean;
  outgoingEnabled: boolean;
  maskingEnabled?: boolean;
  destinationE164: string | null;
  assignedApplication: string | null;
  webhookUrl: string | null;
  inboundCount: number;
  outboundCount: number;
  minutesUsed: number;
  createdAt: string;
};

export type InventoryNumber = {
  id: string;
  e164: string;
  displayNumber: string;
  countryCode: string;
  countryName: string;
  locality: string;
  monthlyFeeUsd: number;
  price: { currency: 'INR' | 'USD'; amount: number; display: string };
  capabilities: { voice: boolean; incoming: boolean; outgoing: boolean; masking: boolean };
};

export type NumberCatalog = {
  countries: { code: string; name: string }[];
  numbers: InventoryNumber[];
};
