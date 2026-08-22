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

function TextReplyForm({ conversationId }: { conversationId: string }) {
  const sendMutation = useSendReply(conversationId);
  const [body, setBody] = useState('');

  const onSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;

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
        placeholder="Type a message…"
        className="min-h-10 flex-1 resize-none font-chat text-[14.5px]"
        rows={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void onSubmit();
          }
        }}
      />
      <Button
        size="icon"
        disabled={!body.trim() || sendMutation.isPending}
        onClick={() => void onSubmit()}
      >
        <Send className="size-4" />
      </Button>
    </div>
  );
}

export function ReplyComposer({ conversationId, canSendFreeText }: ReplyComposerProps) {
  const [preferredMode, setPreferredMode] = useState<'text' | 'template'>('text');
  const mode = canSendFreeText ? preferredMode : 'template';

  return (
    <div className="space-y-2 border-t p-3">
      {!canSendFreeText ? (
        <p className="text-xs text-muted-foreground">
          This conversation's 24-hour reply window has closed. Send an approved template to
          re-open it.
        </p>
      ) : (
        <div className="flex justify-end">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={() => setPreferredMode((m) => (m === 'text' ? 'template' : 'text'))}
          >
            {mode === 'text' ? 'Send a template instead' : 'Back to free-text reply'}
          </Button>
        </div>
      )}

      {mode === 'text' && canSendFreeText ? (
        <TextReplyForm conversationId={conversationId} />
      ) : (
        <TemplateReplyForm conversationId={conversationId} />
      )}
    </div>
  );
}
