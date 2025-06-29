import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getInterviews = async () => {
  const response = await axios.get(`${API_BASE_URL}/interviews`);
  return response.data;
};

export const createInterview = async (payload: {
  title: string;
  description: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/interviews`, payload);
  return response.data;
};
