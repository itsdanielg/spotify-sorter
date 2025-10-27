import { AxiosError } from "axios";
import { axiosInstance } from "@/api";
import { APIReturn, SpotifySimplifiedPlaylist, SpotifyUserPlaylists, SpotifyResponseError } from "@/types";
import { fetchNextRecursive } from "../fetchNextRecursive";

export async function fetchCurrentUserPlaylists(): APIReturn<SpotifySimplifiedPlaylist[]> {
  return axiosInstance
    .get("https://api.spotify.com/v1/me/playlists/", {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(async ({ data }: { data: SpotifyUserPlaylists }) => {
      return await fetchNextRecursive(data.href, [] as SpotifySimplifiedPlaylist[]);
    })
    .catch((error: AxiosError) => {
      return { data: null, errorResponse: error.response?.data as SpotifyResponseError };
    });
}
