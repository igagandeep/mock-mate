"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import InterviewActionButton from "./InterviewActionButton";
import { getFeedbackByInterviewId } from "@/api/interview";
import { InterviewCardProps, Feedback } from "@/types/index";

const InterviewCard = ({
  id,
  role,
  type,
  finalized,
  createdAt,
}: InterviewCardProps) => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    async function fetchFeedback() {
      if (id) {
        const fb = await getFeedbackByInterviewId(id);
        setFeedback(fb?.feedback || null);
      }
    }
    fetchFeedback();
  }, [id]);

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  console.log("feedback", feedback);

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
            <p className="badge-text">{type}</p>
          </div>

          <Image
            src={getRandomInterviewCover()}
            alt="cover image"
            width={90}
            height={90}
            className="rounded-full object-fit size-[90px]"
          />

          <h3 className="mt-5 capitalize">{role} Interview</h3>

          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                alt="calendar"
                width={22}
                height={22}
              />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" alt="star" width={22} height={22} />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't taken the interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <InterviewActionButton
            interviewId={id!}
            hasFinalized={finalized ?? false}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
