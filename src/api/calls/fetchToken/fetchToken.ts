import axios, { AxiosError } from "axios";
import { APIReturn, SpotifyResponseError, TokenResponse } from "@/types";

const GRANT_TYPE = "authorization_code";
const REFRESH_GRANT_TYPE = "refresh_token";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const TOKEN_REQUEST_TIMEOUT_MS = 10_000;

type TokenParams = { code: string; codeVerifier: string } | { refreshToken: string };

/**
 * Exchanges an authorization code (PKCE) or a refresh token for a Spotify
 * access token by calling Spotify's /api/token endpoint directly.
 *
 * IMPORTANT: This intentionally uses plain `axios`, NOT `axiosInstance`.
 * `axiosInstance` attaches our app's session Bearer token and auto-retries
 * on 401 by calling this function again — if this function itself used
 * axiosInstance, a 401 from Spotify (e.g. an expired refresh token) would
 * trigger that interceptor, which would call fetchToken again, which could
 * 401 again, looping indefinitely. Keep this on plain axios.
 *
 * @param params - Either `{ code, codeVerifier }` for the initial PKCE
 *   exchange, or `{ refreshToken }` to refresh an existing session.
 * @returns `{ data, errorResponse: null }` on success, or
 *   `{ data: null, errorResponse }` on failure. `errorResponse` is Spotify's
 *   parsed error body when available, otherwise `null`.
 */
export async function fetchToken(params: TokenParams): APIReturn<TokenResponse> {
  const body =
    "code" in params
      ? new URLSearchParams({
          grant_type: GRANT_TYPE,
          code: params.code,
          client_id: import.meta.env.VITE_CLIENT_ID,
          redirect_uri: import.meta.env.VITE_REDIRECT_URI,
          code_verifier: params.codeVerifier
        })
      : new URLSearchParams({
          grant_type: REFRESH_GRANT_TYPE,
          refresh_token: params.refreshToken,
          client_id: import.meta.env.VITE_CLIENT_ID
        });

  return axios
    .post(TOKEN_ENDPOINT, body.toString(), {
      timeout: TOKEN_REQUEST_TIMEOUT_MS,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(({ data }: { data: TokenResponse }) => {
      return { data: data, errorResponse: null };
    })
    .catch((error: AxiosError) => {
      return {
        data: null,
        // error.response is undefined for non-HTTP failures (network error,
        // timeout, CORS) — normalize to null instead of undefined so callers
        // can rely on a consistent shape.
        errorResponse: (error.response?.data as SpotifyResponseError) ?? null
      };
    });
}
