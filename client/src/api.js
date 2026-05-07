import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});