// src/auth.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "https://api.travelhug.ai/";

// localStorage keys
const K = {
  deviceId: "th_device_id",
  token: "th_token",
  exp: "th_token_expires_at",
};

// persist a device id
export function getOrCreateDeviceId() {
  let id = localStorage.getItem(K.deviceId);
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID())
      || `dev_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(K.deviceId, id);
  }
  return id;
}

// is stored token still valid?
function isTokenValid() {
  const token = localStorage.getItem(K.token);
  const exp = localStorage.getItem(K.exp);
  if (!token || !exp) return false;
  const expMs = Date.parse(exp);
  return Number.isFinite(expMs) && expMs - Date.now() > 30_000; // 30s skew
}

// fetch new device-scoped token (requires X-Device-Id)
export async function fetchDeviceToken() {
  const deviceId = getOrCreateDeviceId();
  const res = await axios.post(
    `${BASE}api/v1/auth/token`,
    {},
    { headers: { "X-Device-Id": deviceId, Accept: "application/json" } }
  );
  const { token, expires_at } = res.data || {};
  if (!token) throw new Error("Auth token missing from response");
  localStorage.setItem(K.token, token);
  if (expires_at) localStorage.setItem(K.exp, expires_at);
  return token;
}

export async function getAuthToken() {
  if (isTokenValid()) return localStorage.getItem(K.token);
  return await fetchDeviceToken();
}

export function clearAuthToken() {
  localStorage.removeItem(K.token);
  localStorage.removeItem(K.exp);
}
