import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { fetchToken } from "./calls";

/**
 * Axios instance for all authenticated calls to the spotify API.
 *
 * - Request interceptor: attaches the current session's access token as a
 *   Bearer header on every outgoing request.
 * - Response interceptor: on a 401, transparently refreshes the access
 *   token (via `fetchToken`) and retries the original request once. If
 *   there's no refresh token, or the refresh itself fails, clears the
 *   session and redirects to "/" to force re-login.
 *
 * Use this for any authenticated call to the spotify API. Do NOT use this for
 * third-party APIs with their own auth scheme (e.g. Spotify's token
 * endpoint in `fetchToken`) — our session token is meaningless there, and
 * since this instance calls `fetchToken` to refresh, routing `fetchToken`
 * itself through this instance risks an infinite refresh loop.
 */
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = window.sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Shared in-flight refresh, so a burst of requests that all 401 at once
// (e.g. several parallel calls right as the token expires) triggers a
// single refresh call instead of one per request.
let refreshPromise: ReturnType<typeof fetchToken> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (NonNullable<typeof error.config> & { _retry?: boolean }) | undefined;
    const isUnauthorized = error.response?.status === 401;

    if (!originalRequest || !isUnauthorized || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = window.sessionStorage.getItem("refresh_token");
    if (!refreshToken) {
      window.sessionStorage.removeItem("token");
      window.location.href = "/";
      return Promise.reject(error);
    }

    refreshPromise ??= fetchToken({ refreshToken }).finally(() => {
      refreshPromise = null;
    });

    const { data, errorResponse } = await refreshPromise;
    if (!data || errorResponse) {
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("refresh_token");
      window.location.href = "/";
      return Promise.reject(error);
    }

    window.sessionStorage.setItem("token", data.access_token);
    return axiosInstance(originalRequest);
  }
);

export { axiosInstance };
