import React from 'react';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'file'
  | 'number'
  | 'datetime-local';

interface BaseProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: InputType;
}

interface InputFieldProps<T extends FieldValues> extends BaseProps<T> {
  variant?: 'input';
  valueAsNumber?: boolean;
  min?: number;
  max?: number;
}

interface SelectFieldProps<T extends FieldValues> extends BaseProps<T> {
  variant: 'select';
  options: { value: string; label: string }[];
}

type FormFieldProps<T extends FieldValues> =
  | InputFieldProps<T>
  | SelectFieldProps<T>;

const FormField = <T extends FieldValues>(props: FormFieldProps<T>) => {
  const { control, name, label, placeholder, type = 'text' } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {props.variant === 'select' ? (
              <Select {...field} options={props.options} className="w-full" />
            ) : (
              <Input
                {...field}
                placeholder={placeholder}
                type={type}
                {...(type === 'number'
                  ? {
                      valueAsNumber: props.valueAsNumber,
                      min: props.min,
                      max: props.max,
                    }
                  : {})}
              />
            )}
          </FormControl>
          <FormMessage>{fieldState?.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};

export default FormField;
