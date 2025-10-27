import { useEffect, useState } from "react";
import { fetchToken } from "@/api";

export function useToken(): { token: string; removeToken: () => void } {
  const [token, setToken] = useState(() => {
    return window.sessionStorage.getItem("token") ?? "";
  });

  useEffect(() => {
    const getToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) return;

      const codeVerifier = window.sessionStorage.getItem("code_verifier");
      if (!codeVerifier) {
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      const { data, errorResponse } = await fetchToken({ code: code, codeVerifier: codeVerifier });
      if (!data) {
        console.error("Error fetching token:", errorResponse);
        return;
      }

      window.sessionStorage.setItem("token", data.access_token);
      if (data.refresh_token) {
        window.sessionStorage.setItem("refresh_token", data.refresh_token);
      }

      setToken(data.access_token);
      window.sessionStorage.removeItem("code_verifier");
      window.history.replaceState({}, document.title, window.location.pathname);
    };

    getToken();
  }, []);

  function removeToken(): void {
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("refresh_token");
    window.location.href = "/";
  }

  return { token, removeToken };
}
