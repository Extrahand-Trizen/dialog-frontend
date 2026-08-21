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
import { useUpdateWhatsAppAccountName } from '@/features/platform-admin/hooks/useUpdateWhatsAppAccountName';
import {
  updateWhatsAppAccountNameFormSchema,
  type UpdateWhatsAppAccountNameFormValues,
} from '@/features/platform-admin/schemas';
import type { PlatformWhatsAppAccount } from '@/features/platform-admin/types';

type EditWhatsAppAccountNameDialogProps = {
  organizationId: string;
  account: PlatformWhatsAppAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditWhatsAppAccountNameDialog({
  organizationId,
  account,
  open,
  onOpenChange,
}: EditWhatsAppAccountNameDialogProps) {
  const updateMutation = useUpdateWhatsAppAccountName(organizationId);

  const form = useForm<UpdateWhatsAppAccountNameFormValues>({
    resolver: zodResolver(updateWhatsAppAccountNameFormSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (account && open) {
      form.reset({ name: account.name ?? '' });
    }
  }, [account, open, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!account) {
      return;
    }
    await updateMutation.mutateAsync({ accountId: account.id, name: values.name });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit account name</DialogTitle>
          <DialogDescription>
            Update the display name for this WhatsApp Business account. WABA ID{' '}
            <span className="font-mono text-xs">{account?.metaWabaId}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input placeholder="Main WABA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending || !account}>
                {updateMutation.isPending ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
