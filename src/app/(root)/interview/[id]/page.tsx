"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getInterviewById } from "@/api/interview";
import Agent from "@/components/Agent";
import { getCurrentUser, isAuthenticated } from "@/utils/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: RouteParams) {
  const { id } = use(params);
  const router = useRouter();
  const user = getCurrentUser();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/sign-in");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["interview", id],
    queryFn: () => getInterviewById(id),
    enabled: authChecked,
  });

  if (!authChecked) return null;
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <h3 className="capitalize">{data?.interview?.role} Interview</h3>
          </div>
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">
          {data?.interview?.type}
        </p>
      </div>
      <Agent
        userName={user?.name || ""}
        userId={user?.id}
        interviewId={id}
        questions={data?.interview?.questions}
      />
    </>
  );
}
