import { AxiosError } from "axios";
import { axiosInstance } from "@/api";
import { APIReturn, SpotifyPlaylistTrack, SpotifyPlaylistTracks, SpotifyResponseError } from "@/types";
import { fetchNextRecursive } from "../fetchNextRecursive";

export async function fetchPlaylistTracks(playlistId: string): APIReturn<SpotifyPlaylistTrack[]> {
  return axiosInstance
    .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(async ({ data }: { data: SpotifyPlaylistTracks }) => {
      return await fetchNextRecursive(data.href, [] as SpotifyPlaylistTrack[]);
    })
    .catch((error: AxiosError) => {
      return { data: null, errorResponse: error.response?.data as SpotifyResponseError };
    });
}
