import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InlineError } from '@/components/shared/InlineError';
import { ListPageShell } from '@/components/shared/ListPageLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { useWhatsAppAccounts } from '@/hooks/use-whatsapp-accounts';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { TemplateCreateForm } from '@/features/templates/components/TemplateCreateForm';
import { TemplateFormPageHeader } from '@/features/templates/components/TemplateFormPageHeader';
import { useCreateTemplate } from '@/features/templates/hooks/useCreateTemplate';
import { toCreateTemplateRequest, type TemplateCreateFormValues } from '@/features/templates/schemas';
import { canSyncTemplates } from '@/lib/permissions';

export function CreateTemplatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const createMutation = useCreateTemplate();
  const { defaultAccountId, connectedAccounts, isLoading, isError, error } = useWhatsAppAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>();

  const wizardInitialValues = (
    location.state as { initialValues?: Partial<TemplateCreateFormValues> } | null
  )?.initialValues;

  const canCreate = canSyncTemplates(user);
  const activeAccountId = selectedAccountId ?? defaultAccountId;

  useEffect(() => {
    if (!selectedAccountId && defaultAccountId) {
      setSelectedAccountId(defaultAccountId);
    }
  }, [defaultAccountId, selectedAccountId]);

  if (!canCreate) {
    return <Navigate to="/templates" replace />;
  }

  const handleSubmit = async (values: TemplateCreateFormValues) => {
    if (!activeAccountId) return;
    await createMutation.mutateAsync(toCreateTemplateRequest(values, activeAccountId));
    navigate('/templates');
  };

  return (
    <ListPageShell>
      <TemplateFormPageHeader
        mode="create"
        connectedAccounts={connectedAccounts}
        selectedAccountId={activeAccountId}
        onSelectedAccountIdChange={setSelectedAccountId}
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      ) : isError ? (
        <InlineError error={error} />
      ) : !activeAccountId || !connectedAccounts.length ? (
        <Card className="border-dashed shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <p className="text-sm font-medium text-foreground">
              Connect a WhatsApp Business account before creating templates.
            </p>
            <p className="text-sm text-muted-foreground">
              Templates are submitted to Meta through your connected WABA.
            </p>
            <Button asChild variant="outline">
              <Link to="/whatsapp">Go to WhatsApp setup</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TemplateCreateForm
          whatsAppAccountId={activeAccountId}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          onCancel={() => navigate('/templates')}
          initialValues={wizardInitialValues}
        />
      )}
    </ListPageShell>
  );
}
