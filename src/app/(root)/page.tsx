import React from 'react';
import InterviewCard from '@/components/InterviewCard';
import { getCurrentUser } from '@/lib/actions/auth.action';
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';
import StartInterviewCTA from '@/components/StartInterviewCTA';

const Page = async () => {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    redirect('/login');
  }
  const userId = user.id;

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(userId),
    await getLatestInterviews({ userId: userId! }),
  ]);

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (latestInterviews?.length ?? 0) > 0;

  return (
    <>
      <StartInterviewCTA />

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>There are no new interviews available</p>
          )}
        </div>
      </section>
    </>
  );
};
export default Page;
