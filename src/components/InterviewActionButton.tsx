'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/Spinner';

interface Props {
  interviewId: string;
  hasFeedback: boolean;
  currentUserId?: string;
}

const InterviewActionButton: React.FC<Props> = ({
  interviewId,
  hasFeedback,
  currentUserId,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  if (!currentUserId) return null;

  const handleClick = () => {
    setLoading(true);
    const path = hasFeedback
      ? `/interview/${interviewId}/feedback`
      : `/interview/${interviewId}`;
    router.push(path);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className="btn-primary w-40"
    >
      {loading ? (
        <Spinner size={18} />
      ) : hasFeedback ? (
        'Check Feedback'
      ) : (
        'View Interview'
      )}
    </Button>
  );
};

export default InterviewActionButton;
