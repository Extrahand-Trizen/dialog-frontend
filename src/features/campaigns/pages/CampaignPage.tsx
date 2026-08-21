import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Megaphone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/shared/EmptyState';
import { ListPageShell } from '@/components/shared/ListPageLayout';
import { isDevMockAuthEnabled } from '@/config/dev-mock-auth';
import {
  filterDevMockTemplates,
  getDevMockTemplateDetail,
} from '@/config/dev-mock-data';
import { useAuth } from '@/features/auth/context/AuthProvider';
import {
  type CampaignRecipientResult,
  parseRecipientPhones,
} from '@/features/campaigns/utils/parseRecipients';
import { sendTemplateMessage } from '@/features/messages/api/messagesApi';
import { messageKeys } from '@/features/messages/queryKeys';
import {
  extractVariableSlots,
  parsePhoneNumberId,
  PHONE_DEFAULT_VALUE,
  templateHasDynamicUrlButton,
} from '@/features/messages/schemas/sendMessageSchema';
import { getTemplate } from '@/features/templates/api/getTemplate';
import { listTemplates } from '@/features/templates/api/listTemplates';
import { templateKeys } from '@/features/templates/queryKeys';
import type { TemplateSummaryDto } from '@/features/templates/types';
import { usePhoneNumberOptions } from '@/hooks/use-phone-number-options';
import { getApiErrorMessage } from '@/lib/api-error';
import { canSendMessages } from '@/lib/permissions';
import { cn } from '@/lib/utils';

const APPROVED_LIST_PARAMS = { page: 1, limit: 100, metaStatus: 'APPROVED' as const };
const MAX_RECIPIENTS = 200;

