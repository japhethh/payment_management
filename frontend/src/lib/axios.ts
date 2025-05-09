import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; // Adjust as needed

const token = localStorage.getItem("token") || "";

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});