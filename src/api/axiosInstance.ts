import axios from "axios";
import { fetchToken } from "./calls";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const token = window.sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const hasRetried = originalRequest._retry;

    if (!isUnauthorized || hasRetried) return Promise.reject(error);

    originalRequest._retry = true;

    const refreshToken = window.sessionStorage.getItem("refresh_token");
    if (!refreshToken) {
      window.sessionStorage.removeItem("token");
      window.location.href = "/";
      return Promise.reject(error);
    }

    const { data, errorResponse } = await fetchToken({ refreshToken: refreshToken });
    if (!data || errorResponse) {
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("refresh_token");
      window.location.href = "/";
      return Promise.reject(error);
    }

    window.sessionStorage.setItem("token", data.access_token);
    originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
    return axiosInstance(originalRequest);
  }
);

export { axiosInstance };
