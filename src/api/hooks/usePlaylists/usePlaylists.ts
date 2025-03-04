import { useQuery } from "@tanstack/react-query";
import { HookReturn, Playlist, SpotifyError } from "@/types";
import { getPlaylists } from "./getPlaylists";

export function usePlaylists(): HookReturn<Playlist[]> {
  const { data, error, isLoading } = useQuery<Playlist[], SpotifyError>({
    queryKey: ["currentUserPlaylists"],
    queryFn: async () => getPlaylists()
  });

  return {
    data: data ?? null,
    error: error ?? null,
    isLoading: isLoading
  };
}
