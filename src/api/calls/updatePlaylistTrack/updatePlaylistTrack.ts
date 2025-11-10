import { AxiosError } from "axios";
import { axiosInstance } from "@/api";
import { APIReturn, SpotifyResponseError } from "@/types";

export async function updatePlaylistTrack(
  playlistId: string,
  startIndex: number,
  endIndex: number
): APIReturn<boolean> {
  if (startIndex === endIndex) return { data: false, errorResponse: null };

  return axiosInstance
    .put(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        range_start: startIndex,
        insert_before: endIndex
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then(() => {
      return { data: true, errorResponse: null };
    })
    .catch((error: AxiosError) => {
      return { data: null, errorResponse: error.response?.data as SpotifyResponseError };
    });
}
