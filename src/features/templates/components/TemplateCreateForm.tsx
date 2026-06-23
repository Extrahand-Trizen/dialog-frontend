import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { HeaderMediaUpload } from '@/features/templates/components/HeaderMediaUpload';
import { CarouselCardsPanel } from '@/features/templates/components/CarouselCardsPanel';
import { AddVariableButton } from '@/features/templates/components/AddVariableButton';
import { TemplateButtonsPanel } from '@/features/templates/components/TemplateButtonsPanel';
import { TemplatePreviewPanel } from '@/features/templates/components/TemplatePreviewPanel';
import { VariableFieldsPanel } from '@/features/templates/components/VariableFieldsPanel';
import {
  TEMPLATE_CREATE_DEFAULTS,
  templateCreateFormSchema,
  type TemplateCreateFormValues,
} from '@/features/templates/schemas';
import { TEMPLATE_CATEGORIES, type TemplateHeaderType } from '@/features/templates/types';
import { useTemplateCreateLivePreview } from '@/features/templates/hooks/useTemplateCreateLivePreview';
import {
  insertPlaceholderAtCursor,
} from '@/features/templates/utils/templateVariables';

type TemplateCreateFormProps = {
  whatsAppAccountId: string;
  mode?: 'create' | 'edit';
  onSubmit: (values: TemplateCreateFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  initialValues?: Partial<TemplateCreateFormValues>;
};

const HEADER_TYPE_OPTIONS: { value: TemplateHeaderType; label: string }[] = [
  { value: 'none', label: 'No header' },
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'document', label: 'Document' },
];

