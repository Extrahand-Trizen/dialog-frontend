import { useQuery } from '@tanstack/react-query';

import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';

import { DEV_MOCK_PHONE_NUMBERS } from '@/config/dev-mock-data';

import { listPhoneNumbers } from '@/features/whatsapp/api/listPhoneNumbers';

import { whatsappKeys } from '@/features/whatsapp/queryKeys';

import { useWhatsAppAccounts } from '@/hooks/use-whatsapp-accounts';



export type PhoneNumberOption = {

  id: string;

  label: string;

};



const MOCK_PHONE_OPTIONS: PhoneNumberOption[] = DEV_MOCK_PHONE_NUMBERS.map((phone) => ({

  id: phone.id,

  label: `${phone.displayNumber}${phone.isDefault ? ' (default)' : ''}`,

}));



/** Cross-feature phone picker for default WhatsApp account. */

export function usePhoneNumberOptions(enabled = true) {

  const useMockData = isDevMockAuthEnabled();

  const { defaultAccountId } = useWhatsAppAccounts();



  return useQuery<PhoneNumberOption[]>({

    queryKey: whatsappKeys.phoneNumbers(defaultAccountId ?? ''),

    queryFn: async () => {

      if (useMockData) return MOCK_PHONE_OPTIONS;

      const phones = await listPhoneNumbers({ accountId: defaultAccountId! });

      return phones.map((phone) => ({

        id: phone.id,

        label: `${phone.displayNumber}${phone.isDefault ? ' (default)' : ''}`,

      }));

    },

    enabled: enabled && (useMockData || !!defaultAccountId),

  });

}


