import axios from "axios";

const PROD_API = "https://dwelledgetest.onrender.com";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? PROD_API : "https://dwelledgetest.onrender.com");

export const api = axios.create({
  baseURL: API_BASE_URL,
});