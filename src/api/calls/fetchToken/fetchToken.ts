import axios, { AxiosError } from "axios";
import { APIReturn, SpotifyResponseError, TokenResponse } from "@/types";

const GRANT_TYPE = "authorization_code";
const REFRESH_GRANT_TYPE = "refresh_token";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

type TokenParams = { code: string; codeVerifier: string } | { refreshToken: string };

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
        errorResponse: error.response?.data as SpotifyResponseError
      };
    });
}
