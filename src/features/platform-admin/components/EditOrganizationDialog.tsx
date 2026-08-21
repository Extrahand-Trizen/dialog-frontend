import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
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
import { useUpdateOrganizationName } from '@/features/platform-admin/hooks/useUpdateOrganizationName';
import {
  updateOrganizationNameFormSchema,
  type UpdateOrganizationNameFormValues,
} from '@/features/platform-admin/schemas';
import type { OrganizationDetail } from '@/features/platform-admin/types';

type EditOrganizationDialogProps = {
  organization: OrganizationDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditOrganizationDialog({
  organization,
  open,
  onOpenChange,
}: EditOrganizationDialogProps) {
  const updateMutation = useUpdateOrganizationName();

  const form = useForm<UpdateOrganizationNameFormValues>({
    resolver: zodResolver(updateOrganizationNameFormSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (organization && open) {
      form.reset({ name: organization.name });
    }
  }, [organization, open, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!organization) {
      return;
    }
    await updateMutation.mutateAsync({ id: organization.id, name: values.name });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit client details</DialogTitle>
          <DialogDescription>
            Update the business name. The slug regenerates from the new name.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Services" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {organization ? (
              <p className="text-xs text-muted-foreground">
                Current slug: <span className="font-mono">{organization.slug}</span>
              </p>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending || !organization}>
                {updateMutation.isPending ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
