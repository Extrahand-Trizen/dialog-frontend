import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AddVariableButtonProps = {
  onInsert: (name: string) => void;
};

export function AddVariableButton({ onInsert }: AddVariableButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    const raw = inputRef.current?.value.trim();
    if (!raw || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(raw)) {
      return;
    }
    onInsert(raw);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="min-w-[140px] flex-1">
        <Input ref={inputRef} placeholder="Variable name" className="h-9" />
      </div>
      <Button type="button" variant="outline" size="sm" onClick={handleClick}>
        + Add variable
      </Button>
    </div>
  );
}
