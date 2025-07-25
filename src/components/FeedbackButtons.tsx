"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

interface Props {
  interviewId: string;
}

const FeedbackButtons: React.FC<Props> = ({ interviewId }) => {
  const router = useRouter();
  const [loadingBtn, setLoadingBtn] = useState<"dashboard" | "retake" | null>(
    null
  );

  return (
    <div className="buttons">
      <Button
        className="btn-secondary flex-1"
        onClick={() => {
          setLoadingBtn("dashboard");
          router.push("/");
        }}
        disabled={loadingBtn !== null}
      >
        {loadingBtn === "dashboard" ? (
          <Spinner size={18} />
        ) : (
          <p className="text-sm font-semibold text-primary-200 text-center">
            Back to dashboard
          </p>
        )}
      </Button>
    </div>
  );
};

export default FeedbackButtons;
