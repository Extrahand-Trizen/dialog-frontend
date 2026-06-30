import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { API_KEY_SCOPES } from '@/features/api-keys/types';
import { useCreateApiKey } from '@/features/api-keys/hooks/useCreateApiKey';
import {
  createApiKeyFormSchema,
  SCOPE_LABELS,
  type CreateApiKeyFormValues,
} from '@/features/api-keys/schemas';
import type { CreateApiKeyResponse } from '@/features/api-keys/types';

type CreateApiKeyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (result: CreateApiKeyResponse) => void;
};

export function CreateApiKeyDialog({ open, onOpenChange, onCreated }: CreateApiKeyDialogProps) {
  const createMutation = useCreateApiKey();

  const form = useForm<CreateApiKeyFormValues>({
    resolver: zodResolver(createApiKeyFormSchema),
    defaultValues: {
      name: '',
      scopes: ['messages:write'],
      expiresAt: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await createMutation.mutateAsync({
      name: values.name,
      scopes: values.scopes,
      expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : undefined,
    });
    form.reset();
    onOpenChange(false);
    onCreated(result);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create API key</DialogTitle>
          <DialogDescription>
            API keys authenticate integrators sending events to the platform.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Production integrator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scopes"
              render={() => (
                <FormItem>
                  <FormLabel>Scopes</FormLabel>
                  <div className="space-y-2">
                    {API_KEY_SCOPES.map((scope) => (
                      <FormField
                        key={scope}
                        control={form.control}
                        name="scopes"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(scope)}
                                onCheckedChange={(checked) => {
                                  const current = field.value ?? [];
                                  field.onChange(
                                    checked
                                      ? [...current, scope]
                                      : current.filter((s) => s !== scope),
                                  );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{SCOPE_LABELS[scope]}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expires at (optional)</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating…' : 'Create key'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
