"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import { createInterview } from "@/api/interview";

const getFormSchema = () => {
  return z.object({
    role: z.string().min(1, "Role is required"),
    experienceLevel: z.string().min(1, "Experience level is required"),
    numQuestions: z.number().min(1, "Must be at least 1"),
    interviewType: z.string().min(1, "Type is required"),
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
      role: "",
      experienceLevel: "junior",
      numQuestions: 3,
      interviewType: "technical",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const result = await createInterview({
        role: values.role,
        experienceLevel: values.experienceLevel,
        interviewType: values.interviewType,
        numQuestions: values.numQuestions,
      });

      if (result?.success && result.id) {
        toast.success("Interview created!");
        router.push(`/interview/${result.id}`);
      } else {
        toast.error(result?.error || "Failed to create interview");
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error("Failed to create interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center card-border lg:min-w-[580px]">
      <div className="flex flex-col items-center justify-center gap-6 card py-14 px-10">
        <h2 className="text-center">Interview Generation</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
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
              name="experienceLevel"
              label="Experience Level"
              variant="select"
              placeholder="Choose level"
              options={[
                { value: "junior", label: "Junior" },
                { value: "mid", label: "Mid" },
                { value: "senior", label: "Senior" },
              ]}
            />
            <FormField
              control={form.control}
              name="interviewType"
              label="Interview Type"
              variant="select"
              placeholder="Choose type"
              options={[
                { value: "technical", label: "Technical" },
                { value: "behavioral", label: "Behavioral" },
                { value: "mixed", label: "Mixed" },
              ]}
            />
            <FormField
              control={form.control}
              name="numQuestions"
              label="Number of Questions"
              type="number"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Interview"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
