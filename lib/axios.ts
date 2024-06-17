// lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.VERCEL_URL,
  timeout: 4000,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
