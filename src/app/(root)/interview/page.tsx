"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createInterview } from "@/api/interview";
import FormField from "@/components/FormField";

const getFormSchema = () => {
  return z.object({
    role: z.string().min(1, "Role is required"),
    experienceLevel: z.string().min(1, "Level is required"),
    numQuestions: z.coerce
      .number()
      .min(1, "Number of questions must be at least 1")
      .max(10, "Maximum 10 questions allowed")
      .int("Please enter a whole number")
      .positive("Number of questions cannot be negative"),
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
      const { role, experienceLevel, numQuestions, interviewType } = values;
      const result = await createInterview({
        role,
        experienceLevel,
        numQuestions,
        interviewType,
      });
      if (result?.success && result.interviewId) {
        toast.success("Interview created!");
        router.push(`/interview/${result.interviewId}`);
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
                  { value: "general", label: "General" },
                ]}
              />

              <FormField
                control={form.control}
                name="numQuestions"
                label="Number of Questions"
                type="number"
                valueAsNumber
                min={1}
                max={10}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer"
              >
                {loading ? "Creating..." : "Create Interview"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
