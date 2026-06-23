import { useCallback, useEffect, useRef, useState } from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { uploadTemplateMedia } from '@/features/templates/api/uploadTemplateMedia';
import type { TemplateCreateFormValues } from '@/features/templates/schemas';
import { createCarouselCardId } from '@/features/templates/utils/buttonValidation';
import { getApiErrorMessage } from '@/lib/api-error';

const CAROUSEL_MIN_CARDS = 2;
const CAROUSEL_MAX_CARDS = 10;

type CarouselCardsPanelProps = {
  form: UseFormReturn<TemplateCreateFormValues>;
  whatsAppAccountId: string;
  disabled?: boolean;
};

export function CarouselCardsPanel({
  form,
  whatsAppAccountId,
  disabled,
}: CarouselCardsPanelProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'carouselCards',
  });

  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    if (fields.length === 0) {
      append({
        id: createCarouselCardId(),
        imageHandle: '',
        imageFileName: '',
        bodyText: '',
        enableButton: false,
        buttonText: '',
        buttonUrl: '',
      });
      append({
        id: createCarouselCardId(),
        imageHandle: '',
        imageFileName: '',
        bodyText: '',
        enableButton: false,
        buttonText: '',
        buttonUrl: '',
      });
    }
  }, [append, fields.length]);

  const handleUpload = useCallback(
    async (cardId: string, cardIndex: number, file: File) => {
      setUploadingCardId(cardId);
      setUploadError(null);

      const localPreview = URL.createObjectURL(file);

      try {
        const result = await uploadTemplateMedia(whatsAppAccountId, file);
        if (result.format !== 'IMAGE') {
          throw new Error('Carousel cards require JPEG or PNG images');
        }

        setPreviewUrls((prev) => {
          const existing = prev[cardId];
          if (existing) URL.revokeObjectURL(existing);
          return { ...prev, [cardId]: localPreview };
        });

        form.setValue(`carouselCards.${cardIndex}.imageHandle`, result.handle, {
          shouldValidate: true,
        });
        form.setValue(`carouselCards.${cardIndex}.imageFileName`, result.fileName);
      } catch (error) {
        URL.revokeObjectURL(localPreview);
        setUploadError(getApiErrorMessage(error));
      } finally {
        setUploadingCardId(null);
      }
    },
    [form, whatsAppAccountId],
  );

  const handleClearImage = useCallback(
    (cardId: string, cardIndex: number) => {
      setPreviewUrls((prev) => {
        const existing = prev[cardId];
        if (existing) URL.revokeObjectURL(existing);
        const next = { ...prev };
        delete next[cardId];
        return next;
      });
      form.setValue(`carouselCards.${cardIndex}.imageHandle`, '', { shouldValidate: true });
      form.setValue(`carouselCards.${cardIndex}.imageFileName`, '');
    },
    [form],
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Add {CAROUSEL_MIN_CARDS}–{CAROUSEL_MAX_CARDS} cards. Each card needs an image and body text
        (max 160 characters). Optional URL button per card.
      </p>

      {uploadError ? <p className="text-sm text-destructive">{uploadError}</p> : null}

      {fields.map((field, index) => {
        const cardId = field.id;
        const fileName = form.watch(`carouselCards.${index}.imageFileName`);
        const bodyText = form.watch(`carouselCards.${index}.bodyText`) ?? '';
        const enableButton = form.watch(`carouselCards.${index}.enableButton`);
        const previewUrl = previewUrls[cardId];
        const isUploading = uploadingCardId === cardId;

        return (
          <div key={cardId} className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">Card {index + 1}</p>
              {fields.length > CAROUSEL_MIN_CARDS ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled || isUploading}
                  onClick={() => {
                    handleClearImage(cardId, index);
                    remove(index);
                  }}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Remove
                </Button>
              ) : null}
            </div>

            <FormField
              control={form.control}
              name={`carouselCards.${index}.imageHandle`}
              render={() => (
                <FormItem>
                  <FormLabel>Card image</FormLabel>
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      ref={(node) => {
                        inputRefs.current[cardId] = node;
                      }}
                      type="file"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      disabled={disabled || isUploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = '';
                        if (file) {
                          void handleUpload(cardId, index, file);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={disabled || isUploading}
                      onClick={() => inputRefs.current[cardId]?.click()}
                    >
                      {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      {fileName ? 'Replace image' : 'Upload image'}
                    </Button>
                    {fileName ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isUploading}
                        onClick={() => handleClearImage(cardId, index)}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt=""
                      className="mt-2 max-h-32 rounded-md border object-contain"
                    />
                  ) : null}
                  {fileName ? (
                    <FormDescription>Uploaded: {fileName}</FormDescription>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`carouselCards.${index}.bodyText`}
              render={({ field: bodyField }) => (
                <FormItem>
                  <FormLabel>Card body</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Describe this card…" {...bodyField} />
                  </FormControl>
                  <FormDescription>{bodyText.length}/160</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`carouselCards.${index}.enableButton`}
              render={({ field: buttonToggle }) => (
                <FormItem className="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
                  <div>
                    <FormLabel>URL button</FormLabel>
                    <FormDescription>Optional call-to-action on this card</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={buttonToggle.value}
                      onCheckedChange={buttonToggle.onChange}
                      disabled={disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {enableButton ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`carouselCards.${index}.buttonText`}
                  render={({ field: textField }) => (
                    <FormItem>
                      <FormLabel>Button text</FormLabel>
                      <FormControl>
                        <Input placeholder="Shop now" {...textField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`carouselCards.${index}.buttonUrl`}
                  render={({ field: urlField }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Button URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...urlField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : null}
          </div>
        );
      })}

      {fields.length < CAROUSEL_MAX_CARDS ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() =>
            append({
              id: createCarouselCardId(),
              imageHandle: '',
              imageFileName: '',
              bodyText: '',
              enableButton: false,
              buttonText: '',
              buttonUrl: '',
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add card
        </Button>
      ) : null}
    </div>
  );
}
