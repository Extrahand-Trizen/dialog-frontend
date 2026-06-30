import { useQuery } from '@tanstack/react-query';

import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';

import { DEV_MOCK_TEMPLATES } from '@/config/dev-mock-data';

import { listTemplates } from '@/features/templates/api/listTemplates';

import { templateKeys } from '@/features/templates/queryKeys';



export type TemplateOption = {

  id: string;

  label: string;

};



const APPROVED_MOCK_OPTIONS: TemplateOption[] = DEV_MOCK_TEMPLATES.filter(

  (t) => t.metaStatus === 'APPROVED',

).map((template) => ({

  id: template.id,

  label: `${template.metaTemplateName} (${template.language})`,

}));



/** Cross-feature template picker — see frontend-architecture import rules. */

export function useTemplateOptions(enabled = true) {

  const useMockData = isDevMockAuthEnabled();



  return useQuery<TemplateOption[]>({

    queryKey: templateKeys.list({ page: 1, limit: 100, metaStatus: 'APPROVED' }),

    queryFn: async () => {

      if (useMockData) return APPROVED_MOCK_OPTIONS;

      const data = await listTemplates({ page: 1, limit: 100, metaStatus: 'APPROVED' });

      return data.items.map((template) => ({

        id: template.id,

        label: `${template.metaTemplateName} (${template.language})`,

      }));

    },

    enabled,

  });

}


