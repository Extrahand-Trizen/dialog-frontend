import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type TemplatesSelectionBarProps = {
  pageItemIds: string[];
  selectedIds: Set<string>;
  onToggleAllOnPage: (checked: boolean) => void;
  onCancel: () => void;
};

export function TemplatesSelectionBar({
  pageItemIds,
  selectedIds,
  onToggleAllOnPage,
  onCancel,
}: TemplatesSelectionBarProps) {
  const selectedOnPage = pageItemIds.filter((id) => selectedIds.has(id)).length;
  const allOnPageSelected = pageItemIds.length > 0 && selectedOnPage === pageItemIds.length;
  const someOnPageSelected = selectedOnPage > 0 && !allOnPageSelected;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
      <div className="flex items-center gap-2">
        <Checkbox
          id="select-all-templates"
          checked={allOnPageSelected ? true : someOnPageSelected ? 'indeterminate' : false}
          onCheckedChange={(checked) => onToggleAllOnPage(checked === true)}
          aria-label="Select all templates on this page"
        />
        <Label htmlFor="select-all-templates" className="text-sm font-medium">
          Select all on this page
        </Label>
        {selectedIds.size > 0 ? (
          <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
        ) : null}
      </div>
      <Button variant="ghost" size="sm" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
