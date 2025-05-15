import * as React from 'react';
import { Listbox } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ options, value, onChange, className }, ref) => {
    return (
      <div ref={ref} className={cn('relative w-full', className)}>
        <Listbox value={value} onChange={onChange}>
          <Listbox.Button
            className={cn(
              'w-full rounded-md border border-input py-2 px-3 text-left text-white shadow-xs outline-none transition',
              'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/50',
              'selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            )}
          >
            {options.find((o) => o.value === value)?.label || 'Select...'}
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-1 w-full rounded-md bg-neutral-900 border border-input shadow-lg">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active, selected }) =>
                  cn(
                    'cursor-pointer  text-sm select-none py-2 px-3 transition',
                    active ? 'bg-primary text-primary-foreground' : '',
                    selected ? 'font-bold' : '',
                  )
                }
              >
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
    );
  },
);
Select.displayName = 'Select';
