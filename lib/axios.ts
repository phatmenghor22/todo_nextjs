// lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://todo-menghor.vercel.app",
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
