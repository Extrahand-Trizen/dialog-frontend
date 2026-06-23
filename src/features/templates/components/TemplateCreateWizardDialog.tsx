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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TEMPLATE_CREATE_WIZARD_DEFAULTS,
  templateCreateWizardSchema,
  type TemplateCreateWizardValues,
} from '@/features/templates/schemas';
import { TEMPLATE_CATEGORIES, TEMPLATE_FORMATS } from '@/features/templates/types';

type TemplateCreateWizardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (values: TemplateCreateWizardValues) => void;
};

export function TemplateCreateWizardDialog({
  open,
  onOpenChange,
  onContinue,
}: TemplateCreateWizardDialogProps) {
  const form = useForm<TemplateCreateWizardValues>({
    resolver: zodResolver(templateCreateWizardSchema),
    defaultValues: TEMPLATE_CREATE_WIZARD_DEFAULTS,
  });

  const handleSubmit = (values: TemplateCreateWizardValues) => {
    onContinue(values);
    form.reset(TEMPLATE_CREATE_WIZARD_DEFAULTS);
    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset(TEMPLATE_CREATE_WIZARD_DEFAULTS);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create template</DialogTitle>
          <DialogDescription>
            Choose a name, language, and category. You will edit the message content next.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template name</FormLabel>
                  <FormControl>
                    <Input placeholder="helper_onboarding_en" {...field} />
                  </FormControl>
                  <FormDescription>Lowercase letters, numbers, and underscores only.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Input placeholder="en" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TEMPLATE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="templateFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template format</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TEMPLATE_FORMATS.map((format) => (
                        <SelectItem key={format} value={format}>
                          {format === 'standard' ? 'Standard' : 'Carousel'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Carousel templates show a horizontal card gallery in WhatsApp.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Continue</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
