import React from 'react';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type: 'text' | 'password' | 'email' | 'file';
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
}: FormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={type} {...field} />
          </FormControl>
          <FormMessage>{fieldState?.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
export default FormField;
