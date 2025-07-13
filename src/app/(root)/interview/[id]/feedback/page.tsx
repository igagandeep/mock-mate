"use client";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getFeedbackByInterviewId, getInterviewById } from "@/api/interview";
import FeedbackButtons from "@/components/FeedbackButtons";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    data: dataInterview,
    isLoading: interviewLoading,
    error: interviewError,
  } = useQuery({
    queryKey: ["interview", id],
    queryFn: () => getInterviewById(id!),
    enabled: !!id,
  });

  const {
    data: dataFeedback,
    isLoading: feedbackLoading,
    error: feedbackError,
  } = useQuery({
    queryKey: ["feedback", id],
    queryFn: () => getFeedbackByInterviewId(id!),
    enabled: !!id,
  });

  if (interviewLoading || feedbackLoading) return <div>Loading...</div>;
  if (interviewError || !dataInterview) {
    router.push("/");
    return null;
  }

  console.log("feedback", dataFeedback);
  console.log("interview", dataInterview);

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">
            {dataInterview?.interview?.role} Interview
          </span>
        </h1>
      </div>

      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-5">
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold">
                {dataFeedback?.feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {dataFeedback?.feedback?.createdAt
                ? dayjs(dataFeedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{dataFeedback?.feedback?.finalAssessment}</p>
      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        {dataFeedback?.feedback?.categoryScores?.map(
          (category: any, index: any) => (
            <div key={index}>
              <p className="font-bold">
                {index + 1}. {category.name} ({category.score}/100)
              </p>
              <p>{category.comment}</p>
            </div>
          )
        )}
      </div>
      <FeedbackButtons interviewId={id} />
    </section>
  );
};
export default Page;
