import { AxiosError } from "axios";
import { axiosInstance } from "@/api";
import { APIReturn, SpotifyUser, SpotifyResponseError } from "@/types";

export async function fetchCurrentUser(): APIReturn<SpotifyUser> {
  return axiosInstance
    .get(`https://api.spotify.com/v1/me/`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(({ data }: { data: SpotifyUser }) => {
      return { data: data, errorResponse: null };
    })
    .catch((error: AxiosError) => {
      return { data: null, errorResponse: error.response?.data as SpotifyResponseError };
    });
}
