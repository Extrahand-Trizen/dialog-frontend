export const whatsappKeys = {
  all: ['whatsapp'] as const,
  accounts: () => [...whatsappKeys.all, 'accounts'] as const,
  account: (id: string) => [...whatsappKeys.all, 'account', id] as const,
  phoneNumbers: (accountId: string) => [...whatsappKeys.all, 'phones', accountId] as const,
};