export function TemplateCreateForm({
  whatsAppAccountId,
  mode = 'create',
  onSubmit,
  isSubmitting,
  onCancel,
  initialValues,
}: TemplateCreateFormProps) {
  const isEditMode = mode === 'edit';
  const form = useForm<TemplateCreateFormValues>({
    resolver: zodResolver(templateCreateFormSchema),
    defaultValues: { ...TEMPLATE_CREATE_DEFAULTS, ...initialValues },
  });

  const watched = useWatch({ control: form.control });
  const headerType = watched.headerType ?? 'none';
  const enableFooter = watched.enableFooter ?? false;
  const headerText = watched.headerText;
  const bodyText = watched.bodyText ?? '';
  const headerMediaFileName = watched.headerMediaFileName;

  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | undefined>();
  const [bodySelection, setBodySelection] = useState({ start: 0, end: 0 });

  useEffect(() => {
    return () => {
      if (mediaPreviewUrl) {
        URL.revokeObjectURL(mediaPreviewUrl);
      }
    };
  }, [mediaPreviewUrl]);

  const preview = useTemplateCreateLivePreview(form, mediaPreviewUrl);
  const isCarousel = (watched.templateFormat ?? 'standard') === 'carousel';

  const clearMedia = useCallback(() => {
    setMediaPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return undefined;
    });
    form.setValue('headerMediaHandle', '');
    form.setValue('headerMediaFormat', undefined);
    form.setValue('headerMediaFileName', '');
  }, [form]);

  const handleHeaderTypeChange = useCallback(
    (value: TemplateHeaderType) => {
      const previous = form.getValues('headerType');
      form.setValue('headerType', value);
      if (value !== 'text') {
        form.setValue('headerText', '');
      }
      const hadMedia =
        previous === 'image' || previous === 'video' || previous === 'document';
      const wantsMedia = value === 'image' || value === 'video' || value === 'document';
      if (!wantsMedia || (hadMedia && value !== previous)) {
        clearMedia();
      }
    },
    [clearMedia, form],
  );

  const handleInsertVariable = useCallback(
    (variableName: string) => {
      const current = form.getValues('bodyText') ?? '';
      const { nextValue, nextCursor } = insertPlaceholderAtCursor(
        current,
        bodySelection.start,
        bodySelection.end,
        variableName,
      );
      form.setValue('bodyText', nextValue, { shouldValidate: true });
      setBodySelection({ start: nextCursor, end: nextCursor });
    },
    [bodySelection.end, bodySelection.start, form],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isEditMode ? 'Template metadata' : 'Template details'}</CardTitle>
                <CardDescription>
                  {isEditMode
                    ? 'Name, language, and category are fixed after creation.'
                    : 'Name and category are submitted to Meta for approval.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Template name</FormLabel>
                      <FormControl>
                        <Input placeholder="june_sales_1" disabled={isEditMode} {...field} />
                      </FormControl>
                      <FormDescription>Lowercase, underscores only — used in send API.</FormDescription>
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
                        <Input placeholder="en" disabled={isEditMode} {...field} />
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isEditMode}
                      >
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
              </CardContent>
            </Card>

            {!isCarousel ? (
              <Card>
                <CardHeader>
                  <CardTitle>Header</CardTitle>
                  <CardDescription>Optional text, image, video, or document header.</CardDescription>
                </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="headerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Header type</FormLabel>
                      <Select
                        onValueChange={(value) => handleHeaderTypeChange(value as TemplateHeaderType)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {HEADER_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {headerType === 'text' ? (
                  <FormField
                    control={form.control}
                    name="headerText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Header text</FormLabel>
                        <FormControl>
                          <Input placeholder="{{month}} Sale Offer" {...field} />
                        </FormControl>
                        <FormDescription>
                          Use named placeholders like {'{{month}}'} — mapped to Meta on submit.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}

                {headerType === 'image' || headerType === 'video' || headerType === 'document' ? (
                  <FormField
                    control={form.control}
                    name="headerMediaHandle"
                    render={() => (
                      <FormItem>
                        <FormLabel>
                          {headerType === 'image'
                            ? 'Header image'
                            : headerType === 'video'
                              ? 'Header video'
                              : 'Header document'}
                        </FormLabel>
                        <HeaderMediaUpload
                          whatsAppAccountId={whatsAppAccountId}
                          headerType={headerType}
                          fileName={headerMediaFileName}
                          previewUrl={mediaPreviewUrl}
                          onUploaded={(result) => {
                            setMediaPreviewUrl((prev) => {
                              if (prev) URL.revokeObjectURL(prev);
                              return result.previewUrl;
                            });
                            form.setValue('headerMediaHandle', result.handle, {
                              shouldValidate: true,
                            });
                            form.setValue('headerMediaFormat', result.format);
                            form.setValue('headerMediaFileName', result.fileName);
                          }}
                          onClear={clearMedia}
                          disabled={isSubmitting}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}
              </CardContent>
            </Card>
            ) : null}

            <Card>
              <CardHeader>
                <CardTitle>{isCarousel ? 'Intro message' : 'Body'}</CardTitle>
                <CardDescription>
                  {isCarousel
                    ? 'Required intro text shown above the carousel (max 1024 characters).'
                    : 'Required message body (max 1024 characters).'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="bodyText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body text</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="Hi {{name}}, shop before the sale ends this month."
                          {...field}
                          onSelect={(event) => {
                            const target = event.target as HTMLTextAreaElement;
                            setBodySelection({
                              start: target.selectionStart ?? 0,
                              end: target.selectionEnd ?? 0,
                            });
                          }}
                          onClick={(event) => {
                            const target = event.target as HTMLTextAreaElement;
                            setBodySelection({
                              start: target.selectionStart ?? 0,
                              end: target.selectionEnd ?? 0,
                            });
                          }}
                          onKeyUp={(event) => {
                            const target = event.currentTarget;
                            setBodySelection({
                              start: target.selectionStart ?? 0,
                              end: target.selectionEnd ?? 0,
                            });
                          }}
                        />
                      </FormControl>
                      <FormDescription>{bodyText.length}/1024</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AddVariableButton onInsert={handleInsertVariable} />
                {!isCarousel ? (
                  <VariableFieldsPanel form={form} headerText={headerText} bodyText={bodyText} />
                ) : null}
              </CardContent>
            </Card>

            {isCarousel ? (
              <Card>
                <CardHeader>
                  <CardTitle>Carousel cards</CardTitle>
                  <CardDescription>
                    Each card includes an image, body text, and optional URL button.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CarouselCardsPanel
                    form={form}
                    whatsAppAccountId={whatsAppAccountId}
                    disabled={isSubmitting}
                  />
                </CardContent>
              </Card>
            ) : null}

            {!isCarousel ? (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Footer</CardTitle>
                      <CardDescription>Optional footer line (max 60 characters).</CardDescription>
                    </div>
                    <FormField
                      control={form.control}
                      name="enableFooter"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardHeader>
                  {enableFooter ? (
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="footerText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Footer text</FormLabel>
                            <FormControl>
                              <Input placeholder="Support Team" {...field} />
                            </FormControl>
                            <FormDescription>{(field.value ?? '').length}/60</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  ) : null}
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Buttons</CardTitle>
                    <CardDescription>
                      Quick replies or call-to-action buttons (Meta allows one group per template).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TemplateButtonsPanel form={form} />
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <TemplatePreviewPanel
              templateKind={preview.templateKind}
              headerType={preview.headerType}
              headerText={preview.headerText}
              bodyText={preview.bodyText}
              footerText={preview.footerText}
              buttons={preview.buttons}
              carouselCards={preview.carouselCards}
              mediaPreviewUrl={mediaPreviewUrl}
              placeholderSeed={form.getValues('name') || 'draft'}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEditMode ? 'Submit update for approval' : 'Submit for approval'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
