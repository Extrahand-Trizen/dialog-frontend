import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TablePaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function TablePagination({ page, totalPages, total, onPageChange }: TablePaginationProps) {
  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between gap-2 pt-2">
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages} · {total} total
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
