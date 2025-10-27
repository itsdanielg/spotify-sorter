import { AxiosError } from "axios";
import { axiosInstance } from "@/api";
import { APIReturn, SpotifyPlaylistTracks, SpotifyResponseError, SpotifyUserPlaylists } from "@/types";

export type FetchNextRecursiveData = SpotifyUserPlaylists | SpotifyPlaylistTracks;

export async function fetchNextRecursive<T extends FetchNextRecursiveData, V>(
  href: string,
  dataArray: V[]
): APIReturn<V[]> {
  try {
    const { data }: { data: T } = await axiosInstance.get(href, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    dataArray.push(...(data.items as V[]));
    if (data.next) {
      return await fetchNextRecursive(data.next, dataArray);
    }

    return { data: dataArray, errorResponse: null };
  } catch (error: unknown) {
    return { data: null, errorResponse: (error as AxiosError).response?.data as SpotifyResponseError };
  }
}
