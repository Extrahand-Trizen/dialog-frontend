import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { InlineError } from '@/components/shared/InlineError';
import { ListPageShell } from '@/components/shared/ListPageLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import { getDevMockTemplateDetail } from '@/config/dev-mock-data';
import { useWhatsAppAccounts } from '@/hooks/use-whatsapp-accounts';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { getTemplate } from '@/features/templates/api/getTemplate';
import { TemplateCreateForm } from '@/features/templates/components/TemplateCreateForm';
import { useUpdateTemplate } from '@/features/templates/hooks/useUpdateTemplate';
import { templateKeys } from '@/features/templates/queryKeys';
import {
  toUpdateTemplateRequest,
  type TemplateCreateFormValues,
} from '@/features/templates/schemas';
import { componentsToFormValues } from '@/features/templates/utils/componentsToFormValues';
import { canEditTemplate } from '@/features/templates/utils/templateEditability';
import { canSyncTemplates } from '@/lib/permissions';

export function EditTemplatePage() {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const useMockData = isDevMockAuthEnabled();
  const { user } = useAuth();
  const updateMutation = useUpdateTemplate();
  const { defaultAccountId, accounts, isLoading: accountsLoading, isError: accountsError, error: accountsLoadError } =
    useWhatsAppAccounts();

  const canManage = canSyncTemplates(user);

  const templateQuery = useQuery({
    queryKey: templateKeys.detail(templateId ?? ''),
    queryFn: () => getTemplate({ templateId: templateId! }),
    enabled: !useMockData && !!templateId && canManage,
  });

  const template = useMockData
    ? templateId
      ? getDevMockTemplateDetail(templateId)
      : undefined
    : templateQuery.data;

  if (!canManage) {
    return <Navigate to="/templates" replace />;
  }

  if (!templateId) {
    return <Navigate to="/templates" replace />;
  }

  const handleSubmit = async (values: TemplateCreateFormValues) => {
    if (!defaultAccountId) return;
    await updateMutation.mutateAsync({
      templateId,
      request: toUpdateTemplateRequest(values, defaultAccountId),
    });
    navigate('/templates');
  };

  const isLoading = useMockData ? false : templateQuery.isLoading;
  const isError = useMockData ? false : templateQuery.isError;
  const loadError = templateQuery.error;

  if (isLoading || accountsLoading) {
    return (
      <ListPageShell>
        <Skeleton className="h-96 w-full" />
      </ListPageShell>
    );
  }

  if (isError) {
    return (
      <ListPageShell>
        <InlineError error={loadError} />
      </ListPageShell>
    );
  }

  if (!template) {
    return <Navigate to="/templates" replace />;
  }

  if (!canEditTemplate(template.metaStatus, template.metaTemplateId)) {
    return <Navigate to="/templates" replace />;
  }

  const initialValues = componentsToFormValues(template);

  return (
    <ListPageShell>
      <div className="mb-2">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/templates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to templates
          </Link>
        </Button>
      </div>

      {accountsError ? (
        <InlineError error={accountsLoadError} />
      ) : !defaultAccountId || !accounts?.length ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          <p>Connect a WhatsApp Business account before editing templates.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link to="/whatsapp">Go to WhatsApp setup</Link>
          </Button>
        </div>
      ) : (
        <TemplateCreateForm
          mode="edit"
          whatsAppAccountId={defaultAccountId}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          onCancel={() => navigate('/templates')}
          initialValues={initialValues}
        />
      )}
    </ListPageShell>
  );
}
