import { FileText, MessagesSquare, Plug, Shield, Webhook, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type LandingFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const LANDING_FEATURES: LandingFeature[] = [
  {
    title: 'Template management',
    description:
      'Create, sync, and edit WhatsApp templates with live preview. Pull existing Meta templates into one dashboard.',
    icon: FileText,
  },
  {
    title: 'Reliable delivery',
    description:
      'Track message status from queued to delivered. Idempotent sends and clear error codes for your ops team.',
    icon: MessagesSquare,
  },
  {
    title: 'API-first integrations',
    description:
      'Send template messages from your services with API keys. Event-driven rules map business events to WhatsApp.',
    icon: Plug,
  },
  {
    title: 'Outbound webhooks',
    description:
      'Receive delivery and read receipts on your backend with signed payloads you can verify.',
    icon: Webhook,
  },
  {
    title: 'Multi-number ready',
    description:
      'Connect WhatsApp Business accounts, sync phone numbers, and route sends to the right line.',
    icon: Zap,
  },
  {
    title: 'Built for operators',
    description:
      'Role-based access, audit-friendly activity, and an admin console your team can run day to day.',
    icon: Shield,
  },
];

export const LANDING_STEPS = [
  {
    step: '01',
    title: 'Connect WhatsApp',
    body: 'Link your Meta WhatsApp Business account and sync approved phone numbers.',
  },
  {
    step: '02',
    title: 'Sync templates',
    body: 'Import templates from Meta or compose new ones and submit for approval.',
  },
  {
    step: '03',
    title: 'Integrate & send',
    body: 'Use the REST API or event rules to trigger template messages at scale.',
  },
] as const;
