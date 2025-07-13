import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

export const getInterviews = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/interviews`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

interface InterviewPayload {
  role: string;
  experienceLevel: string;
  interviewType: string;
  numQuestions: number;
}

export const createInterview = async (payload: InterviewPayload) => {
  const response = await axios.post(`${API_BASE_URL}/api/interviews`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getInterviewById = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/interviews/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createFeedback = async (interviewId: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/interviews/${interviewId}/feedback`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const saveTranscript = async (
  interviewId: string,
  transcript: {
    speaker: string;
    text: string;
    timestamp: string;
  }[]
) => {
  const res = await axios.patch(
    `${API_BASE_URL}/api/interviews/${interviewId}/transcript`,
    { transcript },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getFeedbackByInterviewId = async (interviewId: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/interviews/${interviewId}/feedback`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
