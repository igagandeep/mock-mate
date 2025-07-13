"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getInterviews } from "@/api/interview";
import { isAuthenticated } from "@/utils/auth";

import StartInterviewCTA from "@/components/StartInterviewCTA";
import InterviewCard from "@/components/InterviewCard";
import { Interview } from "@/types/index";

export default function InterviewsList() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/sign-in");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["interviews"],
    queryFn: getInterviews,
    enabled: authChecked,
  });

  if (!authChecked) return null;
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  console.log("interviews", data);

  return (
    <div className="mt-8">
      <StartInterviewCTA />

      <h2 className="text-2xl font-bold my-4">Your Interviews</h2>
      {data?.interviews.length > 0 ? (
        <div className="grid gap-6 grid-cols-3">
          {data?.interviews.map((iv: Interview, idx: number) => (
            <InterviewCard
              key={iv._id || idx}
              id={iv._id}
              role={iv.role}
              type={iv.interviewType}
              finalized={iv.finalized}
              createdAt={iv.createdAt}
            />
          ))}
        </div>
      ) : (
        <p>You don’t have any interviews yet.</p>
      )}
    </div>
  );
}