export function CampaignPage() {
  const useMockData = isDevMockAuthEnabled();
  const { user } = useAuth();
  const canSend = canSendMessages(user);
  const queryClient = useQueryClient();
  const phonesQuery = usePhoneNumberOptions(canSend);

  const [templateId, setTemplateId] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState(PHONE_DEFAULT_VALUE);
  const [recipientsRaw, setRecipientsRaw] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [buttonUrlSuffix, setButtonUrlSuffix] = useState('');
  const [results, setResults] = useState<CampaignRecipientResult[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const templatesQuery = useQuery({
    queryKey: templateKeys.list(APPROVED_LIST_PARAMS),
    queryFn: () =>
      useMockData
        ? Promise.resolve(filterDevMockTemplates(APPROVED_LIST_PARAMS))
        : listTemplates(APPROVED_LIST_PARAMS),
    enabled: canSend,
  });

  const templateDetailQuery = useQuery({
    queryKey: templateKeys.detail(templateId),
    queryFn: async () => {
      if (useMockData) {
        const detail = getDevMockTemplateDetail(templateId);
        if (!detail) throw new Error('Template not found');
        return detail;
      }
      return getTemplate({ templateId });
    },
    enabled: canSend && !!templateId,
  });

  const templateOptions: TemplateSummaryDto[] = templatesQuery.data?.items ?? [];
  const selectedTemplate = useMemo(
    () => templateOptions.find((item) => item.id === templateId),
    [templateId, templateOptions],
  );

  const variableSlots = useMemo(
    () => extractVariableSlots(templateDetailQuery.data?.currentVersionDetail?.variableSchema),
    [templateDetailQuery.data?.currentVersionDetail?.variableSchema],
  );

  const needsButtonUrlSuffix = useMemo(
    () => templateHasDynamicUrlButton(templateDetailQuery.data?.currentVersionDetail?.components),
    [templateDetailQuery.data?.currentVersionDetail?.components],
  );

  useEffect(() => {
    if (!templateId) return;
    const next: Record<string, string> = {};
    for (const slot of variableSlots) next[slot.key] = '';
    setVariables(next);
    setButtonUrlSuffix('');
  }, [templateId, variableSlots]);

  const parsed = useMemo(() => parseRecipientPhones(recipientsRaw), [recipientsRaw]);
  const overLimit = parsed.phones.length > MAX_RECIPIENTS;

  const summary = useMemo(() => {
    const queued = results.filter((r) => r.status === 'queued' || r.status === 'duplicate').length;
    const failed = results.filter((r) => r.status === 'failed').length;
    const pending = results.filter((r) => r.status === 'pending' || r.status === 'sending').length;
    return { queued, failed, pending, total: results.length };
  }, [results]);

  async function handleSend() {
    setFormError(null);
    if (!selectedTemplate) {
      setFormError('Select an approved template.');
      return;
    }
    if (parsed.phones.length === 0) {
      setFormError('Add at least one valid recipient phone number.');
      return;
    }
    if (overLimit) {
      setFormError(`Limit is ${MAX_RECIPIENTS} recipients per campaign.`);
      return;
    }
    if (parsed.invalid.length > 0) {
      setFormError(`Fix invalid numbers: ${parsed.invalid.slice(0, 3).join(', ')}`);
      return;
    }

    const filledVariables: Record<string, string> = {};
    for (const slot of variableSlots) {
      const value = variables[slot.key]?.trim() ?? '';
      if (!value) {
        setFormError(`${slot.label} is required.`);
        return;
      }
      filledVariables[slot.key] = value;
    }
    const suffix = buttonUrlSuffix.trim();
    if (needsButtonUrlSuffix && !suffix) {
      setFormError('Button link suffix is required for this template.');
      return;
    }
    if (suffix) filledVariables.taskId = suffix;

    if (useMockData) {
      setFormError('Connect the backend to send campaigns.');
      return;
    }

    const initial: CampaignRecipientResult[] = parsed.phones.map((phone) => ({
      phone,
      status: 'pending',
    }));
    setResults(initial);
    setIsSending(true);

    const next = [...initial];
    for (let i = 0; i < next.length; i += 1) {
      next[i] = { ...next[i], status: 'sending' };
      setResults([...next]);
      try {
        const result = await sendTemplateMessage({
          template: selectedTemplate.metaTemplateName,
          language: selectedTemplate.language,
          to: next[i].phone,
          variables: Object.keys(filledVariables).length > 0 ? filledVariables : undefined,
          idempotencyKey: `campaign-${crypto.randomUUID()}`,
          phoneNumberId: parsePhoneNumberId(phoneNumberId),
        });
        next[i] = {
          ...next[i],
          status: result.duplicate ? 'duplicate' : 'queued',
          messageId: result.messageId,
        };
      } catch (error) {
        next[i] = {
          ...next[i],
          status: 'failed',
          error: getApiErrorMessage(error, 'Send failed'),
        };
      }
      setResults([...next]);
    }

    setIsSending(false);
    void queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
  }

  if (!canSend) {
    return (
      <EmptyState
        title="Campaigns unavailable"
        description="Your role cannot send WhatsApp messages. Ask an admin for Agent or higher access."
      />
    );
  }

  return (
    <ListPageShell>
      <Card className="border-border/70 shadow-none">
        <CardHeader className="flex flex-row items-start gap-3 space-y-0 border-b border-border/60 p-4 sm:p-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Megaphone className="size-4" />
          </div>
          <div className="space-y-1">
            <CardTitle className="font-display text-base font-semibold tracking-tight">
              Campaign send
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Send one approved template to many recipients. Shared variables apply to every number;
              each send uses its own idempotency key.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] lg:gap-8 sm:p-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Template</Label>
              {templatesQuery.isLoading ? (
                <Skeleton className="h-9" />
              ) : (
                <Select value={templateId} onValueChange={setTemplateId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select approved template" />
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
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Sender phone (optional)
              </Label>
              {phonesQuery.isLoading ? (
                <Skeleton className="h-9" />
              ) : (
                <Select value={phoneNumberId} onValueChange={setPhoneNumberId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Default phone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PHONE_DEFAULT_VALUE}>Default phone</SelectItem>
                    {phonesQuery.data?.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {templateId ? (
              <div className="space-y-3 rounded-xl border border-border/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  Shared variables
                </p>
                {templateDetailQuery.isLoading ? (
                  <Skeleton className="h-16" />
                ) : variableSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No body variables for this template.</p>
                ) : (
                  variableSlots.map((slot) => (
                    <div key={slot.key} className="space-y-1.5">
                      <Label className="text-xs">{slot.label}</Label>
                      <Input
                        className="h-9"
                        value={variables[slot.key] ?? ''}
                        onChange={(event) =>
                          setVariables((prev) => ({ ...prev, [slot.key]: event.target.value }))
                        }
                      />
                    </div>
                  ))
                )}
                {needsButtonUrlSuffix ? (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Button link suffix</Label>
                    <Input
                      className="h-9"
                      placeholder="task id"
                      value={buttonUrlSuffix}
                      onChange={(event) => setButtonUrlSuffix(event.target.value)}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-medium text-muted-foreground">Recipients</Label>
                <span
                  className={cn(
                    'text-xs tabular-nums',
                    overLimit ? 'text-destructive' : 'text-muted-foreground',
                  )}
                >
                  {parsed.phones.length} valid
                  {parsed.invalid.length > 0 ? ` · ${parsed.invalid.length} invalid` : ''}
                </span>
              </div>
              <Textarea
                className="min-h-[160px] resize-y font-mono text-sm"
                placeholder={'919876543210\n918765432109\n…'}
                value={recipientsRaw}
                onChange={(event) => setRecipientsRaw(event.target.value)}
                disabled={isSending}
              />
              <p className="text-xs text-muted-foreground">
                One number per line, or comma-separated. Digits with country code. Max{' '}
                {MAX_RECIPIENTS}.
              </p>
            </div>

            {formError ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {formError}
              </p>
            ) : null}

            <Button
              className="h-10 w-full sm:w-auto"
              disabled={isSending || !templateId || parsed.phones.length === 0}
              onClick={() => void handleSend()}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending… {summary.total - summary.pending}/{summary.total}
                </>
              ) : (
                <>
                  <Send className="mr-2 size-4" />
                  Send to {parsed.phones.length || 0} recipient
                  {parsed.phones.length === 1 ? '' : 's'}
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold tracking-tight">Send progress</p>
              {results.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  {summary.queued} queued · {summary.failed} failed
                </p>
              ) : null}
            </div>
            {results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
                Results appear here as each recipient is queued.
              </div>
            ) : (
              <div className="max-h-[28rem] overflow-y-auto rounded-xl border border-border/70">
                <ul className="divide-y divide-border/60">
                  {results.map((row) => (
                    <li
                      key={row.phone}
                      className="flex items-start justify-between gap-3 px-3 py-2.5 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-medium tabular-nums">{row.phone}</p>
                        {row.error ? (
                          <p className="mt-0.5 line-clamp-2 text-xs text-destructive">{row.error}</p>
                        ) : null}
                      </div>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                          row.status === 'queued' || row.status === 'duplicate'
                            ? 'bg-emerald-50 text-emerald-700'
                            : row.status === 'failed'
                              ? 'bg-destructive/10 text-destructive'
                              : row.status === 'sending'
                                ? 'bg-sky-50 text-sky-700'
                                : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {row.status === 'duplicate' ? 'duplicate' : row.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ListPageShell>
  );
}
