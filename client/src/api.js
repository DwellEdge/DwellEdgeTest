import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://dwelledgetest.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
});