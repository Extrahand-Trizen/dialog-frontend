import { format } from 'date-fns';

export function formatCampaignTime(iso: string): string {
  return format(new Date(iso), 'd MMM yyyy, h:mm a');
}
