import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  META_TEMPLATE_STATUSES,
  TEMPLATE_CATEGORIES,
  type MetaTemplateStatus,
  type TemplateCategory,
} from '@/features/templates/types';

type TemplatesFiltersProps = {
  search: string;
  metaStatus: MetaTemplateStatus | undefined;
  category: TemplateCategory | undefined;
  onSearchChange: (value: string) => void;
  onMetaStatusChange: (value: MetaTemplateStatus | undefined) => void;
  onCategoryChange: (value: TemplateCategory | undefined) => void;
};

export function TemplatesFilters({
  search,
  metaStatus,
  category,
  onSearchChange,
  onMetaStatusChange,
  onCategoryChange,
}: TemplatesFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
      <div className="space-y-2">
        <Label htmlFor="template-search">Search</Label>
        <Input
          id="template-search"
          placeholder="Template name…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={metaStatus ?? 'all'}
          onValueChange={(value) =>
            onMetaStatusChange(value === 'all' ? undefined : (value as MetaTemplateStatus))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {META_TEMPLATE_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={category ?? 'all'}
          onValueChange={(value) =>
            onCategoryChange(value === 'all' ? undefined : (value as TemplateCategory))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {TEMPLATE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
