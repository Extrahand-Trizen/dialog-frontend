import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { getTemplate } from '@/features/templates/api/getTemplate';
import { listTemplates } from '@/features/templates/api/listTemplates';
import { templateKeys } from '@/features/templates/queryKeys';
import type { TemplateSummaryDto } from '@/features/templates/types';
import {
  extractVariableSlots,
  templateHasDynamicUrlButton,
} from '@/features/messages/schemas/sendMessageSchema';
import { useSendReply } from '@/features/inbox/hooks/useSendReply';

const APPROVED_LIST_PARAMS = { page: 1, limit: 100, metaStatus: 'APPROVED' as const };

type ReplyComposerProps = {
  conversationId: string;
  canSendFreeText: boolean;
};

function TemplateReplyForm({ conversationId }: { conversationId: string }) {
  const sendMutation = useSendReply(conversationId);
  const [templateId, setTemplateId] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [buttonUrlSuffix, setButtonUrlSuffix] = useState('');

  const templatesQuery = useQuery({
    queryKey: templateKeys.list(APPROVED_LIST_PARAMS),
    queryFn: () => listTemplates(APPROVED_LIST_PARAMS),
  });

  const templateDetailQuery = useQuery({
    queryKey: templateKeys.detail(templateId),
    queryFn: () => getTemplate({ templateId }),
    enabled: !!templateId,
  });

  const templateOptions: TemplateSummaryDto[] = templatesQuery.data?.items ?? [];
  const selectedTemplate = templateOptions.find((item) => item.id === templateId);

  const variableSlots = useMemo(
    () => extractVariableSlots(templateDetailQuery.data?.currentVersionDetail?.variableSchema),
    [templateDetailQuery.data?.currentVersionDetail?.variableSchema],
  );
  const needsButtonUrlSuffix = useMemo(
    () => templateHasDynamicUrlButton(templateDetailQuery.data?.currentVersionDetail?.components),
    [templateDetailQuery.data?.currentVersionDetail?.components],
  );

  const handleTemplateChange = (value: string) => {
    setTemplateId(value);
    setVariables({});
    setButtonUrlSuffix('');
  };

  const canSubmit = !!selectedTemplate && variableSlots.every((slot) => variables[slot.key]?.trim());

  const onSubmit = async () => {
    if (!selectedTemplate) return;

    const filled: Record<string, string> = {};
    for (const slot of variableSlots) {
      filled[slot.key] = (variables[slot.key] ?? '').trim();
    }
    const suffix = buttonUrlSuffix.trim();
    if (suffix) {
      filled.taskId = suffix;
    }

    await sendMutation.mutateAsync({
      type: 'template',
      template: selectedTemplate.metaTemplateName,
      language: selectedTemplate.language,
      variables: Object.keys(filled).length > 0 ? filled : undefined,
      idempotencyKey: `inbox-${crypto.randomUUID()}`,
    });

    setTemplateId('');
    setVariables({});
    setButtonUrlSuffix('');
  };

  return (
    <div className="space-y-3">
      {templatesQuery.isLoading ? (
        <Skeleton className="h-10" />
      ) : (
        <Select value={templateId} onValueChange={handleTemplateChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an approved template" />
          </SelectTrigger>
          <SelectContent>
            {templateOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.metaTemplateName} ({option.language})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {templateId && templateDetailQuery.isLoading ? <Skeleton className="h-20" /> : null}

      {templateId && !templateDetailQuery.isLoading ? (
        <div className="space-y-2">
          {variableSlots.map((slot) => (
            <Input
              key={slot.key}
              placeholder={slot.label}
              value={variables[slot.key] ?? ''}
              onChange={(e) => setVariables((prev) => ({ ...prev, [slot.key]: e.target.value }))}
            />
          ))}
          {needsButtonUrlSuffix ? (
            <Input
              placeholder="Button link suffix (task id)"
              value={buttonUrlSuffix}
              onChange={(e) => setButtonUrlSuffix(e.target.value)}
            />
          ) : null}
        </div>
      ) : null}

      <Button
        className="w-full"
        disabled={!canSubmit || sendMutation.isPending}
        onClick={() => void onSubmit()}
      >
        <Send className="mr-2 h-4 w-4" />
        {sendMutation.isPending ? 'Sending…' : 'Send template'}
      </Button>
    </div>
  );
}

function TextReplyForm({
  conversationId,
  disabled,
}: {
  conversationId: string;
  disabled?: boolean;
}) {
  const sendMutation = useSendReply(conversationId);
  const [body, setBody] = useState('');

  const onSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed || disabled) return;

    await sendMutation.mutateAsync({
      type: 'text',
      body: trimmed,
      idempotencyKey: `inbox-${crypto.randomUUID()}`,
    });
    setBody('');
  };

  return (
    <div className="flex items-end gap-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={disabled ? 'Waiting for a WhatsApp reply from this number…' : 'Type a message…'}
        className="min-h-10 flex-1 resize-none font-chat text-[14.5px]"
        rows={1}
        disabled={disabled || sendMutation.isPending}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void onSubmit();
          }
        }}
      />
      <Button
        size="icon"
        disabled={disabled || !body.trim() || sendMutation.isPending}
        onClick={() => void onSubmit()}
      >
        <Send className="size-4" />
      </Button>
    </div>
  );
}

export function ReplyComposer({ conversationId, canSendFreeText }: ReplyComposerProps) {
  return (
    <div className="space-y-3 border-t p-3">
      {!canSendFreeText ? (
        <div className="rounded-md border border-amber-200/80 bg-amber-50 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          Type a message after this contact replies on WhatsApp (left-side bubble in this chat).
          Sending a template from here does not unlock typing. Until then you can still send a
          template below.
        </div>
      ) : null}

      <TextReplyForm conversationId={conversationId} disabled={!canSendFreeText} />

      <details className="rounded-md border border-border/60 p-3">
        <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
          Send an approved template
        </summary>
        <div className="mt-3">
          <TemplateReplyForm conversationId={conversationId} />
        </div>
      </details>
    </div>
  );
}
