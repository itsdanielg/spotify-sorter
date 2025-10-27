import axios, { AxiosError } from "axios";
import { APIReturn, SpotifyResponseError, TokenResponse } from "@/types";

const GRANT_TYPE = "authorization_code";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

export async function fetchToken(code: string, codeVerifier: string): APIReturn<TokenResponse> {
  const params = new URLSearchParams({
    grant_type: GRANT_TYPE,
    code: code,
    client_id: import.meta.env.VITE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    code_verifier: codeVerifier
  });

  return axios
    .post(TOKEN_ENDPOINT, params.toString(), {
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
