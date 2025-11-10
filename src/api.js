// src/api.js
import axios from "axios";
import { getAuthToken, clearAuthToken, getOrCreateDeviceId } from "./auth.js";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.travelhug.ai/",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Always attach X-Device-Id and Authorization (except when getting the token)
apiClient.interceptors.request.use(async (config) => {
  const deviceId = getOrCreateDeviceId();
  config.headers["X-Device-Id"] = deviceId;           // <-- REQUIRED on ALL calls

  if (!config.url.includes("/api/v1/auth/token")) {
    const token = await getAuthToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token once on 401
let refreshing = false;
let queue = [];
const waitForNewToken = () => new Promise((res) => queue.push(res));

apiClient.interceptors.response.use(
  (r) => r,
  async (err) => {
    const orig = err.config || {};
    if (err.response?.status === 401 && !orig._retry && !orig.url.includes("/api/v1/auth/token")) {
      orig._retry = true;
      try {
        if (refreshing) {
          const t = await waitForNewToken();
          orig.headers.Authorization = `Bearer ${t}`;
          orig.headers["X-Device-Id"] = getOrCreateDeviceId();
          return apiClient(orig);
        }
        refreshing = true;
        clearAuthToken();
        const { fetchDeviceToken } = await import("./auth.js");
        const newToken = await fetchDeviceToken();
        queue.forEach((res) => res(newToken));
        queue = [];
        refreshing = false;

        orig.headers.Authorization = `Bearer ${newToken}`;
        orig.headers["X-Device-Id"] = getOrCreateDeviceId();
        return apiClient(orig);
      } catch (e) {
        refreshing = false;
        queue = [];
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

export default apiClient;
