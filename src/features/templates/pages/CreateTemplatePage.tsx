import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InlineError } from '@/components/shared/InlineError';
import { ListPageShell } from '@/components/shared/ListPageLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { useWhatsAppAccounts } from '@/hooks/use-whatsapp-accounts';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { TemplateCreateForm } from '@/features/templates/components/TemplateCreateForm';
import { useCreateTemplate } from '@/features/templates/hooks/useCreateTemplate';
import { toCreateTemplateRequest, type TemplateCreateFormValues } from '@/features/templates/schemas';
import { canSyncTemplates } from '@/lib/permissions';

export function CreateTemplatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const createMutation = useCreateTemplate();
  const { defaultAccountId, accounts, isLoading, isError, error } = useWhatsAppAccounts();

  const wizardInitialValues = (
    location.state as { initialValues?: Partial<TemplateCreateFormValues> } | null
  )?.initialValues;

  const canCreate = canSyncTemplates(user);

  if (!canCreate) {
    return <Navigate to="/templates" replace />;
  }

  const handleSubmit = async (values: TemplateCreateFormValues) => {
    if (!defaultAccountId) return;
    await createMutation.mutateAsync(toCreateTemplateRequest(values, defaultAccountId));
    navigate('/templates');
  };

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

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : isError ? (
        <InlineError error={error} />
      ) : !defaultAccountId || !accounts?.length ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          <p>Connect a WhatsApp Business account before creating templates.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link to="/whatsapp">Go to WhatsApp setup</Link>
          </Button>
        </div>
      ) : (
        <TemplateCreateForm
          whatsAppAccountId={defaultAccountId}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          onCancel={() => navigate('/templates')}
          initialValues={wizardInitialValues}
        />
      )}
    </ListPageShell>
  );
}
