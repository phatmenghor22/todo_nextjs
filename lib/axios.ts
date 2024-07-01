import axios from "axios";

// BaseURL for fetch Data from API
const axiosInstance = axios.create({
  baseURL: process.env.VERCEL_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
