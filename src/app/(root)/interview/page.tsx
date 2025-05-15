'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createInterview } from '@/lib/actions/general.action';
import FormField from '@/components/FormField';

const getFormSchema = () => {
  return z.object({
    role: z.string().min(1, 'Role is required'),
    level: z.string().min(1, 'Level is required'),
    amount: z.coerce
      .number()
      .min(1, 'Number of questions must be at least 1')
      .max(10, 'Maximum 10 questions allowed')
      .int('Please enter a whole number')
      .positive('Number of questions cannot be negative'),
    type: z.string().min(1, 'Type is required'),
    techstack: z
      .string()
      .min(1, 'Tech Stack is required')
      .transform((val) =>
        val
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      ),
  });
};

export default function InterviewForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formSchema = getFormSchema();

  const form = useForm<z.input<typeof formSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      role: '',
      level: 'junior',
      amount: 3,
      type: 'technical',
      techstack: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const { role, level, amount, type, techstack } = values;
      const result = await createInterview({
        role,
        level,
        amount,
        type,
        techstack,
      });

      if (result?.success && result.id) {
        toast.success('Interview created!');
        router.push(`/interview/${result.id}`);
      } else {
        toast.error(result?.error || 'Failed to create interview');
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      toast.error('Failed to create interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="card-border lg:min-w-[580px]">
        <div className="flex flex-col items-center justify-center gap-6 card py-10 px-10">
          <h2 className="text-center">Interview Generation</h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 mt-2 form"
            >
              <FormField
                control={form.control}
                name="role"
                label="Role"
                type="text"
                placeholder="e.g. Frontend Developer"
              />
              <FormField
                control={form.control}
                name="level"
                label="Experience Level"
                variant="select"
                placeholder="Choose level"
                options={[
                  { value: 'junior', label: 'Junior' },
                  { value: 'mid', label: 'Mid' },
                  { value: 'senior', label: 'Senior' },
                ]}
              />

              <FormField
                control={form.control}
                name="type"
                label="Interview Type"
                variant="select"
                placeholder="Choose type"
                options={[
                  { value: 'technical', label: 'Technical' },
                  { value: 'behavioral', label: 'Behavioral' },
                  { value: 'mixed', label: 'Mixed' },
                ]}
              />

              <FormField
                control={form.control}
                name="amount"
                label="Number of Questions"
                type="number"
                valueAsNumber
                min={1}
                max={10}
              />
              <FormField
                control={form.control}
                name="techstack"
                label="Tech Stack"
                type="text"
                placeholder="e.g. React, Next.js, TypeScript"
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer"
              >
                {loading ? 'Creating...' : 'Create Interview'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
