import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Register new user
export const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/register`, payload);
  return response.data;
};

// Login existing user
export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, payload);
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/logout`);
  return response.data;
};
