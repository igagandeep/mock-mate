'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Spinner from '@/components/Spinner';

const StartInterviewCTA = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    router.push('/interview');
  };

  return (
    <section className="card-cta">
      <div className="flex flex-col gap-6 max-w-lg">
        <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
        <p className="text-lg">
          Practice on real interview questions & get instant feedback
        </p>

        <Button
          onClick={handleStart}
          disabled={loading}
          className="btn-primary max-sm:w-full w-60"
        >
          {loading ? <Spinner size={20} /> : 'Start an Interview'}
        </Button>
      </div>

      <Image
        src="/robot.png"
        alt="robo-dude"
        width={280}
        height={250}
        className="max-sm:hidden -scale-x-100"
      />
    </section>
  );
};

export default StartInterviewCTA;
