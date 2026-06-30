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
import { Switch } from '@/components/ui/switch';
import { useConnectAccount } from '@/features/whatsapp/hooks/useConnectAccount';
import {
  connectAccountSchema,
  type ConnectAccountFormValues,
} from '@/features/whatsapp/schemas';

type ConnectAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ConnectAccountDialog({ open, onOpenChange }: ConnectAccountDialogProps) {
  const connectMutation = useConnectAccount();

  const form = useForm<ConnectAccountFormValues>({
    resolver: zodResolver(connectAccountSchema),
    defaultValues: {
      metaWabaId: '',
      name: '',
      accessToken: '',
      appSecret: '',
      webhookVerifyToken: '',
      syncPhones: true,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await connectMutation.mutateAsync({
      metaWabaId: values.metaWabaId,
      name: values.name || undefined,
      accessToken: values.accessToken,
      appSecret: values.appSecret,
      webhookVerifyToken: values.webhookVerifyToken || undefined,
      syncPhones: values.syncPhones,
    });
    form.reset();
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Connect WhatsApp account</DialogTitle>
          <DialogDescription>
            Link a Meta WhatsApp Business Account using your WABA ID and system user token.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="metaWabaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WABA ID</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789012345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Production WABA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access token</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App secret</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="webhookVerifyToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook verify token (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="syncPhones"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <FormLabel>Sync phone numbers on connect</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={connectMutation.isPending}>
                {connectMutation.isPending ? 'Connecting…' : 'Connect'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
