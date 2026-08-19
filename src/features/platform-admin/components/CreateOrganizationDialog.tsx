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
import { useCreateOrganization } from '@/features/platform-admin/hooks/useCreateOrganization';
import {
  createOrganizationFormSchema,
  type CreateOrganizationFormValues,
} from '@/features/platform-admin/schemas';
import type { CreateOrganizationResult } from '@/features/platform-admin/types';
import { toastMutationSuccess } from '@/lib/mutation-toast';

type CreateOrganizationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (result: CreateOrganizationResult) => void;
};

export function CreateOrganizationDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateOrganizationDialogProps) {
  const createMutation = useCreateOrganization();

  const form = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationFormSchema),
    defaultValues: {
      name: '',
      adminEmail: '',
      adminFirstName: '',
      adminLastName: '',
      adminPassword: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await createMutation.mutateAsync(values);
    form.reset();
    onOpenChange(false);
    toastMutationSuccess(`${result.organization.name} created`);
    onCreated(result);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add client</DialogTitle>
          <DialogDescription>
            Creates a new organization and its first admin user. Share these credentials with
            the client so they can sign in.
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
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="adminFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin first name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adminLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin last name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="adminEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin initial password</FormLabel>
                  <FormControl>
                    <Input type="text" autoComplete="off" {...field} />
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
                {createMutation.isPending ? 'Creating…' : 'Create client'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
